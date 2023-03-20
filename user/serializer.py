
from rest_framework import serializers
from .models import User,Post, PostImage
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    # user_profile_url = serializers.SerializerMethodField('user_profile_url')

    class Meta:
        model = User
        fields = ['profile', 'first_name', 'last_name', 'username', 'email', 'password', 'birth_date']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    # def validate(self, data):
    #     user = authenticate(username=data['username'], password=data['password'])
    #     if user:
    #         return user
    #     raise serializers.ValidationError("username or password wrong")


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('images',)


class PostSerializer(serializers.ModelSerializer):
    # images = PostImageSerializer(required=False)

    class Meta:
        model = Post
        fields = ('created_by', 'content')