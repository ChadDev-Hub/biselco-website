from fastapi import APIRouter, Response


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/logout")
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
    