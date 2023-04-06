
from rest_framework import serializers
from .models import User, Post, PostImage, Comment
from datetime import date, timedelta


class UserSerializer(serializers.ModelSerializer):
    # user_profile_url = serializers.SerializerMethodField('user_profile_url')
    profile = serializers.ImageField(required=False, max_length=None, allow_empty_file=True, use_url=True)
    birth_date = serializers.DateField(format='%Y-%m-%d')

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Data must be in alphabets.")
        return value

    def validate_birth_date(self, value):
        today = date.today()
        age = today.year - value.year
        if age < 18:
            raise serializers.ValidationError('Too young to register byyyyy...')
        return value

    class Meta:
        model = User
        fields = ['profile', 'first_name', 'last_name', 'username', 'email', 'password', 'birth_date']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('images',)

    # def get_img_url(self, obj):
    #     return self.context['request'].build_absolute_uri(obj.image.url)


class Commentserializer(serializers.ModelSerializer):
    commented_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'description', 'post', 'commented_by', 'created_at')

    def get_commented_by(self, obj):
        return UserSerializer(instance=obj.commented_by).data


class PostSerializer(serializers.ModelSerializer):

    comments = serializers.SerializerMethodField()
    post_image = PostImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True, source="created_by")
    likes = serializers.SerializerMethodField(read_only=True)
    liked_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'created_by', 'content', 'comments', 'post_image', 'user', 'likes', 'liked_user')

    def get_comments(self, obj):
        return Commentserializer(Comment.objects.filter(post=obj).order_by('-id')[0:2], many=True).data

    def get_likes(self, obj):
        return obj.likes.count()

    def get_liked_user(self, obj):
        return list(obj.likes.values('username', 'profile'))


class SaveCommentserializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'description', 'post', 'commented_by')


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('likes',)
