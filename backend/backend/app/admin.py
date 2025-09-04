from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse


@admin.register(User)
class UserModelAdmin(UserAdmin):
    pass


admin.site.register(HiringPartner)
admin.site.register(Heading)
admin.site.register(GettingStartedStep)
admin.site.register(Role)


admin.site.register(RoleSectionHeading)
admin.site.register(RepresentingCompany)
admin.site.register(RepresentingCompanyHeading)
admin.site.register(Testimonial)
admin.site.register(Advantage)

admin.site.register(FAQ)


# admin.site.register(Offer)
# admin.site.register(OfferFeature)
# admin.site.register(OfferTrustedBy)


class FeatureInline(admin.TabularInline):
    model = OfferFeature
    extra = 1


class TrustedByInline(admin.TabularInline):
    model = OfferTrustedBy
    extra = 1


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['badge', 'old_price', 'new_price']
    inlines = [FeatureInline, TrustedByInline]


@admin.register(OfferFeature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['text', 'offer']


@admin.register(OfferTrustedBy)
class TrustedByAdmin(admin.ModelAdmin):
    list_display = ['offer', 'logo']


@admin.register(LoginQuotes)
class LoginQuotesAdmin(admin.ModelAdmin):
    list_display = ("author", "company", "designation")


class JobPostingInline(admin.TabularInline):
    model = JobPosting
    extra = 1


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'email',
        'company_name',
        'company_website',
        'industry',
        'type',
        'size',
        'founded_in',
        'domain',
        'about_company',
        'about_founders',
        'created_at',
    )
    list_filter = ('industry', 'type', 'size', 'domain')
    search_fields = ('company_name', 'email', 'full_name')
    ordering = ('-created_at',)
    inlines = [JobPostingInline]


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        'job_title', 'workspace', 'function', 'compensation_lpa',
        'mode_of_work', 'list_skills_with_ids', 'applied_candidates_count'
    )
    list_filter = ('function', 'mode_of_work')
    search_fields = ('job_title', 'workspace__email')
    filter_horizontal = ('non_negotiable_skills',)

    readonly_fields = ['list_skills_with_ids']

    def list_skills_with_ids(self, obj):
        return ", ".join([f"{skill.name} (ID: {skill.id})" for skill in obj.non_negotiable_skills.all()])
    list_skills_with_ids.short_description = "Skills (Name + ID)"

    def applied_candidates_count(self, obj):
        return obj.applications.count()
    applied_candidates_count.short_description = 'Applied Candidates'


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('id', 'name')


@admin.register(AppliedCandidate)
class AppliedCandidateAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'job',
                    'expected_ctc', 'notice_period', 'applied_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('job',)
