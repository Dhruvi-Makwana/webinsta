from user.views import RegisterView, LoginView, HomePage, LogoutView, PostPage,\
     AllComments, SaveComments
from django.urls import include, path

app_name = 'user'
# import routers
# from rest_framework import routers

# define the router
# router = routers.DefaultRouter()

# define the router path and viewset to be used
# router.register(r'user-register', RegisterView)

# specify URL Path for rest_framework
urlpatterns = [
    path('user_register/', RegisterView.as_view(), name='user_register'),
    # path('login/', LoginView.as_view(), name="login"),
    path('homepage/', HomePage.as_view(), name="homepage"),
    path('postpage/', PostPage.as_view(), name="postpage"),
    # path('comment/', CommentView.as_view(), name="comments"),
    path('homepage/post/<int:pk>/comments/', AllComments.as_view(), name="comment"),
    path('savecomment/', SaveComments.as_view(), name="savecomment"),
    # path('logout/', LogoutView.as_view(), name="logout")
    # path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls'))


]
