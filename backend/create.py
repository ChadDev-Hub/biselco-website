import asyncio
from app.db.engine import create_table, engine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert
import app.models
from app.models import Permissions, Roles

async def create_permission_and_rules():
    roles_permission= {
        "admin": ["view:all", "create:all", "delete:all", "post:all"],
        "mco": ["view:news", "create:profile", "post:complaint", "delete:complaint"]
    }
    async with async_sessionmaker(engine).begin() as sess:
        admin = roles_permission.get("admin", [])
        mco = roles_permission.get("mco", [])
        list_permission = list(set(admin + mco))
        
        for perm in list_permission:
            query = insert(Permissions).values(code = perm).on_conflict_do_nothing(index_elements=["code"])
            await sess.execute(query)
        for key, val in roles_permission.items():
            perms = (
            await sess.scalars(
                select(Permissions).where(Permissions.code.in_(val))
            )
            ).all()
            role = (
            await sess.scalars(
                select(Roles).where(Roles.name == key))
            ).all()
            if not role:
                new_role = Roles(
                    name = key,
                    permissions = perms
                )
                sess.add(new_role)
            
async def mainfunc():
    await create_table()
    await create_permission_and_rules()
    
    
if __name__ == "__main__":
    asyncio.run(mainfunc())