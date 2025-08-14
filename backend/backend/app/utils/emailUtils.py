import string
import random
from django.core.mail import send_mail


def generate_otp(length=6):
    digits = string.digits
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp

def send_otp(email, otp):
    from django.conf import settings
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}.'
    from_email = settings.EMAIL_HOST
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)