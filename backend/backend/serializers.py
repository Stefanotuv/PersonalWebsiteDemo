from django.contrib.auth.password_validation import validate_password
# Backend/serialisers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken


from django.contrib.auth import get_user_model
from users.models import UserProfile  # Import UserProfile
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings # Import settings

# --- OR ADD THIS LINE AT THE TOP ---
from rest_framework.exceptions import ValidationError


from users.models import CustomUser # Make sure you import your model

from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django.conf import settings
import requests  # Need this for token validation
import logging

logger = logging.getLogger(__name__)

User = get_user_model()  # Use the custom user model

# --- Serializer for UserSocialLink ---

# class UserProfileSerializer(serializers.ModelSerializer):
#     profile_picture = serializers.SerializerMethodField()
#     social_links = UserSocialLinkSerializer(many=True, read_only=True)
#     id = serializers.IntegerField(source='user.id', read_only=True)
#     temp_id = serializers.SerializerMethodField()  # Add this temporarily
#
#     # --- ADDED THESE TWO LINES ---
#     # We pull `first_name` and `email` from the related User model.
#     first_name = serializers.CharField(source='user.first_name', read_only=True)
#     email = serializers.EmailField(source='user.email', read_only=True)
#
#     # --- END OF ADDED LINES ---
#
#     class Meta:
#         model = UserProfile
#
#         fields = ['bio', 'phone_number', 'address', 'profile_picture', 'social_links','id',
#                   'temp_id','first_name','email'
#                   ]
#     def get_temp_id(self, obj):
#         # Print directly to debug
#         print(f"DEBUG: UserProfileSerializer.get_temp_id -> obj.id: {obj.id}, obj.user.id: {obj.id if hasattr(obj, 'user') else 'N/A'}")
#         return obj.id # Try returning obj.user.id or obj.id directly
#
#     def update(self, instance, validated_data):
#         # Handle profile_picture separately
#         profile_picture = validated_data.pop('profile_picture', None)  # Extract and remove from validated_data
#         if profile_picture is not None:
#             instance.profile_picture = profile_picture
#
#         # """Update user profile fields"""
#         for key, value in validated_data.items():
#             setattr(instance, key, value)
#         instance.save()
#         return instance
#
#     # def get_profile_picture(self, obj):
#     #     """
#     #     Return the user profile picture's full absolute URL.
#     #     'obj' here is the UserProfile instance itself.
#     #     """
#     #     if hasattr(obj, 'profile') and obj.profile.profile_picture:
#     #         # Now that we know obj.profile.profile_picture exists, we can safely work with it.
#     #         profile_picture_field = obj.profile.profile_picture
#     #
#     #         # The check 'if profile_picture_field' is enough. `hasattr(..., 'name')` is redundant.
#     #         # The .url attribute is the safest and most direct way to get the full URL.
#     #         # Django automatically prepends settings.MEDIA_URL to the .url attribute.
#     #
#     #         try:
#     #             # Let Django build the URL for you. It's the most reliable way.
#     #             # This will result in something like "/media/profile_pics/your_image.png"
#     #             # full_url = profile_picture_field.url
#     #             full_url = profile_picture_field.url
#     #
#     #             # --- FOR ABSOLUTE URLS (Needed by mobile apps and external services) ---
#     #             # If the context contains the request, we can build a full, absolute URL.
#     #             request = self.context.get('request')
#     #             if request:
#     #                 return request.build_absolute_uri(full_url)
#     #             else:
#     #                 # Fallback if request is not in context (e.g., in a manage.py script)
#     #                 return full_url
#     #
#     #         except (ValueError, AttributeError):
#     #             # This handles cases where the file might be gone from storage but still in the DB.
#     #             return None
#     #
#     #     else:
#     #
#     #         # The 'obj' is the UserProfile, so we access its 'profile_picture' field directly.
#     #         profile_picture_field = obj.profile_picture
#     #
#     #         # Check if the field has a file associated with it.
#     #         if profile_picture_field:
#     #             try:
#     #                 # Get the relative URL (e.g., /media/profile_pics/image.png)
#     #                 relative_url = profile_picture_field.url
#     #
#     #                 # Get the request from the serializer's context to build a full URL
#     #                 request = self.context.get('request')
#     #                 if request:
#     #                     # This builds the full URL, like https://www.project-good.com/media/...
#     #                     return request.build_absolute_uri(relative_url)
#     #
#     #                 # Fallback if there's no request context (less common)
#     #                 return relative_url
#     #
#     #             except (ValueError, AttributeError):
#     #                 # This can happen if the file is deleted from storage but the DB path remains.
#     #                 return None
#     #
#     #         # If there is no picture file, return None.
#     #     return None
#
# #  # ------------    This below has not been fully tested ------------------ #
#     def get_profile_picture(self, obj):
#         """
#         Return the user profile picture's full absolute URL.
#         This method is robustly handles being passed either a CustomUser object
#         or a UserProfile object.
#         """
#         profile_picture_field = None
#
#         # --- THIS IS THE CORE LOGIC YOU DISCOVERED ---
#         # First, determine which type of object 'obj' is and get the file field.
#         if hasattr(obj, 'profile') and hasattr(obj.profile, 'profile_picture'):
#             # This handles the case where 'obj' is a CustomUser instance.
#             profile_picture_field = obj.profile.profile_picture
#         elif hasattr(obj, 'profile_picture'):
#             # This handles the case where 'obj' is a UserProfile instance.
#             profile_picture_field = obj.profile_picture
#         # -------------------------------------------------
#
#         # Now, if we successfully found a picture field, build the URL.
#         if profile_picture_field:
#             try:
#                 relative_url = profile_picture_field.url
#                 request = self.context.get('request')
#                 if request:
#                     # Build the full absolute URL (e.g., https://...)
#                     return request.build_absolute_uri(relative_url)
#
#                 # Fallback if there's no request context
#                 return relative_url
#             except (ValueError, AttributeError):
#                 # This handles cases where the file is missing from storage.
#                 return None
#
#         # If no picture was found in either context, return None.
#         return None
#
#
#
#
#     # def get_profile_picture(self, obj):
#     #     """
#     #     Return user profile picture's full URL.
#     #     This method now correctly handles being passed a CustomUser object by accessing its related 'profile'.
#     #     """
#     #     # --- THE FIX ---
#     #     # 1. Check if the CustomUser object 'obj' has a related 'profile' attribute.
#     #     # 2. Then, check if that profile has a 'profile_picture'.
#     #     # This prevents the AttributeError.
#     #     if hasattr(obj, 'profile') and obj.profile.profile_picture:
#     #         # Now that we know obj.profile.profile_picture exists, we can safely work with it.
#     #         profile_picture_field = obj.profile.profile_picture
#     #
#     #         # The check 'if profile_picture_field' is enough. `hasattr(..., 'name')` is redundant.
#     #         # The .url attribute is the safest and most direct way to get the full URL.
#     #         # Django automatically prepends settings.MEDIA_URL to the .url attribute.
#     #
#     #         try:
#     #             # Let Django build the URL for you. It's the most reliable way.
#     #             # This will result in something like "/media/profile_pics/your_image.png"
#     #             full_url = profile_picture_field.url
#     #
#     #             # --- FOR ABSOLUTE URLS (Needed by mobile apps and external services) ---
#     #             # If the context contains the request, we can build a full, absolute URL.
#     #             request = self.context.get('request')
#     #             if request:
#     #                 return request.build_absolute_uri(full_url)
#     #             else:
#     #                 # Fallback if request is not in context (e.g., in a manage.py script)
#     #                 return full_url
#     #
#     #         except (ValueError, AttributeError):
#     #             # This handles cases where the file might be gone from storage but still in the DB.
#     #             return None
#     #
#     #     # If the user has no profile or no profile picture, return None.
#     #     return None


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Authenticate user"""
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive. Contact support.")

        data["user"] = user
        return data

class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate(self, data):
        """Blacklist the refresh token"""
        try:
            token = RefreshToken(data['refresh_token'])
            token.blacklist()  # Blacklist the token to prevent reuse
        except Exception:
            raise serializers.ValidationError("Invalid or expired token.")
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        """Ensure new password is different from the old one"""
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError("New password cannot be the same as the old password.")
        return data

    def update(self, instance, validated_data):
        """Update user's password"""
        if not instance.check_password(validated_data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance

class UserProfilePictureSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ['profile_picture']

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        """Check if the email exists."""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("There is no user registered with this email address.")
        return value

    def save(self):
        """Generate token and send email."""
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}/"  # Replace with your frontend URL

        send_mail(
            'Password Reset Request',
            f'Please click the following link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,  # Use DEFAULT_FROM_EMAIL from settings
            [email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    # These fields are expected in the POST data from the view
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8, required=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, min_length=8, required=True)

    def validate(self, data):
        # 1. Check if passwords match
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({
                "new_password2": "The two password fields didn't match."
            })

        # 2. Decode the user ID and find the user
        try:
            from django.utils.encoding import force_str
            from django.utils.http import urlsafe_base64_decode
            uid = force_str(urlsafe_base64_decode(data['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            # If the user ID is bad for any reason, the link is invalid.
            # We raise this specific error.
            raise serializers.ValidationError({
                "uidb64": "The password reset link is invalid."
            })

        # 3. Check if the token is valid for that user
        if not default_token_generator.check_token(user, data['token']):
            # This is the most common failure point. The token has expired or was already used.
            raise serializers.ValidationError({
                "token": "The password reset link is invalid or has expired. Please request a new one."
            })

        # 4. If all checks pass, attach the user to the validated data
        data['user'] = user
        return data

    def save(self):
        """Set the new password."""
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()

class ForgotPasswordSerializer(serializers.Serializer):
    """
    Dedicated serializer for the forgot password email request.
    Takes an email and validates it. The view will handle sending the email.
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        # We check if the user exists for our internal logic
        if not User.objects.filter(email__iexact=value, is_active=True).exists():
            # This now uses the correctly imported ValidationError
            raise ValidationError("User not found.")
        return value



from rest_framework import serializers

class SetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, min_length=8) # Adjust min_length as needed

class HasPasswordSetResponseSerializer(serializers.Serializer):
    has_password = serializers.BooleanField()  # Serializer for the API response

# === ADD THIS NEW SERIALIZER AT THE END OF THE FILE ===
class AdminUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User Management admin panel.
    Provides detailed user info and allows updating moderation-related fields.
    """
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email', # I am using email instead of username based on your model
            'first_name',
            'last_name',
            'is_active',      # This is for banning/un-banning
            'is_staff',       # To see if they are a staff member
            'is_restricted',  # This is for the new soft-ban
            'date_joined',
        ]
        # Admins should only be able to change these specific fields via this serializer
        read_only_fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'date_joined',
        ]
# ========================================================

from django.contrib.auth.models import Group
from django.contrib.auth.models import Group, Permission

# --- NEW: A serializer for the Permission model ---
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']



# --- UPDATED: GroupSerializer becomes GroupDetailSerializer ---
class GroupDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a single group, including its permissions.
    """
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="A list of Permission IDs to assign to the group."
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'permission_ids']

    def update(self, instance, validated_data):
        if 'permission_ids' in validated_data:
            permission_ids = validated_data.pop('permission_ids')
            instance.permissions.set(permission_ids)
        # Handle name change
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

# --- Simple Group List Serializer (for dropdowns, etc.) ---
class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserGroupManagementSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a single user, designed for managing their groups.
    """
    # 'groups' will be a list of Group objects on read (GET)
    groups = GroupDetailSerializer(many=True, read_only=True)

    # For writing (PUT/PATCH), we want to accept a list of group IDs.
    group_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = CustomUser
        # Expose only the fields needed for management
        fields = ['id', 'email', 'first_name', 'last_name', 'groups', 'group_ids']

    def update(self, instance, validated_data):
        # This is the custom logic to update a user's groups
        if 'group_ids' in validated_data:
            group_ids = validated_data.pop('group_ids')
            instance.groups.set(group_ids)  # 'set' is a clean way to replace all groups

        # Let the parent class handle updating other fields like first_name, etc.
        return super().update(instance, validated_data)


class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for the Group model.
    """

    class Meta:
        model = Group
        fields = ['id', 'name']


class UserListSerializer(serializers.ModelSerializer):
    """
    A simplified serializer for just listing users in the group management UI.
    """

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']


class UserGroupManagementSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a single user, specifically for managing their groups.
    """
    groups = GroupSerializer(many=True, read_only=True)

    group_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="A list of Group IDs to assign to the user."
    )

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'groups', 'group_ids']

        # --- ADD THIS LINE ---
        read_only_fields = ['email', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        # Custom logic to cleanly update the user's groups from a list of IDs.
        if 'group_ids' in validated_data:
            group_ids = validated_data.pop('group_ids')
            instance.groups.set(group_ids)

        return super().update(instance, validated_data)