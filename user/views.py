from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status
from .models import User,PostImage
from rest_framework.response import Response
from .serializer import UserSerializer,LoginSerializer, PostSerializer, PostImageSerializer
from rest_framework.views import APIView
from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import redirect, reverse
from rest_framework.parsers import JSONParser, MultiPartParser
from django.contrib.auth import authenticate
from django.contrib.auth import login
from rest_framework.permissions import AllowAny,IsAuthenticated


class RegisterView(APIView):
    serializer_class = UserSerializer
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'user/register.html'
    parser_classes = (JSONParser, MultiPartParser)

    def get(self, request, *args, **kwargs):

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({'USERS': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            save_user = user_serializer.save()
            save_user.set_password(save_user.password)
            save_user.save()

            return Response({'created_user': user_serializer.data}, status=status.HTTP_201_CREATED)
        return redirect(reverse('user:login'))


class LoginView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'user/login.html'
    parser_classes = (JSONParser, MultiPartParser)

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
    template_name = 'user/base.html'
    renderer_classes = [TemplateHTMLRenderer]
    parser_classes = (JSONParser, MultiPartParser)
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        data['created_by'] = user.id

        post_serializer = PostSerializer(data=request.data)
        post_serializer.is_valid()
        get_post = post_serializer.save()
        PostImage.objects.create(images=request.data['images'], post=get_post)
        return Response({'post_id': post_serializer.data}, status=status.HTTP_201_CREATED)

    def patch(self, request, *args, **kwargs):
        breakpoint()
        user = request.user
        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            save_user = serializer.save()
            save_user.set_password(save_user.password)
            serializer.save()
            return Response({'update_user_success': serializer.data}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
