from fastapi import APIRouter

from ...modules.websocket.route import websocket
from ...modules.technical.new_connection.route import new_connection_route
from .routes import complaints, landing, login, logout, meter, news, signup, user, technical_form, change_meter, consumers



router = APIRouter(prefix="/v1", tags=["V1"])
router.include_router(complaints.router)
router.include_router(landing.router)
router.include_router(login.router)
router.include_router(logout.router)
router.include_router(meter.router)
router.include_router(news.router)
router.include_router(signup.router)
router.include_router(websocket.router)
router.include_router(user.router)
router.include_router(technical_form.router)
router.include_router(change_meter.router)
router.include_router(consumers.router)
router.include_router(new_connection_route.router)