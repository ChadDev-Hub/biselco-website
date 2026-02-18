from fastapi import APIRouter, Depends, Request, Form, status, WebSocket, WebSocketDisconnect
from fastapi.exceptions import HTTPException
from sqlalchemy import select, asc, and_, desc, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ....models import Users, News
from ....schema.form import CreateNews
from ....utils.token import get_current_user, get_current_user_ws
from ....dependencies.db_session import get_session
from ....dependencies.time_ago import TimeAgo
from ....core.websocket_manager import manager
from datetime import datetime


router = APIRouter(prefix="/news", tags=["News"])




@router.get("/")
async def get_news(current_user = Depends(get_current_user),session:AsyncSession = Depends(get_session)):
    """
    Get all news posts
    
    Args:
    current_user (dict): The current user object returned by the get_current_user function
    session (AsyncSession): The database session object returned by the get_session function
    
    Returns:
    List[News]: A list of all news posts sorted by date posted in ascending order and time posted in descending order
    """
    news = (await session.scalars(
        select(News)
        .options(selectinload(News.news_images))
        .options(selectinload(News.user).load_only(Users.user_name,Users.first_name, Users.last_name))
        .order_by(desc(News.date_posted), desc(News.time_posted)))).all()
    

    return [
        {   
            "id": n.id,
            "title": n.title,
            "description": n.description,    
            "date_posted": n.date_posted,
            "time_posted": n.time_posted.strftime("%I:%M %p"),
            "period": TimeAgo(date_posted=n.date_posted, time_posted=n.time_posted),
            "user": {
                "user_name": n.user.user_name,
                "first_name": n.user.first_name,
                "last_name": n.user.last_name,
                
            },
            "images": n.news_images[0]  if len(n.news_images) > 0 else  n.news_images if len(n.news_images) > 0 else None
        }
        for n in news
    ]

@router.post("/create")
async def create_news(current_user:dict = Depends(get_current_user), session:AsyncSession = Depends(get_session),formNews:CreateNews = Form()):
    """
    Create a new News post
    
    Args:
    current_user (dict): The current user object returned by the get_current_user function
    session (AsyncSession): The database session object returned by the get_session function
    formNews (CreateNews): The form data object containing the title and description of the news post
    
    Returns:
    dict: A dictionary with a detail key containing a message indicating whether the creation was successful
    """
    user_id = current_user.get("user_id")
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
    await session.refresh(new_news, attribute_names=["user", "news_images"])
    news_json = {
        "id": new_news.id,
        "title": new_news.title,
        "description": new_news.description,
        "date_posted": new_news.date_posted.isoformat(),
        "time_posted": new_news.time_posted.strftime("%I:%M %p"),
        "period": TimeAgo(date_posted=new_news.date_posted, time_posted=new_news.time_posted),
        "user": {
            "user_name": new_news.user.user_name,
            "first_name": new_news.user.first_name,
            "last_name": new_news.user.last_name,
        },
        "images": new_news.news_images[0] if len(new_news.news_images) > 0 else None
    }
    await manager.broadcast({
        "detail": "news",
        "data" : news_json
    })
    return {
        "detail" : "Sucessully Created"
    }

@router.delete("/delete/{post_id}")
async def DeletePost(post_id:int, session:AsyncSession = Depends(get_session), current_user:dict = Depends(get_current_user)):
    """
    Delete a Post with a given post_id
    
    Args:
    post_id (int): The id of the post to be deleted
    
    Returns:
    dict: A dictionary with a detail key containing a message indicating whether the deletion was successful
    """
    try:
        select_stmt = select(News).where(News.id == post_id)
        data = (await session.execute(select_stmt)).scalar_one_or_none()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        delete_stmt = delete(News).where(News.id == post_id)
        await session.execute(delete_stmt)
        await session.commit()
        await session.close()
    except Exception as e:
        return e
    return {
        "detail" : "Successfully Deleted"
    }
    
    