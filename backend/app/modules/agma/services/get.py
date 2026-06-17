from sqlalchemy import select, func, cast, and_, Date, extract, literal, Numeric, union_all, Integer, case, or_, true
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import NoResultFound
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.model.consumer import ConsumerMeter
from ...gis.franchise_area.model.villages import Village
from ...gis.franchise_area.model.municipality import Municipality
from fastapi import Depends, HTTPException, status
from datetime import date, datetime
from typing import Optional
from ...events.model.events import Events
from ..schema.response import AgmaSetup
import pytz
import random
from ..schema.response import RaffleStats, CountItem
from pprint import pprint


class GetAgmaRegistrationService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.year_now = date.today().year
        self.PAGESIZE = 20
        self.RAFFLE_ENTRIES_LIMIT = 100
        self.tz = pytz.timezone('Asia/Manila')
        self.date_now = datetime.now(self.tz).date()
        self.now = datetime.now(self.tz)
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
        try: 
            stmt = (select(AgmaRegistration)
                    .options(selectinload(AgmaRegistration.consumer)
                            .selectinload(ConsumerMeter.village),
                            selectinload(AgmaRegistration.consumer)
                            .selectinload(ConsumerMeter.municipal))
                    .where(AgmaRegistration.id == id))
            d = (await self.session.execute(stmt)).scalars().one()
            return {
                "id": str(d.id),
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
        except NoResultFound:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No Registered Consumer Found",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
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
                ).where(ConsumerMeter.is_agma)
            ).cte("total_consumer")

            # Percentage form total consumer
            percent_registered = (
                select(
                    literal("Percentage").label("title"),
                    case(
                        (
                            total_consumer.c.value > 0,
                            func.round(
                                (
                                    cast(total_registered.c.value, Numeric)
                                    / cast(total_consumer.c.value, Numeric)
                                ) * 100,
                                2
                            )
                        ),
                        else_=0
                    ).label("value"),
                    literal("% from total consumer").label("description"),
                    literal(True).label("is_percentage")
                )
                .select_from(total_consumer.join(total_registered, true(    )))
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
                "sample_bill": res.sample_bill,
                "authorization_letter": res.authorization_letter

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

                    (func.timezone('Asia/Manila', func.now()).between(
                        Events.start_date + Events.start_time,
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
                func.extract(
                    "hour", AgmaRegistration.timestamped).label("date"),
                Municipality.name.label("municipality"),
            )
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.municipal)
                .where(func.date(AgmaRegistration.timestamped) == self.date_now)).cte("registered")
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
            data = [
                {
                    "name": f"{int(res['name']):02d}:00",
                    "coron": res["coron"],
                    "culion": res["culion"],
                    "busuanga": res["busuanga"],
                    "linapacan": res["linapacan"],
                }
                for res in result
            ]
            return data
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_initial_raffle_entries(self):
        try:
            stmt = (select(AgmaRegistration.account_no)
                    .where(AgmaRegistration.is_winner == False,
                           AgmaRegistration.is_dismissed == False,
                           func.extract("YEAR", func.current_date()) == func.extract("YEAR", AgmaRegistration.timestamped))
                    .order_by(func.random())
                    .limit(self.RAFFLE_ENTRIES_LIMIT))
            result = (await self.session.execute(stmt)).scalars().all()
            return result
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def raffle_spin(self):
        try:
            entries = (select(AgmaRegistration.account_no)
                       .where(
                           AgmaRegistration.is_winner == False,
                           AgmaRegistration.is_dismissed == False,
                           func.extract("YEAR", func.current_date()) == func.extract("YEAR", AgmaRegistration.timestamped))
                       .order_by(func.random())
                       .limit(self.RAFFLE_ENTRIES_LIMIT)).cte("entries")
            entry_result = (await self.session.execute(select(entries.c.account_no))).scalars().all()

            random_winner = random.randint(0, len(entry_result) - 1)

            return {
                "entries": entry_result,
                "pending_winner": entry_result[random_winner],
                "pending_winner_idx": random_winner
            }

        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No Registered Consumer Found"
            )
        except Exception as e:
            print(e.args)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def winner_info(self, account_no: str):
        try:
            stmt = (select(
                AgmaRegistration.id,
                AgmaRegistration.account_no,
                ConsumerMeter.account_name.label("name"),
                AgmaRegistration.image,
                Village.name.label("village"),
                Municipality.name.label("municipality"),
            )
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.municipal)
                .join(ConsumerMeter.village)
                .where(AgmaRegistration.account_no == account_no))
            result = (await self.session.execute(stmt)).mappings().one()
            return {
                "id": str(result["id"]),
                "account_no": result["account_no"],
                "name": result["name"],
                "image": result["image"],
                "village": result["village"],
                "municipality": result["municipality"],
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def raffle_stats(self):
        try:
            count_per_municipality = (await self.session.execute(
                select(
                    Municipality.name.label("name"),
                    func.count(AgmaRegistration.id).label("value"),
                )
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.municipal)
                .where(AgmaRegistration.is_winner == True)
                .group_by(Municipality.name)
                .order_by(Municipality.name.asc()))).mappings().all()
            count_village = (await self.session.execute(
                select(
                    Village.name.label("name"),
                    func.count(AgmaRegistration.id).label("value")
                )
                .join(AgmaRegistration.consumer)
                .join(ConsumerMeter.village)
                .where(AgmaRegistration.is_winner == True)
                .group_by(Village.name)
                .order_by(Village.name.asc()))).mappings().all()
            return RaffleStats(
                w_per_mun=[
                    CountItem(**dict(row)) for row in count_per_municipality],
                w_per_vill=[CountItem(**dict(row)) for row in count_village])
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
