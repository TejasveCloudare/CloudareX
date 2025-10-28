# from django.apps import AppConfig
from django.apps import AppConfig as DjangoAppConfig
import os
import json
import requests
import webbrowser


class AppConfig(DjangoAppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"

    def ready(self):
        """
        Runs when Django app starts.
        - Loads LinkedIn config
        - If access_token is expired/missing, triggers OAuth flow
        - Otherwise fetches user info and saves it
        """
        try:
            BASE_DIR = os.path.dirname(os.path.abspath(__file__))

            # Load API config
            config_path = os.path.join(BASE_DIR, "linkedin_config.json")
            with open(config_path, "r") as file:
                config = json.load(file)

            access_token = config.get("access_token")
            response_path = os.path.join(BASE_DIR, "linkedin_user_info.json")

            # If we already have an access token, try to fetch user info
            if access_token:
                url = config["urls"]["userinfo"]
                headers = {"Authorization": f"Bearer {access_token}"}
                response = requests.get(url, headers=headers)

                if response.status_code == 200:
                    with open(response_path, "w") as outfile:
                        json.dump(response.json(), outfile, indent=2)
                    print("✅ LinkedIn user info saved to linkedin_user_info.json")
                    return
                else:
                    print(
                        f"⚠️ Token may be invalid or expired: {response.text}")

            # Step 1: Build Auth URL if token missing/invalid
            auth_url = (
                f"{config['urls']['authUrl']}?"
                f"response_type={config['response_type']}&"
                f"client_id={config['client_id']}&"
                f"redirect_uri={config['redirect_uri']}&"
                f"scope={config['scope']}"
            )

            print(f"🔗 Open this URL to authenticate LinkedIn:\n{auth_url}")
            webbrowser.open(auth_url)

            # ⚠️ IMPORTANT:
            # After user logs in, LinkedIn redirects to
            # http://localhost:8000/linkedin/callback?code=XXXX
            # You must implement a Django view at /linkedin/callback
            # to capture the code and exchange it for an access token.

        except Exception as e:
            print(f"⚠️ Startup LinkedIn fetch failed: {e}")
