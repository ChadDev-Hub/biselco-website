from sqlalchemy.orm import DeclarativeBase
from typing import Type
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession


async def get_total_page(session: AsyncSession, model:Type[DeclarativeBase], pagesize:int) -> int:
    total_page_stmt = (await session.execute(select(func.count()).select_from(model))).scalar_one()
    total_page = 1
    if total_page_stmt:
        total_page = total_page_stmt // pagesize if total_page_stmt % pagesize == 0 else total_page_stmt // pagesize+ 1
    return total_page