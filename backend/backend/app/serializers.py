from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class WorkspaceSerializer(serializers.ModelSerializer):
    # Accept camelCase keys and map to model fields
    fullName = serializers.CharField(source="full_name")
    companyName = serializers.CharField(source="company_name")
    companyWebsite = serializers.URLField(source="company_website")

    class Meta:
        model = Workspace
        fields = [
            "fullName",
            "email",
            "companyName",
            "companyWebsite",
            "industry",
            "sub_industry",
            "type",
            "size",
            "founded_in",
            "about_company",
            "about_founders",
            "domain",
            "mobile",
            "role"
        ]


class UpdatePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8, write_only=True)

    from rest_framework import serializers


class HeadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heading
        fields = ['title', 'subtitle']


class HiringPartnerSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(use_url=True)

    class Meta:
        model = HiringPartner
        fields = ['name', 'logo']


class GettingStartedStepSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return ""

    class Meta:
        model = GettingStartedStep
        fields = ['number', 'title', 'description', 'image', 'alt', 'is_html']


class RoleSerializer(serializers.ModelSerializer):
    icon = serializers.ImageField(use_url=True)

    class Meta:
        model = Role
        fields = ['title', 'description', 'icon']


class RoleSectionHeadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleSectionHeading
        fields = ['title', 'highlight', 'subtitle']


class RepresentingCompanySerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(use_url=True)

    class Meta:
        model = RepresentingCompany
        fields = ['name', 'logo']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class AdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advantage
        fields = '__all__'


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferFeature
        fields = '__all__'


class TrustedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferTrustedBy
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    logos = TrustedBySerializer(many=True, read_only=True)

    class Meta:
        model = Offer
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class LoginQuotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginQuotes
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name']


class JobSerializer(serializers.ModelSerializer):
    company_website = serializers.SerializerMethodField()
    non_negotiable_skills = SkillSerializer(many=True)

    class Meta:
        model = JobPosting
        fields = '__all__'  # keeps all existing fields
        extra_fields = ['company_website']  # for clarity, but optional

    def get_company_website(self, obj):
        return obj.workspace.company_website if obj.workspace else None
