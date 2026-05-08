from fastapi import APIRouter, Depends, Form
from ..services.post import PostAgmaRegistrationService
from ..schema.request_model import AgmaRegistrationRequest, AgmaValidationRequest
from ....dependencies.bucket3 import upload_image
router = APIRouter(prefix="/agma", tags=["agma"])


# AGMA REGISTRATION
@router.post("/register", status_code=201)
async def register_agma(
    data:AgmaRegistrationRequest = Form(...), 
    post_agma_registration_service: PostAgmaRegistrationService = Depends(PostAgmaRegistrationService),
    ):
    await data.image.seek(0)
    await data.signature.seek(0)
    print(data)
    image_url = await upload_image(file=data.image, folder="agma")
    signature_url = await upload_image(file=data.signature, folder="agma")
    registration_data = AgmaValidationRequest(
        account_no=data.account_no,
        name=data.name,
        mobile_no=data.mobile_no,
        image_url="sample.com",
        signature_url="sample.com",
    )
    return await post_agma_registration_service.register_agma(data=registration_data)