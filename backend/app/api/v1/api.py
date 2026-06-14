from fastapi import APIRouter

from ...modules.landing.route import landing

from ...modules.gis.consumer.route import consumers

from ...modules.complaints.route import complaints
from ...modules.gis.distribution_transformer.route import distribution_transformer
from ...modules.technical.change_meter.route import change_meter
from ...modules.agma.route import agma
from ...modules.websocket.route import websocket
from ...modules.technical.new_connection.route import new_connection_route
from .routes import login, logout, meter, news, signup, user, technical_form
from ...modules.events.route import events_router
from ...modules.gis.distribution_lines.route import distribution_lines



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
router.include_router(agma.router)
router.include_router(events_router.router)
router.include_router(distribution_lines.router)
router.include_router(distribution_transformer.router)
