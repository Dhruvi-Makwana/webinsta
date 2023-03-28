from django.contrib import admin
from .models import User, Post, Comment, PostImage
# Register your models here.


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'birth_date', 'profile')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_by', 'content', 'get_likes', 'created_at', 'updated_at')


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'images', 'post')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'post', 'commented_by')
