from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
# === ADD THIS IMPORT FOR THE NEW VIEWSET ===
from .views import UserManagementViewSet
# ==========================================
# from .views import FirebaseGoogleLoginView


router = DefaultRouter()
# === ADD THIS NEW ROUTER FOR ADMIN-ONLY ENDPOINTS ===
admin_router = DefaultRouter()
admin_router.register(r'users', UserManagementViewSet, basename='user-management')
# ====================================================

# --- This is the new router for the new feature ---
group_admin_router = DefaultRouter()
group_admin_router.register(r'users', UserAndGroupAssignmentViewSet, basename='user-and-group-management')

# --- ADD THE NEW GROUP VIEWSET TO THE ROUTER ---
group_admin_router.register(r'groups', GroupViewSet, basename='group-management')

urlpatterns = [
# === ADD THIS LINE TO INCLUDE THE NEW ADMIN ROUTER ===
    # This will create endpoints like /backend/api/admin/users/
    path('api/admin/', include(admin_router.urls)),
    # =======================================================

    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),

    path('api/user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('update-profile-picture/', UpdateProfilePictureView.as_view(), name='update-profile-picture'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'), #Added url with new parameters required

    path("api/logout/", LogoutView.as_view(), name="logout"),

    path('api/user/profile/picture/', UpdateProfilePictureView.as_view(), name='update-profile-picture'),  # Add this line!
    # ******************************************************
    path('social/', include(router.urls)), # This assumes you include user/urls.py under something like 'api/user/'
    path('forgotpasswordreset/', ForgotPasswordView.as_view(), name='forgot-password-reset'),
    path('api/user/set-password/', SetPasswordView.as_view(), name='set-password'),
    path('api/user/has-password-set/', HasPasswordSetView.as_view(), name='has-password-set'),

    # The NEW, non-conflicting path for group management
    path('api/group-admin/', include(group_admin_router.urls)),
    path('api/group-admin/groups/', GroupListView.as_view(), name='group-admin-list'),
    path('api/user/check-permission/', CheckPermissionView.as_view(), name='check-permission'),

# The NEW, non-conflicting path for group management
    path('api/group-admin/', include(group_admin_router.urls)),
    # --- ADD THE NEW PERMISSIONS LIST URL ---
    path('api/group-admin/permissions/', PermissionListView.as_view(), name='permission-list'),
    # path('google/firebase/', FirebaseGoogleLoginView.as_view(), name='firebase_google_login'),

]