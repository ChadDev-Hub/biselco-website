from fastapi import FastAPI
from .routes import signup, user_routes, login, meter, landing
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(landing.router)
app.include_router(user_routes.router)
app.include_router(signup.router)
app.include_router(login.router)
app.include_router(meter.router)

