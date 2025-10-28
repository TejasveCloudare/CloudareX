from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from django.conf import settings
import os


def upload_to_google_drive(file_path, filename):
    """
    Uploads a file to Google Drive inside the configured folder.
    Returns the file ID and web link.
    """
    creds = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_DRIVE_CREDENTIALS_FILE,
        scopes=["https://www.googleapis.com/auth/drive.file"]
    )

    service = build("drive", "v3", credentials=creds)

    file_metadata = {"name": filename}
    if getattr(settings, "GOOGLE_DRIVE_FOLDER_ID", None):
        file_metadata["parents"] = [settings.GOOGLE_DRIVE_FOLDER_ID]

    media = MediaFileUpload(file_path, resumable=True)

    file = service.files().create(
        body=file_metadata, media_body=media, fields="id, webViewLink"
    ).execute()

    return file
