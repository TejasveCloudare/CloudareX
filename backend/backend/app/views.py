from django.db.models import Q
from .utils import *
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
import requests
from urllib.parse import urlparse
import os
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
import json
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()


class TokenAPIVIew(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            refresh = RefreshToken(refresh_token)

            return Response({
                'refresh':     str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            return Response({
                "message": "Token expired"
            }, 500)


class SignupAPIView(APIView):
    def post(self, request):

        data = {
            "username": request.data["email"],
            "email": request.data["email"],
            "password": make_password(request.data["password"]),
            "confirm_password": request.data["confirm_password"],
            "contact_number": request.data["contact_number"],
            "first_name": request.data["first_name"],
            "last_name": request.data["last_name"],
        }
        userSerializer = UserSerializer(data=data)

        try:
            if userSerializer.is_valid(raise_exception=True):
                userSerializer.save()
                return Response("Registration done successfully", 200)
        except Exception as e:
            if "email" in userSerializer.errors.keys():
                return Response("Email already registered", 500)
            return Response(userSerializer.errors, 500)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {"first_name": user.first_name,
                             "last_name": user.last_name,
                             "email": user.email,
                             "contact_number": user.contact_number}
                })
            else:
                return Response("Invalid username or password", 401)
        except:
            return Response("User not found", 404)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get("email")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        # Optional, if you store it
        contact_number = data.get("contact_number", "")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email,  # Or generate a unique username if needed
            "first_name": first_name,
            "last_name": last_name,
        })

        if created:
            print("New user created via Google")
            # Optional: if you're using a custom User model with contact_number
            # user.contact_number = contact_number
            # user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            },
            "is_new_user": created
        }, status=status.HTTP_200_OK)


class LinkedInLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")
        redirect_uri = request.data.get("redirect_uri")
        LINKEDIN_CLIENT_ID = "77c7otz5y1k89e"
        LINKEDIN_CLIENT_SECRET = "WPL_AP1.zenzDbFaHvDbsk3J.W6Iwdg=="

        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        token_data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": LINKEDIN_CLIENT_ID,
            "client_secret": LINKEDIN_CLIENT_SECRET,
        }

        token_response = requests.post(token_url, data=token_data, headers={
            "Content-Type": "application/x-www-form-urlencoded"
        })
        token_json = token_response.json()

        if "access_token" not in token_json:
            return Response({"error": "Failed to get access token from LinkedIn"}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_json["access_token"]

        # Get email
        profile_response = requests.get(
            "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        email = profile_response.json(
        )["elements"][0]["handle~"]["emailAddress"]

        # Get name
        userinfo_response = requests.get(
            "https://api.linkedin.com/v2/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        profile_data = userinfo_response.json()
        first_name = profile_data.get("localizedFirstName", "")
        last_name = profile_data.get("localizedLastName", "")

        # Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name
            }
        )
        if created:
            user.set_unusable_password()
            user.save()

        tokens = get_tokens_for_user(user)

        return Response({
            "access": tokens["access"],
            "refresh": tokens["refresh"],
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        userSerializer = UserSerializer(request.user)
        return Response({
            "user": {"first_name": userSerializer.data['first_name'],
                     "last_name": userSerializer.data['last_name'],
                     "email": userSerializer.data['email'],
                     "contact_number": userSerializer.data['contact_number']}
        }, 200)


class WorkspaceView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workspace = Workspace.objects.get(email=email)
            # Update the existing record
            serializer = WorkspaceSerializer(
                workspace, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Workspace updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Workspace.DoesNotExist:
            # Create a new record
            serializer = WorkspaceSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Workspace created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        email = request.query_params.get('email', None)
        print("---Email--", email)

        # Prepare choices
        choices = {
            "industry": get_choices(Workspace.INDUSTRY_CHOICES),
            "type": get_choices(Workspace.TYPE_CHOICES),
            "size": get_choices(Workspace.SIZE),
            "domain": get_choices(Workspace.DOMAIN_CHOICES),
        }

        if email:
            try:
                workspace = Workspace.objects.get(email=email)
            except Workspace.DoesNotExist:
                error_response = {
                    "error": "Workspace with this email does not exist",
                    "choices": choices,
                    "workspace": None,
                }
                return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        else:
            # If no email provided → just return the first workspace (or None if empty)
            workspace = Workspace.objects.first()

        serializer = WorkspaceSerializer(workspace) if workspace else None

        response_data = {
            "workspace": serializer.data if serializer else None,
            "choices": choices,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UpdateWorkspaceView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workspace = Workspace.objects.get(email=email)
        except Workspace.DoesNotExist:
            return Response({"message": "Workspace with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WorkspaceSerializer(
            workspace, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Workspace updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ------------------------------LOGIN END HERE----------------------------------


class PasswordResetAPIView(APIView):
    def post(self, request):
        if request.data["postFor"] == "email":
            email = request.data["data"]["email"]
            try:
                user = User.objects.get(email=email)
                otp = generate_otp()
                user.otp = otp
                user.save()
                send_otp(email, otp)
                return JsonResponse({'msg': 'OTP sent successfully'})
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        else:

            otp = request.data["data"]['otp']
            email = request.data["data"]['email']
            user = User.objects.filter(email=email, otp=otp).first()
            if not user:
                return Response({"error": "Invalid OTP or User not found"}, status=400)
            user.otp = None
            user.save()
            return Response({"msg": "OTP verified successfully"}, status=200)

    def put(self, request):

        email = request.data['email']
        password = request.data['password']

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return JsonResponse({'msg': 'Password updated successfully'})
        except Exception as e:
            return JsonResponse({'error': 'Invalid OTP'}, status=400)


class HiringPartnersView(APIView):
    def get(self, request):
        heading = Heading.objects.last()  # fetch the latest heading
        heading_serializer = HeadingSerializer(heading)

        companies = HiringPartner.objects.all()
        companies_serializer = HiringPartnerSerializer(companies, many=True)

        return Response({
            "heading": heading_serializer.data,
            "companies": companies_serializer.data
        })


class GettingStartedStepsView(APIView):
    def get(self, request):
        steps = GettingStartedStep.objects.all().order_by('number')
        serializer = GettingStartedStepSerializer(
            steps, many=True, context={"request": request})
        return Response(serializer.data)


class RolesView(APIView):
    def get(self, request):
        heading = RoleSectionHeading.objects.last()
        roles = Role.objects.all()

        heading_data = RoleSectionHeadingSerializer(heading).data
        roles_data = RoleSerializer(roles, many=True).data

        return Response({
            "heading": heading_data,
            "roles": roles_data
        })


class RepresentingCompanyView(APIView):
    def get(self, request):
        # Fetch heading (only one expected)
        heading_obj = RepresentingCompanyHeading.objects.first()
        heading = {
            "title": heading_obj.title if heading_obj else "",
            "subtitle": heading_obj.subtitle if heading_obj else ""
        }

        # Fetch companies
        companies = RepresentingCompany.objects.all()
        company_data = RepresentingCompanySerializer(
            companies, many=True).data

        # Final structured response
        data = {
            "heading": heading,
            "companies": company_data
        }
        return Response(data)


class GetTestimonial(APIView):
    def get(self, request):
        testimonial = Testimonial.objects.first()
        if testimonial:
            image_path = testimonial.image.url if testimonial.image else ""
            response_data = {
                "quote": testimonial.quote,
                "name": testimonial.name,
                "designation": testimonial.designation,
                "company": testimonial.company,
                "companyColor": testimonial.companyColor,
                "image": image_path,
            }
            return Response(response_data)
        else:
            return Response({"detail": "No testimonial found."}, status=404)


class Advantages(APIView):
    def get(self, request):
        benefits = Advantage.objects.all()
        serializer = AdvantageSerializer(benefits, many=True)

        data = serializer.data
        for i, benefit in enumerate(benefits):
            if benefit.icon:
                data[i]["icon"] = benefit.icon.url
            else:
                data[i]["icon"] = ""  # or provide default path if desired

        return Response(data)


class GetOffer(APIView):
    def get(self, request):
        offer = Offer.objects.prefetch_related('features', 'logos').first()
        if offer:
            data = {
                "badge": offer.badge,
                "info": {
                    "old": offer.old_price,
                    "new": offer.new_price,
                    "note": offer.note,
                    "TrustedText": offer.logoHeading,

                },
                "cta": {
                    "text": offer.cta_text,
                    "link": offer.cta_link
                },
                "features": [f.text for f in offer.features.all()],
                "trustedBy": [logo.logo.url for logo in offer.logos.all()]
            }
            return Response(data)
        return Response({"detail": "No offer found."}, status=404)


class FAQView(APIView):
    def get(self, request):
        faqs = FAQ.objects.all()
        items = [{"question": f.question, "answer": f.answer} for f in faqs]

        data = {
            "heading": "Frequently Asked Questions (FAQs)",
            "items": items
        }
        return Response(data)


# class LoginQuotesView(APIView):
#     def get(self, request):
#         LoginQuote = LoginQuotes.objects.all()
#         data = [
#             {
#                 "text": t.text,
#                 "author": t.author,
#                 "designation": t.designation,
#                 "company": t.company,
#                 "image": t.image.url if t.image else ""
#             }
#             for t in LoginQuote
#         ]
#         return Response(data)


class LoginQuotesView(APIView):
    def get(self, request):
        login_quotes = LoginQuotes.objects.all()
        representing_companies = RepresentingCompany.objects.all()

        quotes_data = [
            {
                "text": quote.text,
                "author": quote.author,
                "designation": quote.designation,
                "company": quote.company,
                "image": quote.image.url if quote.image else ""
            }
            for quote in login_quotes
        ]

        companies_data = [
            {
                "name": company.name,
                "logo": company.logo.url if company.logo else ""
            }
            for company in representing_companies
        ]

        return Response({
            "quotes": quotes_data,
            "representing_companies": companies_data
        })


class JobPostingCreateView(APIView):
    def post(self, request):
        data = request.data

        # 1. Validate required fields manually
        workspace_email = data.get("workspace_email")
        non_negotiable_skills_ids = data.get("non_negotiable_skills")

        if not workspace_email:
            return Response({"workspace": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
        if not non_negotiable_skills_ids:
            return Response({"non_negotiable_skills": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Fetch related Workspace
        try:
            workspace = Workspace.objects.get(email=workspace_email)
        except Workspace.DoesNotExist:
            return Response({"workspace": ["Workspace with this email does not exist."]}, status=status.HTTP_404_NOT_FOUND)

        # 3. Fetch Skills by IDs
        skills = Skill.objects.filter(id__in=non_negotiable_skills_ids)
        if not skills.exists():
            return Response({"non_negotiable_skills": ["No valid skills found for provided IDs."]}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Create JobPost
        job_post = JobPosting.objects.create(
            job_title=data.get("job_title"),
            experience_min=data.get("experience_min"),
            experience_max=data.get("experience_max"),
            number_of_openings=data.get("number_of_openings"),
            function=data.get("function"),
            compensation_lpa=data.get("compensation_lpa"),
            is_compensation_negotiable=data.get(
                "is_compensation_negotiable", False),
            esops_lpa=data.get("esops_lpa"),
            variable_lpa=data.get("variable_lpa"),
            roles_responsibilities=data.get("roles_responsibilities"),
            qualifications=data.get("qualifications"),
            mode_of_work=data.get("mode_of_work"),
            work_location=data.get("work_location"),
            interview_process=data.get("interview_process"),
            plan_30_60_90=data.get("plan_30_60_90"),
            additional_info=data.get("additional_info"),
            workspace=workspace
        )

        job_post.non_negotiable_skills.set(skills)
        job_post.save()

        return Response(JobSerializer(job_post).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        # 1. Get email from query parameters
        email = request.query_params.get('email')
        if not email:
            return Response({"email": ["This query parameter is required."]}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Fetch related Workspace
        try:
            workspace = Workspace.objects.get(email=email)
        except Workspace.DoesNotExist:
            return Response({"workspace": ["Workspace with this email does not exist."]}, status=status.HTTP_404_NOT_FOUND)

        # 3. Fetch all job postings for that workspace
        job_posts = JobPosting.objects.filter(workspace=workspace)

        # 4. Serialize and return
        serialized = JobSerializer(job_posts, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)


class DomainWorkspaceView(APIView):
    def get(self, request):
        website = request.query_params.get("website")
        if not website:
            return Response(
                {"error": "website query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        website = website.strip().lower()

        if "://" not in website:
            website = "http://" + website

        parsed_url = urlparse(website)
        domain = parsed_url.netloc

        if domain.startswith("www."):
            domain = domain[4:]

        workspaces = Workspace.objects.filter(
            company_website__icontains=domain
        )

        # Extract only `fullName` values
        full_names = workspaces.values_list("full_name", flat=True)

        return Response(list(full_names), status=status.HTTP_200_OK)

# -------------------GET all the JOBS---------------------------------------


class JobPostingListView(APIView):
    def get(self, request, job_id=None):
        if job_id:  # If job_id is provided → fetch single job
            try:
                job = JobPosting.objects.get(
                    Q(is_verified=True) & Q(is_active=True) & Q(id=job_id)
                )
                serializer = JobSerializer(job)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except JobPosting.DoesNotExist:
                return Response(
                    {"error": "Job not found or is inactive/unverified."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # If no job_id → fetch all jobs
        job_postings = JobPosting.objects.filter(
            Q(is_verified=True) & Q(is_active=True)
        ).order_by('-id')
        serializer = JobSerializer(job_postings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JobPostingChoicesView(APIView):
    def get(self, request):
        choices_data = {
            "function_choices": [
                {"value": key, "label": value} for key, value in JobPosting.FUNCTION_CHOICES
            ],
            "mode_of_work_choices": [
                {"value": key, "label": value} for key, value in JobPosting.MODE_OF_WORK_CHOICES
            ],
            "employment_type_choices": [
                {"value": key, "label": value} for key, value in JobPosting.EMPLOYMENT_TYPE_CHOICES
            ]
        }

        return Response(choices_data, status=status.HTTP_200_OK)


class ApplyJobAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        job_id = kwargs.get("job_id")
        job = get_object_or_404(JobPosting, id=job_id)

        data = request.data.copy()
        data["job"] = job.id

        serializer = AppliedCandidateSerializer(data=data)
        if serializer.is_valid():
            # ✅ Always save to DB first
            candidate = serializer.save()

            # ✅ Then try uploading to Google Drive
            if candidate.resume:
                file_path = candidate.resume.path
            filename = os.path.basename(file_path)

            # Upload to Google Drive
            try:
                drive_file = upload_to_google_drive(file_path, filename)
                candidate.drive_file_id = drive_file.get("id")
                candidate.drive_file_link = drive_file.get("webViewLink")
            except Exception as e:
                print(f"Google Drive upload failed: {str(e)}")

            # Upload to OneDrive
            try:
                ms_file = upload_to_onedrive(
                    file_path, filename, "contoso.sharepoint.com:/sites/HR")
                candidate.onedrive_file_id = ms_file.get("id")
                candidate.onedrive_file_link = ms_file.get("webUrl")
            except Exception as e:
                print(f"OneDrive upload failed: {str(e)}")

            candidate.save()

            return Response(
                {"message": "Application submitted successfully"},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        job_id = kwargs.get('job_id')
        job = get_object_or_404(JobPosting, id=job_id)
        applied_candidates = job.applications.all()
        serializer = AppliedCandidateSerializer(applied_candidates, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ----------Linked In-------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "linkedin_config.json")

with open(CONFIG_PATH, "r") as file:
    config = json.load(file)

ACCESS_TOKEN = config["access_token"]
URLS = config["urls"]


def linkedin_get(endpoint_key):
    url = URLS[endpoint_key]
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"[ERROR] {response.status_code}: {response.text}")
        return None


@csrf_exempt
def test_callback(request):
    print("🔥 Test callback hit!")
    return JsonResponse({"ok": True})


@csrf_exempt
def linkedin_callback(request):
    print("⚡ Callback hit!")
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "No code returned"}, status=400)

    print("✅ Received LinkedIn code:", code)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(BASE_DIR, "linkedin_config.json")

    with open(config_path, "r") as file:
        config = json.load(file)

    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": config["redirect_uri"],
        "client_id": config["client_id"],
        "client_secret": config["client_secret"],
    }

    response = requests.post(token_url, data=data)

    if response.status_code == 200:
        token_data = response.json()
        config["access_token"] = token_data["access_token"]

        with open(config_path, "w") as file:
            json.dump(config, file, indent=2)

        print("✅ New LinkedIn token saved to linkedin_config.json")
        return JsonResponse({"message": "✅ Token saved", "token": token_data})
    else:
        print("❌ LinkedIn token exchange failed:", response.text)
        return JsonResponse({"error": response.text}, status=response.status_code)
