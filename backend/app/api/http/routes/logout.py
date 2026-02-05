from fastapi import APIRouter, Response, status


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/logout", status_code=status.HTTP_202_ACCEPTED)
async def logout(response:Response):
    response.delete_cookie(
        "refresh_token",
        httponly=True,
        samesite="lax")
    response.delete_cookie(
        "access_token",
        httponly=True,
        samesite="lax"
        )
    return {
        "success": True
    }
    