# from dj_rest_auth.utils import jwt_encode
from django.contrib.sites import requests
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, GenericAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from personalsite import settings
from . import serializers
from .serializers import UserProfilePictureSerializer, \
    PasswordResetConfirmSerializer, PasswordResetRequestSerializer, HasPasswordSetResponseSerializer, GroupSerializer, UserListSerializer, \
    UserGroupManagementSerializer, GroupListSerializer, GroupDetailSerializer, PermissionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import CustomUser, UserProfile
# from grouping.models import LogEntry

from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
     LoginSerializer, LogoutSerializer, ChangePasswordSerializer
)
from django.contrib.auth import get_user_model

# --- Add this import at the top ---
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated  # Optional:  Require login
from rest_framework.authentication import SessionAuthentication, BasicAuthentication  # Optional:  Authentication methods
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework import generics
from .serializers import ForgotPasswordSerializer # Import the new serializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail

# ... (all your other existing imports) ...
from .serializers import ForgotPasswordSerializer
from django.db import connection  # <-- ADD THIS IMPORT
import logging # Use logging

logger = logging.getLogger(__name__)


User = get_user_model()
# @csrf_exempt


class LoginView(GenericAPIView):
    permission_classes = [permissions.AllowAny]  # Make sure it's public

    def get_serializer_class(self):  # This helps DRF generate input fields in the UI
        return LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Serialize the user data here
            user_data = UserSerializer(user).data

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,  # Include the user data in the response
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Try to authenticate the user using JWT
            auth = JWTAuthentication()
            user, token = auth.authenticate(request)

            if user:
                print(f"User authenticated via JWT: {user}")
            else:
                print("JWT Authentication failed") # here is the feedback

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            serializer.update(user, serializer.validated_data)
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfilePictureView(generics.UpdateAPIView):
    serializer_class = UserProfilePictureSerializer  # Dedicated serializer for image updates
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Crucial for file uploads

    def get_object(self):
        # Ensure profile exists
        user = self.request.user
        profile, created = UserProfile.objects.get_or_create(user=user)  # Get or create
        return profile

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)  # partial=True allows partial updates
        if serializer.is_valid(raise_exception=True):  # Raise exception on invalid data
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    """
    This view uses your existing PasswordResetConfirmSerializer and the URL
    with parameters: <str:uidb64>/<str:token>/
    """
    permission_classes = [permissions.AllowAny]
    # This should be your *original* serializer, not the new one I gave you
    # if you want to use the .save() method. Let's use the one from your file.
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, uidb64, token, *args, **kwargs):
        """
        The method signature is now CORRECT. It accepts uidb64 and token from the URL.
        """
        # We need to combine data from the URL and the request body
        # into a single dictionary for the serializer.
        serializer_data = {
            'uidb64': uidb64,
            'token': token,
            'new_password': request.data.get('new_password'),
            'new_password2': request.data.get('new_password2'),
        }

        # Now we pass the combined data to the serializer
        serializer = self.get_serializer(data=serializer_data)

        # This will now work and give you the specific error messages if it fails
        serializer.is_valid(raise_exception=True)

        # This calls the .save() method in your serializer, which sets the new password.
        serializer.save()

        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )

import logging
# --- IMPORT THE NEW, CORRECT FUNCTION FROM YOUR EMAIL SERVICE ---

logger = logging.getLogger(__name__)

# ... (rest of your views.py file)


