from sqlalchemy import select, func, cast, and_, Date, extract, literal, Numeric, union_all, Integer, case, or_, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.model.consumer import ConsumerMeter
from ...gis.franchise_area.model.villages import Village
from ...gis.franchise_area.model.municipality import Municipality
from fastapi import Depends, HTTPException, status
from datetime import date
from typing import Optional
from ...events.model.events import Events
from ..schema.response import AgmaSetup
import pytz
from pprint import pprint


class GetAgmaRegistrationService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.year_now = date.today().year
        self.PAGESIZE = 20

    # VERIFY REGISTRATION

    async def verify_registration(self, account_no: str) -> bool:
        try:
            stmt = (select(AgmaRegistration)
                    .where(
                        and_(extract("year", cast(AgmaRegistration.timestamped, Date)) == self.year_now, AgmaRegistration.account_no == account_no)))
            data = (await self.session.execute(stmt)).scalar_one_or_none()
            if not data:
                return False
            return True
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_registered(self, id: str):
        stmt = (select(AgmaRegistration)
                .options(selectinload(AgmaRegistration.consumer)
                         .selectinload(ConsumerMeter.village),
                         selectinload(AgmaRegistration.consumer)
                         .selectinload(ConsumerMeter.municipal))
                .where(AgmaRegistration.id == id))
        d = (await self.session.execute(stmt)).scalars().one()
        return {
            "id":str(d.id),
            "account_no": d.account_no,
            "name": d.name,
            "phone": d.phone,
            "image": d.image,
            "signature": d.signature,
            "account_name": d.consumer.account_name,
            "village": d.consumer.village.name,
            "municipality": d.consumer.municipal.name,
            "meter_no": d.consumer.meter_no,
            "meter_brand": d.consumer.meter_brand,
            "date_registered": d.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
            "time_registered": d.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
            "year": d.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y"),
        }
    # GET STATS

    async def get_stats(self):
        try:
            # Total Registered
            total_registered = (
                select(
                    literal("Total").label("title"),
                    func.count(AgmaRegistration.id).label("value"),
                    literal("Registered").label("description"),
                    literal(False).label("is_percentage")
                )

            ).cte("total_registered")

            # Total Consumer
            total_consumer = (
                select(
                    func.count(
                        ConsumerMeter.id
                    ).label("value"),
                )
            ).cte("total_consumer")

            # Percentage form total consumer
            percent_registered = (
                select(
                    literal("Percentage").label("title"),
                    func.coalesce(func.round((func.cast(total_registered.c.value, Numeric) /
                                  func.cast(total_consumer.c.value, Numeric)) * 100, 2), 0).label("value"),
                    literal(f"% from total consumer").label("description"),
                    literal(True).label("is_percentage")
                ).select_from(total_consumer)
                .select_from(total_registered)

            ).cte("percent_registered")

            # DAILY
            average_daily = (
                select(
                    literal("Average").label("title"),
                    func.coalesce(
                        func.count(AgmaRegistration.id).cast(Integer) /
                        func.nullif(func.count(func.distinct(
                            func.date(AgmaRegistration.timestamped))), 0), 0
                    ).cast(Integer).label("value"),
                    literal("Daily").label("description"),
                    literal(False).label("is_percentage")
                )).cte("average_daily")

            # TODAY
            total_today = (
                select(
                    literal("Today").label("title"),
                    func.coalesce(func.count(AgmaRegistration.id),
                                  0).label("value"),
                    literal(date.today().strftime(
                        "%B %d %Y")).label("description"),
                    literal(False).label("is_percentage")
                ).where(func.date(AgmaRegistration.timestamped) == func.current_date())).cte("total_today")

            # UNION ALL
            stmt = union_all(
                select(
                    total_registered.c.title,
                    total_registered.c.value,
                    total_registered.c.description,
                    total_registered.c.is_percentage
                ),
                select(
                    percent_registered.c.title,
                    percent_registered.c.value,
                    percent_registered.c.description,
                    percent_registered.c.is_percentage),
                select(
                    average_daily.c.title,
                    average_daily.c.value,
                    average_daily.c.description,
                    average_daily.c.is_percentage
                ),

                select(
                    total_today.c.title,
                    total_today.c.value,
                    total_today.c.description,
                    total_today.c.is_percentage
                ),
            )

            data = (await self.session.execute(stmt)).mappings().all()
            return data
        except Exception as e:
            pprint(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # GET ALL DATA
    async def get_all_registered(self,
                                 search: Optional[str] = None,
                                 page: Optional[int] = 1,
                                 year: Optional[int] = None,
                                 barangay: Optional[str] = None):
        try:
            stmt = (select(AgmaRegistration)
                    .join(AgmaRegistration.consumer)
                    .join(ConsumerMeter.village)
                    .join(ConsumerMeter.municipal)
                    .options(selectinload(AgmaRegistration.consumer)
                             .selectinload(ConsumerMeter.village),
                             selectinload(AgmaRegistration.consumer)
                             .selectinload(ConsumerMeter.municipal))
                    .limit(self.PAGESIZE))
            if search:
                stmt = stmt.where(
                    or_(AgmaRegistration.name.ilike(f"%{search}%"),
                        AgmaRegistration.phone.ilike(f"%{search}%"),
                        Village.name.ilike(f"%{search}%"),
                        ConsumerMeter.account_no.ilike(f"%{search}%"),
                        ConsumerMeter.account_name.ilike(f"{search}%"),
                        ConsumerMeter.meter_no.ilike(f"%{search}%"),
                        ConsumerMeter.meter_brand.ilike(f"%{search}%"),
                        Municipality.name.ilike(f"%{search}%"),
                        ))
            else:
                stmt = stmt.offset(
                    (page - 1) * self.PAGESIZE).order_by(AgmaRegistration.timestamped.desc())
                if year:
                    stmt = stmt.where(extract("year", cast(
                        AgmaRegistration.timestamped, Date)) == year)
                if barangay:
                    stmt = stmt.where(Village.name == barangay)
            results = (await self.session.execute(stmt)).scalars().all()

            # TOTAL PAGE
            stmt = (select(func.count(AgmaRegistration.id)))
            total = (await self.session.execute(stmt)).scalar_one_or_none()
            total_page = total // self.PAGESIZE if total % self.PAGESIZE == 0 else total // self.PAGESIZE + 1
            data = [{
                "id": str(res.id),
                "account_no": res.account_no,
                "name": res.name,
                "phone": res.phone,
                "image": res.image,
                "signature": res.signature,
                "account_name": res.consumer.account_name,
                "village": res.consumer.village.name,
                "municipality": res.consumer.municipal.name,
                "meter_no": res.consumer.meter_no,
                "meter_brand": res.consumer.meter_brand,
                "date_registered": res.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
                "time_registered": res.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
                "year": res.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y"),

            }
                for res in results
            ]
            
            return {
                "data": data,
                "total_page": total_page
            }
        except Exception as e:
            pprint(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_filters(self):
        try:
            year = (await self.session.execute(select(func.distinct(func.extract("year", AgmaRegistration.timestamped))))).scalars().all()
            barangay_stmt = (await self.session.execute(select(AgmaRegistration).options(
                selectinload(AgmaRegistration.consumer)
                .selectinload(ConsumerMeter.village)))).scalars().all()
            barangay = list(
                set([res.consumer.village.name for res in barangay_stmt]))
            return {"year": year, "barangay": barangay}
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(
                    e)
            )

    async def get_agma_setup(self):
        try:
            stmt = select(
                Events.id,
                Events.title,
                Events.description,
                Events.start_date,
                Events.end_date,
                Events.start_time,
                Events.end_time,
                case(

                    (func.now().between(Events.start_date + Events.start_time,
                                        Events.end_date + Events.end_time), literal(True)),
                    else_=literal(False)
                ).label("is_active")
            ).where(Events.title.ilike("%AGMA%"))
            result = (await self.session.execute(stmt)).mappings().one()
            return result
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_graph_data(self, municipality: Optional[str] = None):
        stmt = (select(Village.name.label("name"), func.count(Village.name).label("value"))
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.village)
                .join(ConsumerMeter.municipal)
                .group_by(Village.name)
                .order_by(Village.name.asc()))
        if municipality:
            stmt = stmt.where(Municipality.name.ilike(f"%{municipality}%"))
        count_per_village = (await self.session.execute(
            stmt
        )).mappings().all()
        return count_per_village

    async def get_registered_overtime(self):
        try:
            registered = (select(
                AgmaRegistration.account_no,
                func.date(AgmaRegistration.timestamped).label("date"),
                Municipality.name.label("municipality"),
            )
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.municipal)).cte("registered")
            cumulative_cte = (select(
                registered.c.date,
                registered.c.municipality,
                func.count(registered.c.account_no).label("count"),
                func.sum(func.count(registered.c.account_no)).over(
                    partition_by=registered.c.municipality,
                    order_by=registered.c.date
                ).label("cumulative_sum")
            ).select_from(registered)
                .group_by(registered.c.date, registered.c.municipality)
            ).cte("cumulative_cte")

            stmt = (
                select(
                    cumulative_cte.c.date.label("name"),
       
                        func.max(cumulative_cte.c.cumulative_sum).filter(
                            cumulative_cte.c.municipality == "CORON").label("coron"),

                        func.max(cumulative_cte.c.cumulative_sum).filter(
                            cumulative_cte.c.municipality == "CULION"
                        ).label("culion"),

                        func.max(cumulative_cte.c.cumulative_sum).filter(
                            cumulative_cte.c.municipality == "BUSUANGA"
                        ).label("busuanga"),

                        func.max(cumulative_cte.c.cumulative_sum).filter(
                            cumulative_cte.c.municipality == "LINAPACAN"
                        )
                        .label("linapacan"),
                )
                .select_from(cumulative_cte)
                .group_by(cumulative_cte.c.date)
                .order_by(cumulative_cte.c.date))

            result = (await self.session.execute(stmt)).mappings().all()
            return result
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
