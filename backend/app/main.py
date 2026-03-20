from fastapi import FastAPI, HTTPException, status
from .api.v1 import api
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
load_dotenv()
app = FastAPI(
    max_request_size=52428800
)
FRONTENDBASEURL = os.getenv("FRONTEND_BASE_URL")
if not FRONTENDBASEURL:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Frontend Base URL Not Found")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTENDBASEURL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api.router)

