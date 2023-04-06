from django.shortcuts import render
from rest_framework import status
from .models import User, PostImage, Post, Comment
from rest_framework.response import Response
from .serializer import UserSerializer, LoginSerializer, \
    PostSerializer, Commentserializer, SaveCommentserializer
from rest_framework.views import APIView
from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import redirect, reverse
from rest_framework.parsers import JSONParser, MultiPartParser
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from user.task import my_first_task
from django.conf import settings
from collections import OrderedDict


class RegisterView(APIView):
    serializer_class = UserSerializer
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'user/register.html'
    parser_classes = (JSONParser, MultiPartParser)
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            save_user = user_serializer.save()
            save_user.set_password(save_user.password)
            save_user.save()
            my_first_task.delay(save_user.email)
            return redirect(reverse('user:login'))
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'user/login.html'
    parser_classes = (JSONParser, MultiPartParser)
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response(status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid()
        user = authenticate(request=request, **login_serializer.validated_data)
        if user:
            login(request, user)
            return Response({'logins': login_serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(login_serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)


class HomePage(APIView):
    permission_classes = (IsAuthenticated,)
    template_name = 'user/base.html'

    def get(self, request):
        return render(request, self.template_name)


class PostPage(APIView):

    template_name = 'user/base.html'
    renderer_classes = [TemplateHTMLRenderer]
    parser_classes = (JSONParser, MultiPartParser)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        posts = Post.objects.all().order_by('-id')
        return JsonResponse({'PostData': list(PostSerializer(posts, many=True).data)})

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        data['created_by'] = user.id

        post_serializer = PostSerializer(data=request.data)
        post_serializer.is_valid()
        get_post = post_serializer.save()
        PostImage.objects.create(images=request.data['images'], post=get_post)
        print(post_serializer.data)
        data = post_serializer.data
        image = OrderedDict()
        image['images'] = settings.SITE_URL+data['post_image'][0]['images']
        return JsonResponse({'id': data['id'], "content": data['content'], 'image': image['images']})

    def patch(self, request, *args, **kwargs):

        user = request.user
        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response({'update_user_success': serializer.data}, status=status.HTTP_202_ACCEPTED)


class AllComments(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        return JsonResponse({'GetComments': list(Commentserializer(Comment.objects.filter(post=kwargs.get('pk')).order_by('-id'), many=True).data)})


class SaveComments(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        user = request.user
        data['commented_by'] = user.id
        comment = SaveCommentserializer(data=data)
        comment.is_valid()
        comment_obj = comment.save()
        # data = comment.data

        return JsonResponse({'id': comment_obj.id, 'description':comment_obj.description,
                             'post_id': comment_obj.post.id, 'user': comment_obj.commented_by.username,
                             'user_profile': settings.SITE_URL+comment_obj.commented_by.profile.url})


class LikeFeature(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        posts = Post.objects.filter(pk=kwargs.get('pk'))
        return JsonResponse({'GetLikes': list(PostSerializer(posts, many=True).data)})

    def patch(self, request, *args, **kwargs):
        post_obj = Post.objects.get(pk=kwargs.get('pk'))
        user = request.user
        if user in post_obj.likes.all():
            post_obj.likes.remove(user)
            return Response({'action': 'dislike'})
        else:
            post_obj.likes.add(user)
            return JsonResponse({'action': 'like', 'id': kwargs.get('pk'), 'user': list(post_obj.likes.values_list('username', flat=True)),
                                 'email': list(post_obj.likes.values_list('email', flat=True)),
                                 'profile': list(post_obj.likes.values_list('profile', flat=True))})
            # return JsonResponse({'action': 'like', 'id': kwargs.get('pk'), 'user': list(post_obj.likes.values_list('username', 'email', 'profile'))})
# ,'user':list(post_obj.likes)



class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        logout(request)
        return redirect(reverse('user:login'))
