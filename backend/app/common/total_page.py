from sqlalchemy.orm import DeclarativeBase
from typing import Type
from sqlalchemy import select, func, Select
from sqlalchemy.ext.asyncio import AsyncSession
from math import ceil 

async def get_total_page(session: AsyncSession, pagesize:int, stmt:Select) -> int:
    count_stmt = (select(func.count()).select_from(stmt.subquery()))
    total = (await session.execute(count_stmt)).scalar()
    total_page = ceil(total / pagesize)
    return total_page