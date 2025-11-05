# backend/users/views.py
from rest_framework import generics, permissions, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import CustomUser, UserProfile
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ChangePasswordSerializer, \
    ProfilePictureSerializer


# class RegisterView(generics.CreateAPIView):
#     # This view is almost perfect. We just use it as is.
#     permission_classes = [permissions.AllowAny]
#     serializer_class = RegisterSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer) # This calls serializer.save() which creates the user

        # --- CHANGE HERE: REMOVE AUTO-LOGIN AND TOKEN RETURN ---
        # Instead of returning tokens, just confirm creation.
        headers = self.get_success_headers(serializer.data)
        return Response({
            "message": "Registration successful. Please log in.",
            # "email": serializer.data['email'] # Optionally return email
        }, status=status.HTTP_201_CREATED, headers=headers)
        # --- END CHANGE ---

class LoginView(generics.GenericAPIView):
    # ... (no change needed here) ...
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data,
        }, status=status.HTTP_200_OK)

class LoginView(generics.GenericAPIView):
    # This view is also perfect. Use as is.
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data,
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    # Your logout view was a bit complex. This is simpler and safer.
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    # This combines getting and updating the user's profile info.
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        # Ensure a UserProfile object exists for the user before fetching/updating
        UserProfile.objects.get_or_create(user=self.request.user)
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    # Your original ChangePasswordView was fine, this just makes it a bit more standard.
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)

# DELETED: All password reset, social link, and profile picture views for now.
# FOCUS ON THE CORE: Login, Logout, Register, View/Update Profile.

class UserProfilePictureUpdateView(generics.UpdateAPIView): # <--- NEW VIEW FOR PICTURE
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfilePictureSerializer
    # Use PATCH for partial update (only the picture field)
    http_method_names = ['patch'] # Restrict to PATCH requests

    def get_object(self):
        # Get the related UserProfile object for the authenticated user
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Pass partial=True for PATCH requests
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Return the updated profile picture URL (or the full profile for convenience)
        return Response({
            "detail": "Profile picture updated successfully",
            "profile_picture": instance.profile_picture.url if instance.profile_picture else None
        }, status=status.HTTP_200_OK)