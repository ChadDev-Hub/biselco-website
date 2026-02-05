import asyncio
from app.db.engine import create_table, engine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert
import app.models
from app.models import Permissions, Roles, ComplaintsStatusName

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


async def create_complaints_name():
    status = [
        {
            "status_name": "Received",
            "description": "We Received your Complaints. Thank you for Submitting.",
        },
        {
            "status_name": "Pending",
            "description": "Your Complaints is in Pending State. We will update you if we have any update. Please Stand by.",
        },
        {
            "status_name": "Working",
            "description" : "We are working on your Complaints. Please wait for a while and we will do our best to solve it in short time.",
        },
        {
            "status_name": "Complete",
            "description": "We have completed your Complaints. Thank you for your patience."
        }]
    
    
    
    async with async_sessionmaker(engine).begin() as session:
        insert_stmt = insert(ComplaintsStatusName).values(status)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["status_name"], 
            set_={
                'description' : insert_stmt.excluded.description
            })
        await session.execute(upsert_stmt)
        await session.commit()
    
    
    
async def mainfunc():
    await create_table()
    await create_permission_and_rules()
    await create_complaints_name()
    
    
if __name__ == "__main__":
    asyncio.run(mainfunc())