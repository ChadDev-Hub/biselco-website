from fastapi import HTTPException, status, Depends, Cookie
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from typing import Optional
from ...user.service.get_user import GetUserServices
from ...user.schema.response_model import Token
from ....core.security import create_access_token,  verify_token
from dotenv import load_dotenv
from datetime import datetime, timedelta ,timezone
import os


load_dotenv()
ACCESS_TOKEN_EXPIRE = os.getenv("ACCESS_TOKEN_EXPIRE")



class GetServices(GetUserServices):
    """
    Get Services class for biscollect application this automatically get or resolve Database Session and Cookies Credentials from frontend
    
    Functions
    """
    def __init__(self,
                 session:AsyncSession=Depends(get_session),
                 access_token: Optional[str] = Cookie(None),
                 refresh_token: Optional[str] = Cookie(None)
                 ):
        super().__init__(session=session,access_token=access_token)
        self.session = session
        self.access_token = access_token
        self.refresh_token = refresh_token
        
    async def refresh_access_token(self):
        unauthorization_transaction = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid"
        )
        if not self.refresh_token:
            print("there's no refresh_token")
            raise unauthorization_transaction
        payload = await verify_token(self.refresh_token)
        if not payload:
            print('Refresh token Failed to verified')
            raise unauthorization_transaction
        
        user = await self.check_user(user_id=payload.user_id)
        
        
        
        new_access_token = await create_access_token(
            Token(
                sub="access_token",
                email=user.email,
                user_id=str(user.id),
                role=[r.name for r in user.roles]
            )
        )
        # RESPONSE THAT INCLUDES ACCESS TOKEN
        response = JSONResponse({
                    "detail": "Refresh Completed"
                })
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            expires=datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE)),
            httponly=True,
            secure=True
        ) 
        return  response
        
    
           
        