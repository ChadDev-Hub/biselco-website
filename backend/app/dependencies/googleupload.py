import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
import os 
from dotenv import load_dotenv
load_dotenv()
def upload_basic(filepath):
  """Insert new file.
  Returns : Id's of the file uploaded

  Load pre-authorized user credentials from the environment.
  TODO(developer) - See https://developers.google.com/identity
  for guides on implementing OAuth2 for the application.
  """
  creds = service_account.Credentials.from_service_account_file(
     os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
     scopes=["https://www.googleapis.com/auth/drive"]
  )

  try:
    file = os.path.basename(filepath)
    # create drive api client
    service = build("drive", "v3", credentials=creds)
    folder_id = "1UT4lHF8fGoXaejvPWwhjwRTyLt0_z-zU"
    file_metadata = {"name": file, "parents": folder_id}
    media = MediaFileUpload(filepath, mimetype="image/jpeg")
    # pylint: disable=maybe-no-member
    file = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )
    if not file:
       return None
    print(f'File ID: {file.get("id")}')

  except HttpError as error:
    print(f"An error occurred: {error}")
    file = None
  
  return file.get("id")


if __name__ == "__main__":
    image_path = r"C:\Users\Victus\Downloads\Screenshot_25-1-2026_15114_www.upwork.com.jpeg"
    upload_basic(filepath=image_path)