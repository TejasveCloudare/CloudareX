from rest_framework_simplejwt.tokens import RefreshToken

from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from django.conf import settings
import requests
import os
import json
import base64


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_choices(choice_list):
    return [{"label": label, "value": value} for value, label in choice_list]


def create_drive_folder(folder_name, parent_folder_id=None):
    """
    Create a folder in Google Drive.
    Returns the folder ID.
    """
    creds = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_DRIVE_CREDENTIALS_FILE,
        scopes=["https://www.googleapis.com/auth/drive"]
    )
    service = build("drive", "v3", credentials=creds)

    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder"
    }

    # If you want the folder inside another folder
    if parent_folder_id:
        file_metadata["parents"] = [parent_folder_id]

    folder = service.files().create(
        body=file_metadata,
        fields="id"
    ).execute()

    return folder.get("id")


def upload_to_google_drive(file_path, filename, folder_id=None):
    """
    Uploads a file to Google Drive inside the configured folder.
    Returns the file ID and web link.
    """
    creds = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_DRIVE_CREDENTIALS_FILE,
        scopes=["https://www.googleapis.com/auth/drive"]
    )
    service = build("drive", "v3", credentials=creds)

    file_metadata = {
        "name": filename,
    }

    # Upload inside a specific folder if provided
    if folder_id:
        file_metadata["parents"] = [folder_id]
    else:
        file_metadata["parents"] = [settings.GOOGLE_DRIVE_FOLDER_ID]

    media = MediaFileUpload(file_path, resumable=True)

    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, webViewLink"
    ).execute()

    return file

# ------------One Drive-------------------------------


# Load credentials from JSON
with open(settings.MS_DRIVE_CREDENTIALS_FILE, "r") as f:
    MS_CREDS = json.load(f)

CLIENT_ID = MS_CREDS["app"]["application_id"]
CLIENT_SECRET = MS_CREDS["auth"]["value"]
TENANT_ID = MS_CREDS["app"]["directory_id"]


# def get_onedrive_token():
#     """
#     Get access token from Microsoft for OneDrive / SharePoint API
#     """
#     url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
#     data = {
#         "client_id": CLIENT_ID,
#         "scope": "https://graph.microsoft.com/.default",
#         "client_secret": CLIENT_SECRET,
#         "grant_type": "client_credentials",
#     }
#     r = requests.post(url, data=data)
#     r.raise_for_status()
#     return r.json().get("access_token")


# # Load credentials from JSON
# with open(settings.MS_DRIVE_CREDENTIALS_FILE, "r") as f:
#     MS_CREDS = json.load(f)

def get_onedrive_token():
    print("Tenant:", TENANT_ID)
    print("Client ID:", CLIENT_ID)
    print("Client Secret:", CLIENT_SECRET[:5] + "****")

    url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": CLIENT_ID,
        "scope": "https://graph.microsoft.com/.default",
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
    }

    r = requests.post(url, headers=headers, data=data)
    if r.status_code != 200:
        print("❌ Token error:", r.text)
        raise Exception("Failed to retrieve token")

    print("✅ Token generated successfully!")
    return r.json()["access_token"]


def inspect_token(token):
    """
    Decode and print the access token payload.
    """
    try:
        parts = token.split(".")
        if len(parts) < 2:
            print("❌ Invalid token format")
            return

        payload_b64 = parts[1] + "=" * (-len(parts[1]) % 4)
        decoded = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        payload_json = json.loads(decoded.decode("utf-8"))

        print(json.dumps(payload_json, indent=4))

        # Extract key claims
        roles = payload_json.get("roles", [])
        aud = payload_json.get("aud")
        appid = payload_json.get("appid")

        print("\n--- Summary ---")
        print(f"Audience: {aud}")
        print(f"App ID: {appid}")
        print(f"Roles: {roles}")

        # ✅ Check essential permissions
        required_roles = {"Files.ReadWrite.All", "Sites.ReadWrite.All"}
        missing_roles = required_roles - set(roles)
        if missing_roles:
            print(f"⚠️ Missing permissions: {missing_roles}")
        else:
            print("✅ Token includes all required roles")

    except Exception as e:
        print("❌ Error decoding token:", e)


def test_token_permissions():
    """
    Generate and inspect token (for manual verification).
    """
    token = get_onedrive_token()
    print("\n🔍 Inspecting Access Token...\n")
    inspect_token(token)


def upload_to_onedrive(file_path, filename, site_url, library_name="Documents"):
    """
    Upload to SharePoint Document Library using App-only authentication.
    """
    # 🔹 Get fresh token
    access_token = get_onedrive_token()

    print("\n🔐 Testing token before upload...")
    inspect_token(access_token)

    print("\n🚀 Uploading file to OneDrive/SharePoint...")

    headers = {"Authorization": f"Bearer {access_token}"}

    # 1️⃣ Get Site ID
    site_resp = requests.get(
        f"https://graph.microsoft.com/v1.0/sites/{site_url}", headers=headers)
    print("Site lookup:", site_resp.status_code)
    if site_resp.status_code != 200:
        print("❌ Site lookup failed:", site_resp.text)
        raise Exception("Invalid site URL or permissions.")
    site_id = site_resp.json()["id"]

    # 2️⃣ Get Drive ID (Document Library)
    drives_resp = requests.get(
        f"https://graph.microsoft.com/v1.0/sites/{site_id}/drives", headers=headers)
    drives_resp.raise_for_status()
    drives = drives_resp.json().get("value", [])

    drive_id = next((d["id"]
                    for d in drives if d["name"] == library_name), None)
    if not drive_id:
        raise Exception(
            f"Document library '{library_name}' not found on site {site_url}")

    # 3️⃣ Upload File
    upload_url = f"https://graph.microsoft.com/v1.0/sites/{site_id}/drives/{drive_id}/root:/{filename}:/content"
    with open(file_path, "rb") as f:
        upload_resp = requests.put(upload_url, headers=headers, data=f)
        print("Upload Response:", upload_resp.status_code)
        if upload_resp.status_code >= 400:
            print("❌ Upload failed:", upload_resp.text)
        upload_resp.raise_for_status()

        print("✅ File uploaded successfully!")
        return upload_resp.json()


if __name__ == "__main__":
    # Run a token test
    test_token_permissions()
