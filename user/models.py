# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class TimeStamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        verbose_name = "TimeStamp"


class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    profile = models.ImageField(
        upload_to="user_profile/",
        height_field=None,
        width_field=None,
        max_length=100,
        blank=True,
        null=True
    )

    def __str__(self):
        return f'{self.username}'


class Post(TimeStamp):
    created_by = models.ForeignKey(User, related_name="get_user", on_delete=models.CASCADE)
    content = models.TextField(max_length=1000, blank=True, null=True)
    likes = models.ManyToManyField(User, related_name="liked_by", blank=True)

    def get_likes(self):
        return "\n".join([p.username for p in self.likes.all()])

    class Meta:
        verbose_name = "post"


class Comment(TimeStamp):
    description = models.TextField(max_length=600)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    commented_by = models.ForeignKey(User, related_name="comments", on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "comments"


class PostImage(models.Model):
    images = models.ImageField(
        upload_to="post_images/",
        height_field=None,
        width_field=None,
        max_length=100,
        blank=True,
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_image")
