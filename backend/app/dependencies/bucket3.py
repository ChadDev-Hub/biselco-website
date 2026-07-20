import boto3
from dotenv import load_dotenv
import os
from uuid import uuid4
from fastapi import UploadFile
from PIL import Image
from io import BytesIO
from pillow_heif import register_heif_opener
import asyncio

register_heif_opener()
load_dotenv()
AWS_ACCESS_KEY_ID = os.getenv("AWS_CLIENT")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_CLIENT_SECRET")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")


s3_client= boto3.client( "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)


async def preprocess_image(image:UploadFile):
    image.file.seek(0)
    img = Image.open(image.file)
    max_size = (400, 400)
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    # img = img.convert("RGB")
    
    buffer = BytesIO()
    img.save(buffer, format="WEBP", quality=95, method=6)
    buffer.seek(0)
    return buffer

# UPLOAD IMAGES
async def upload_image(file: UploadFile, folder:str):
    if not file or not file.filename:
        return
    
    buffer = await preprocess_image(file)
    file.file.seek(0)
    
    image_key = f"{folder}/{uuid4()}.webp"
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, s3_client.upload_fileobj, buffer, AWS_BUCKET_NAME, image_key,{"ContentType": "image/webp"})
    # s3_client.upload_fileobj(buffer, AWS_BUCKET_NAME, complaint_key, ExtraArgs={"ContentType": file.content_type})
    return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{image_key}"