class ForgotPasswordView(generics.GenericAPIView):
    """
    Handles the "forgot password" request by sending a reset link.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        # --- ORACLE WORKAROUND ---
        with connection.cursor() as cursor:
            cursor.execute("ALTER SESSION DISABLE PARALLEL QUERY")

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError:
            return Response(
                {"detail": "If an account with this email exists, we have sent instructions to reset your password. Remember to check your email spam "},
                status=status.HTTP_200_OK
            )

        email = serializer.validated_data['email']
        user = User.objects.get(email__iexact=email)

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}/"

        # --- THIS IS THE FINAL, CORRECT IMPLEMENTATION ---
        try:
            # This one line now does everything: sends, logs, and saves.
            send_password_reset_email(user=user, reset_url=reset_url)
        except Exception:
            # The detailed error is already logged by the email_service.
            # We pass here for security, so the user doesn't see an internal error.
            # The actual reason for the failure will be in your server logs.
            pass
        # --- END OF CHANGE ---

        return Response(
            {"detail": "If an account with this email exists, we have sent instructions to reset your password. Remember to check your email spam"},
            status=status.HTTP_200_OK
        )

from rest_framework_simplejwt.tokens import RefreshToken # Ensure RefreshToken is imported
import logging


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import make_password
from .serializers import SetPasswordSerializer

class SetPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            user = request.user  # Get the authenticated user
            user.password = make_password(new_password)  # Hash the password
            user.save()
            update_session_auth_hash(request, user)  # Update session

            return Response({"detail": "Password successfully set."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HasPasswordSetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        has_password = user.has_usable_password()  # Check if a password is set

        serializer = HasPasswordSetResponseSerializer({'has_password': has_password})
        return Response(serializer.data, status=status.HTTP_200_OK)

from django.http import JsonResponse  #  IMPORT JsonResponse
import logging  # Import the logging module
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.contrib.auth import login as django_login
from django.conf import settings
import jwt  # For JWT-based authentication

# class LoginWithTokenView(APIView):
#     def post(self, request):
#         token_key = request.data.get('token')
#         logger.info(f"LoginWithTokenView: Received token_key: {token_key}")  # Log received token
#         logger.info("Testing logging LoginWithTokenView")
#
#         if not token_key:
#             logger.warning("LoginWithTokenView: No App Token provided in request")
#             return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             # ✅ Get the Token object
#             logger.info(f"token_key {token_key} to query is ")
#             token = Token.objects.get(key=token_key)
#             user = token.user  # Get the user associated with the token
#             logger.info(f"LoginWithTokenView: App Token found for user: {user.email} (ID: {user.id})")
#         except Token.DoesNotExist:
#             logger.warning(f"LoginWithTokenView: Invalid App Token: {token_key}")
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
#
#         #  At this point, the token is VALID.
#         #  Log the user in using Django's auth system
#         django_login(request, user) # IMPORTANT: Logs the user into the Django session
#         logger.info(f"django_login succesful,  {user.email} ")
#         # Get Django session ID if using
#         session_key = request.session.session_key if hasattr(request, 'session') else None
#
#         #  If you're using Django's session-based authentication, you can simply return
#         #  user details:
#         data = { # Create a dictionary
#             'user': {'id': user.id, 'email': user.email},
#             'authToken': token_key,  # Echo back the app token
#             'sessionKey': session_key, #Django session
#         }
#
#         logger.info(f"LoginWithTokenView: User {user.email} successfully logged in. Returning data: {data}") # Log return
#
#         return JsonResponse(data, status=status.HTTP_200_OK)  # Use JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.contrib.auth import login as django_login
from django.conf import settings
from django.http import JsonResponse, HttpResponse  # IMPORT JsonResponse and HttpResponse
import logging  # Import the logging module
import json
from rest_framework.permissions import AllowAny # <-- NEW IMPORT

User = get_user_model()

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Import Simple JWT's RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken  # <-- NEW IMPORT

from rest_framework.response import Response as DRFResponse


class LoginWithTokenView(APIView):
    authentication_classes = []
    permission_classes = []

    # 3. APPLY THE DECORATOR LIKE THIS
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        logger.info("LoginWithTokenView: post() method was called!")

        token_key = request.data.get('token')  # This is the DRF authtoken from the magic link
        logger.info(f"LoginWithTokenView: Received magic_link_token_key: {token_key}")
        logger.info("Testing logging LoginWithTokenView")

        if not token_key:
            logger.warning("LoginWithTokenView: No Magic Link Token provided in request")
            return DRFResponse({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f"LoginWithTokenView: Attempting to get User from DRF Token object for key: {token_key}")
            # Use the DRF authtoken model to find the user from the magic link token
            drf_authtoken_obj = Token.objects.get(key=token_key)
            user = drf_authtoken_obj.user
            logger.info(f"LoginWithTokenView: User found for magic_link_token: {user.email} (ID: {user.id})")
        except Token.DoesNotExist:
            logger.warning(f"LoginWithTokenView: Invalid Magic Link Token: {token_key}")
            logger.exception("LoginWithTokenView: Token.DoesNotExist exception details:")
            return DRFResponse({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"LoginWithTokenView: An unexpected error occurred during user retrieval from token: {e}",
                         exc_info=True)
            return DRFResponse({"error": "Internal server error during token validation"},
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 1. Log the user in with Django's session (important for allauth's backend)
        django_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        logger.info(f"LoginWithTokenView: Django session login successful for user: {user.email}")

        # 2. Generate JWT tokens for the user
        try:
            refresh = RefreshToken.for_user(user)
            jwt_access_token = str(refresh.access_token)
            jwt_refresh_token = str(refresh)  # RefreshToken object itself is stringified to the token

            logger.info(f"LoginWithTokenView: Generated JWT Access Token (first 15 chars): {jwt_access_token[:15]}...")
            logger.info(
                f"LoginWithTokenView: Generated JWT Refresh Token (first 15 chars): {jwt_refresh_token[:15]}...")

            response_data = {
                'user': {'id': user.id, 'email': user.email},
                'access': jwt_access_token,  # <-- Return JWT Access Token
                'refresh': jwt_refresh_token,  # <-- Return JWT Refresh Token
                'sessionKey': request.session.session_key if hasattr(request, 'session') else None,
            }

            logger.info(
                f"LoginWithTokenView: User {user.email} successfully logged in with JWTs. Returning data: {response_data}")
            return DRFResponse(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"LoginWithTokenView: Exception during JWT token generation: {e}")
            return DRFResponse({"error": "Internal server error during JWT generation"},
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # i have to change the token type
# class LoginWithTokenView(APIView):
#     permission_classes = [AllowAny]  # <-- THIS LINE IS THE EXCEPTION
#     def post(self, request):
#         token_key = request.data.get('token')
#         logger.info(f"LoginWithTokenView: Received token_key: {token_key}")  # Log received token
#         logger.info("Testing logging LoginWithTokenView")
#
#         if not token_key:
#             logger.warning("LoginWithTokenView: No App Token provided in request")
#             return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             # ✅ Get the Token object
#             logger.info(f"token_key {token_key} to query is ")
#             token = Token.objects.get(key=token_key)
#             user = token.user  # Get the user associated with the token
#             logger.info(f"LoginWithTokenView: App Token found for user: {user.email} (ID: {user.id})")
#         except Token.DoesNotExist:
#             logger.warning(f"LoginWithTokenView: Invalid App Token: {token_key}")
#             # ADD THESE LINES:
#             logger.exception("Token.DoesNotExist exception:")  # Log the full exception
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
#
#         #  At this point, the token is VALID.
#         #  Log the user in using Django's auth system
#         django_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
#         # django_login(request, user) # IMPORTANT: Logs the user into the Django session
#         logger.info(f"django_login succesful,  {user.email} ")
#         # Get Django session ID if using
#         session_key = request.session.session_key if hasattr(request, 'session') else None
#
#         #  If you're using Django's session-based authentication, you can simply return
#         #  user details:
#         data = { # Create a dictionary
#             'user': {'id': user.id, 'email': user.email},
#             'authToken': token_key,  # Echo back the app token
#             'sessionKey': session_key, #Django session
#         }
#
#         logger.info(f"LoginWithTokenView: User {user.email} successfully logged in. Returning data: {data}") # Log return
#         try:
#             # Attempt to return the JsonResponse
#             json_data = json.dumps(data)
#             response = HttpResponse(json_data, content_type='application/json')
#             response.status_code = 200
#             return response
#         except Exception as e:
#             # Log any exceptions during JsonResponse creation
#             logger.exception(f"Exception during JsonResponse creation: {e}")
#             return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#
# class LoginWithTokenView(APIView):
#     def post(self, request):
#         token_key = request.data.get('token')
#         logger.info(f"LoginWithTokenView: Received token_key: {token_key}")  # Log received token
#         logger.info("Testing logging LoginWithTokenView")
#
#         if not token_key:
#             logger.warning("LoginWithTokenView: No App Token provided in request")
#             return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             # ✅ Get the Token object
#             logger.info(f"token_key {token_key} to query is ")
#             token = Token.objects.get(key=token_key)
#             user = token.user  # Get the user associated with the token
#             logger.info(f"LoginWithTokenView: App Token found for user: {user.email} (ID: {user.id})")
#         except Token.DoesNotExist:
#             logger.warning(f"LoginWithTokenView: Invalid App Token: {token_key}")
#             # ADD THESE LINES:
#             logger.exception("Token.DoesNotExist exception:")  # Log the full exception
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
#
#         #  At this point, the token is VALID.
#         #  Log the user in using Django's auth system
#         django_login(request, user) # IMPORTANT: Logs the user into the Django session
#         logger.info(f"django_login succesful,  {user.email} ")
#         # Get Django session ID if using
#         session_key = request.session.session_key if hasattr(request, 'session') else None
#
#         #  If you're using Django's session-based authentication, you can simply return
#         #  user details:
#         data = { # Create a dictionary
#             'user': {'id': user.id, 'email': user.email},
#             'authToken': token_key,  # Echo back the app token
#             'sessionKey': session_key, #Django session
#         }
#
#         logger.info(f"LoginWithTokenView: User {user.email} successfully logged in. Returning data: {data}") # Log return
#         try:
#             # Attempt to return the JsonResponse
#             return JsonResponse(data, status=status.HTTP_200_OK)  # Use JsonResponse
#         except Exception as e:
#             # Log any exceptions during JsonResponse creation
#             logger.exception(f"Exception during JsonResponse creation: {e}")
#             return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework import viewsets, permissions
from users.models import CustomUser # Import the user model from the users app
from .serializers import AdminUserSerializer # Import the new serializer from this app
from django.contrib.auth.models import Group
from rest_framework.filters import SearchFilter, OrderingFilter


class GroupListView(generics.ListAPIView):
    """
    API endpoint that provides a list of all available Groups.
    Protected to only be accessible by admin users.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]


class UserAndGroupAssignmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint specifically for viewing and managing user group assignments.
    This is separate from the existing UserManagementViewSet to avoid conflicts.
    """
    queryset = CustomUser.objects.all().order_by('email')
    permission_classes = [permissions.IsAdminUser]

    # # --- ADD THESE LINES ---
    # filter_backends = [SearchFilter]
    # search_fields = ['email', 'first_name', 'last_name']
    #
    # # ---------------------

    filter_backends = [SearchFilter, OrderingFilter]

    # This tells DRF which fields the user is allowed to search on
    search_fields = ['first_name', 'last_name', 'email']

    # 👇 **THIS IS THE NEW PART FOR SORTING**
    # This tells the OrderingFilter which fields are allowed to be sorted.
    # The frontend will be able to request ?ordering=email or ?ordering=-first_name
    ordering_fields = ['first_name', 'last_name', 'email','date_joined', 'last_login']

    # (Optional but recommended) Set a default ordering
    ordering = ['-date_joined']

    # ----------------------------

    def get_serializer_class(self):
        """
        Uses a simple serializer for the list view, and a detailed one for editing.
        """
        if self.action == 'list':
            return UserListSerializer

        return UserGroupManagementSerializer


# --- END OF MISSING CODE ---




# === ADD THIS NEW VIEWSET AT THE END OF THE FILE ===
class UserManagementViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows admins to view and edit users.
    """
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser] # IMPORTANT: Only staff can access this
    lookup_field = 'pk'

    # already have SearchFilter here.
    filter_backends = [SearchFilter, OrderingFilter]

    # This tells DRF which fields the user is allowed to search on
    search_fields = ['first_name', 'last_name', 'email']

    # 👇 **THIS IS THE NEW PART FOR SORTING**
    # This tells the OrderingFilter which fields are allowed to be sorted.
    # The frontend will be able to request ?ordering=email or ?ordering=-first_name
    ordering_fields = ['first_name', 'last_name', 'email']

    # (Optional but recommended) Set a default ordering
    ordering = ['first_name']
    # ----------------------------

    # def get_serializer_class(self):
    #     # Use a simpler serializer for the 'list' action
    #     if self.action == 'list':
    #         return UserListSerializer
    #     # Use the detailed serializer for 'retrieve', 'update', etc.
    #     return UserGroupManagementSerializer
