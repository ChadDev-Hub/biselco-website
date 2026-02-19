from fastapi import APIRouter
from .routes import complaints, landing, login, logout, meter, news, signup, websocket



router = APIRouter(prefix="/v1", tags=["V1"])
router.include_router(complaints.router)
router.include_router(landing.router)
router.include_router(login.router)
router.include_router(logout.router)
router.include_router(meter.router)
router.include_router(news.router)
router.include_router(signup.router)
router.include_router(websocket.router)