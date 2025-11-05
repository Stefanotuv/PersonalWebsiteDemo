# backend/users/urls.py
from django.urls import path
from .views import RegisterView, LogoutView, UserProfileView, ChangePasswordView, LoginView, \
    UserProfilePictureUpdateView

urlpatterns = [

# ADD THE LOGIN URL HERE
    path('login/', LoginView.as_view(), name='login'),
    path('update/', UserProfileView.as_view(), name='update-user-profile'), # <--- FIXED URL MAPPING

    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/picture/', UserProfilePictureUpdateView.as_view(), name='update-profile-picture'),

]