# ==================================================

from django.contrib.auth.models import Group, Permission


class CheckPermissionView(APIView):
    """
    Checks if the currently authenticated user has a specific permission.
    The frontend will send the permission string (e.g., 'communities.view_community')
    in the query parameters.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        permission_string = request.query_params.get('permission', None)
        if not permission_string:
            return Response({'error': 'Permission parameter is required.'}, status=400)

        has_perm = request.user.has_perm(permission_string)

        return Response({
            'permission': permission_string,
            'has_permission': has_perm
        })

# --- NEW: A ViewSet for managing Groups ---
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creating, viewing, updating, and deleting Groups.
    """
    queryset = Group.objects.all().order_by('name')
    permission_classes = [permissions.IsAdminUser] # Only superusers can manage groups

    def get_serializer_class(self):
        if self.action == 'list':
            return GroupListSerializer
        return GroupDetailSerializer

# --- NEW: A simple view to list all available permissions ---
class PermissionListView(generics.ListAPIView):
    """
    API endpoint that provides a list of all available Permissions.
    """
    # Exclude Django's internal admin/log/session permissions for clarity
    queryset = Permission.objects.exclude(
        content_type__app_label__in=['admin', 'auth', 'contenttypes', 'sessions']
    ).order_by('content_type__app_label', 'name')
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAdminUser]
# --- ADD/CONFIRM THESE LINES ---
    filter_backends = [SearchFilter]
    search_fields = ['name', 'codename']
    # ---------------------------


# class FirebaseGoogleLoginView(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         id_token = request.data.get('token')
#         if not id_token:
#             return Response({"error": "ID token is required."}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             decoded_token = auth.verify_id_token(id_token)
#             email = decoded_token.get('email')
#             first_name = decoded_token.get('name', '').split(' ')[0]
#             user, created = CustomUser.objects.get_or_create(
#                 email=email,
#                 defaults={'first_name': first_name}
#             )
#             if created:
#                 UserProfile.objects.create(user=user)
#             refresh = RefreshToken.for_user(user)
#             user_data = UserSerializer(user).data
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user': user_data,
#             }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": f"Login failed: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)