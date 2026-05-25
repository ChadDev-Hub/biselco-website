from sqlalchemy import select, func, cast, and_, Date, extract, literal, Numeric, union_all, Integer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.model.consumer import ConsumerMeter
from fastapi import Depends, HTTPException, status
from datetime import date
import pytz
from pprint import pprint


class GetAgmaRegistrationService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.year_now = date.today().year

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
        }

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
                )

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
                    literal(date.today().strftime("%B %d %Y")).label("description"),
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

    async def get_all_registered(self):
        stmt = (select(AgmaRegistration)
                .options(selectinload(AgmaRegistration.consumer)
                         .selectinload(ConsumerMeter.village),
                         selectinload(AgmaRegistration.consumer)
                         .selectinload(ConsumerMeter.municipal))
                .order_by(AgmaRegistration.timestamped.desc()))
        results = (await self.session.execute(stmt)).scalars().all()
        data = [{
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
        }
            for res in results
        ]
        return data