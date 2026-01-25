from fastapi import APIRouter, Depends, Request, Form
from sqlalchemy import select, asc, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Users, News
from ..schema.form import CreateNews
from ..utils.token import get_current_user
from ..dependencies.db_session import get_session
from datetime import datetime
router = APIRouter(prefix="/news", tags=["News"])



@router.get("/")
async def get_news(current_user = Depends(get_current_user), session:AsyncSession = Depends(get_session)):
    news = (await session.scalars(select(News).order_by(asc(News.date_posted), desc(News.time_posted)))).all()
    return news

@router.post("/create")
async def create_news(current_user:dict = Depends(get_current_user), session:AsyncSession = Depends(get_session),formNews:CreateNews = Form()):
    user_id = current_user.get("userid")
    user = await session.scalar(select(Users).where(Users.id == user_id))
    now = datetime.now()
    date = now.date()
    time = now.time()
    new_news = News(
        title = formNews.title,
        description = formNews.description,
        date_posted = date,
        time_posted = time,
        user = user
    )
    session.add(new_news)
    await session.commit()
    await session.close()
    return {
        "detail" : "Sucessully Created"
    }
