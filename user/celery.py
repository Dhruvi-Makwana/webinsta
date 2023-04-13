import os
from celery import Celery
from datetime import timedelta
from celery.utils.log import get_task_logger
logger = get_task_logger(__name__)

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webinsta.settings")

app = Celery("user")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
