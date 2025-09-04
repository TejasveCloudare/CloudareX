from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError


class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)

    # For password reset
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_creation_time = models.DateTimeField(default=timezone.now)

    # Auth settings
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]  # Important for createsuperuser

    def __str__(self):
        return self.email

    class Meta:
        verbose_name_plural = 'Users'


class Workspace(models.Model):
    # Required fields
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    company_name = models.CharField(max_length=100)
    company_website = models.URLField()

    # Optional fields
    INDUSTRY_CHOICES = [
        ('IT', 'IT'),
        ('Finance', 'Finance'),
        ('Marketing', 'Marketing'),
        ('Healthcare', 'Healthcare'),
        ('Education', 'Education'),
        ('Other', 'Other'),
    ]

    TYPE_CHOICES = [
        ('Private', 'Private'),
        ('Public', 'Public'),
    ]

    SIZE = [
        ('10-50', '10-50'),
        ('50-100', '50-100'),
        ('100-500', '100-500'),
        ('500-1000', '500-1000'),
        ('1000+', '1000+'),
    ]

    DOMAIN_CHOICES = [
        ('B2B', 'B2B'),
        ('B2C', 'B2C'),
        ('D2C', 'D2C'),
    ]

    industry = models.CharField(
        max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    sub_industry = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, blank=True, null=True)
    size = models.CharField(
        max_length=20, choices=SIZE, blank=True, null=True)
    founded_in = models.PositiveIntegerField(blank=True, null=True)
    domain = models.CharField(
        max_length=10, choices=DOMAIN_CHOICES, blank=True, null=True)
    about_company = models.CharField(max_length=255, null=True, blank=True)
    about_founders = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=10, null=True, blank=True)  # temp
    role = models.CharField(max_length=20, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.email})"

# -----------------LOGIN END HERE-------------------------------


class Heading(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title


class HiringPartner(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='hiring_partners_logos/')

    def __str__(self):
        return self.name


class GettingStartedStep(models.Model):
    number = models.CharField(max_length=10)
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='getting_started/')
    alt = models.CharField(max_length=100)
    is_html = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class RoleSectionHeading(models.Model):
    title = models.CharField(max_length=255)
    highlight = models.CharField(max_length=255)
    subtitle = models.TextField()

    def __str__(self):
        return self.title


class Role(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.ImageField(upload_to='roles_icons/')

    def __str__(self):
        return self.title


class RepresentingCompany(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='representing_companies/')

    def __str__(self):
        return self.name


class RepresentingCompanyHeading(models.Model):
    title = models.CharField(max_length=500)
    subtitle = models.TextField(blank=True)

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    quote = models.TextField()
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    companyColor = models.CharField(max_length=10)
    image = models.ImageField(upload_to='testimonials/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.company}"


class Advantage(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.ImageField(upload_to='icons/')

    def __str__(self):
        return self.title


class Offer(models.Model):
    badge = models.CharField(max_length=255)
    old_price = models.CharField(max_length=50)
    new_price = models.CharField(max_length=50)
    note = models.TextField()
    cta_text = models.CharField(max_length=255)
    cta_link = models.CharField(max_length=100)
    logoHeading = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.badge


class OfferFeature(models.Model):
    offer = models.ForeignKey(
        Offer, on_delete=models.CASCADE, related_name='features')
    text = models.TextField()

    def __str__(self):
        return self.text


class OfferTrustedBy(models.Model):
    offer = models.ForeignKey(
        Offer, on_delete=models.CASCADE, related_name='logos')
    logo = models.ImageField(upload_to='trusted_logos/')

    def __str__(self):
        return f"Logo for {self.offer.badge}"


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question[:50]


class LoginQuotes(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    image = models.ImageField(upload_to="LoginQuotes/")

    def __str__(self):
        return f"{self.author} - {self.company}"


# -----------JOB POSTING--------------------------------------------------
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class JobPosting(models.Model):
    FUNCTION_CHOICES = [
        ('IT', 'IT'),
        ('Finance', 'Finance'),
        ('Healthcare', 'Healthcare'),
        ('Education', 'Education'),
        ('product', 'Product'),
        ('growth', 'Growth'),
        ('strategy', 'Strategy'),
        ('marketing', 'Marketing'),
        ('others', 'Others'),
    ]

    MODE_OF_WORK_CHOICES = [
        ('remote', 'Remote'),
        ('on_site', 'On-Site'),
        ('hybrid', 'Hybrid'),
    ]

    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time_permanent', 'Full Time - Permanent'),
        ('full_time_contract', 'Full Time - Temporary/Contractual'),
        ('full_time_freelance', 'Full Time - Freelance/Home Based'),
        ('part_time_permanent', 'Part Time - Permanent'),
        ('part_time_contract', 'Part Time - Temporary/Contractual'),
        ('part_time_freelance', 'Part Time - Freelance/Home Based'),
    ]

    workspace = models.ForeignKey(
        'Workspace', on_delete=models.CASCADE, related_name='job_postings')

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    job_title = models.CharField(max_length=255)
    experience_min = models.PositiveIntegerField()
    experience_max = models.PositiveIntegerField()
    number_of_openings = models.PositiveIntegerField()
    function = models.CharField(max_length=50, choices=FUNCTION_CHOICES)
    compensation_lpa = models.FloatField()
    is_compensation_negotiable = models.BooleanField(default=False)
    esops_lpa = models.FloatField()
    non_negotiable_skills = models.ManyToManyField(Skill)
    roles_responsibilities = models.TextField()
    qualifications = models.TextField()
    mode_of_work = models.CharField(
        max_length=20, choices=MODE_OF_WORK_CHOICES)
    work_location = models.CharField(max_length=255, blank=True, null=True)
    employment_type = models.CharField(
        max_length=50,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default='full_time_permanent'
    )

    # Optional Fields
    variable_lpa = models.FloatField(blank=True, null=True)
    interview_process = models.TextField(blank=True, null=True)
    plan_30_60_90 = models.TextField(blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)

    def clean(self):
        if self.mode_of_work in ['on_site', 'hybrid'] and not self.work_location:
            raise ValidationError(
                {'work_location': "Work location is required for On-Site or Hybrid mode."})

    def __str__(self):
        return f"{self.job_title} at {self.workspace}"


class AppliedCandidate(models.Model):
    job = models.ForeignKey(
        'JobPosting', on_delete=models.CASCADE, related_name='applications')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    expected_ctc = models.DecimalField(max_digits=10, decimal_places=2)
    notice_period = models.PositiveIntegerField()  # in days
    # make sure MEDIA settings are configured
    resume = models.FileField(upload_to='resumes/')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} applied for {self.job.job_title}"
