
from celery.utils.log import get_task_logger
from .celery import app
from celery import shared_task
from time import sleep
from celery.utils.log import get_task_logger
from django.core.mail import send_mail
from webinsta.settings import EMAIL_HOST_USER
from django.contrib.auth import get_user_model
User = get_user_model()

logger = get_task_logger(__name__)

# from celery.decorators import task
sleeplogger = get_task_logger(__name__)


@shared_task()
def my_first_task(mail):
    subject = 'Instagram account created successfully...'
    message = 'Your account has been registered in instagram.'
    receivers = [mail]
    send_mail(subject, message, EMAIL_HOST_USER, receivers, fail_silently=False)
    return ('first_task_done')
