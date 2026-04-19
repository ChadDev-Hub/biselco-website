import boto3
from dotenv import load_dotenv
import os
from uuid import uuid4
from fastapi import UploadFile
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


# UPLOAD IMAGES
async def upload_image(file: UploadFile, folder:str):
    if file.filename:
        complaint_key = f"{folder}/{uuid4()}.{file.filename.split('.')[-1]}"
        s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, complaint_key, ExtraArgs={"ContentType": file.content_type})
        return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{complaint_key}"

