from user.views import RegisterView, LoginView, HomePage, LogoutView, PostPage,\
     AllComments, SaveComments, LikeFeature
from django.urls import include, path

app_name = 'user'
urlpatterns = [
    path('user_register/', RegisterView.as_view(), name='user_register'),
    path('login/', LoginView.as_view(), name="login"),
    path('homepage/', HomePage.as_view(), name="homepage"),
    path('postpage/', PostPage.as_view(), name="postpage"),
    # path('comment/', CommentView.as_view(), name="comments"),
    path('homepage/post/<int:pk>/comments/', AllComments.as_view(), name="comment"),
    path('savecomment/', SaveComments.as_view(), name="savecomment"),
    path('homepage/like/<int:pk>/', LikeFeature.as_view(), name="like"),
    path('logout/', LogoutView.as_view(), name="logout"),
]
