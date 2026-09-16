from fastapi import FastAPI, HTTPException, status
from .api.v1 import api
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .core.lifespan import lifespan
from starlette.middleware.sessions import SessionMiddleware
import os
load_dotenv()
app = FastAPI(
    max_request_size=52428800,
    lifespan=lifespan
)
FRONTENDBASEURL = os.getenv("FRONTEND_BASE_URL")
BISECOLLECT = os.getenv("BISCOLLECT_BASE_URL")


FACEBOOK_SECRET_KEY = os.getenv("FACEBOOK_SESSION_SECRET")
if not FRONTENDBASEURL:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Frontend Base URL Not Found")

app.add_middleware(SessionMiddleware, secret_key=FACEBOOK_SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTENDBASEURL, BISECOLLECT],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router)

