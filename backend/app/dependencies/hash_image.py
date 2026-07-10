import hashlib
import base64
from PIL import Image



def hash_image(image_bytes):
    image = Image.open(image_bytes)
    image_hash = hashlib.sha256(image.tobytes()).hexdigest()
    image.seek(0)
    return image_hash