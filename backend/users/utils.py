# users/utils.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from backend.serializers import UserSerializer # Ensure your UserSerializer is imported
import logging

logger = logging.getLogger(__name__)

def custom_jwt_response_payload_handler(token, user=None, request=None):
    """
    Custom JWT response payload handler to include user data and a flag
    if a new social user needs to set a password.
    """
    logger.info(f"Custom JWT handler called for user: {user.email}")

    # Default payload from dj-rest-auth/simple-jwt
    payload = {
        'refresh': token,
        'access': str(RefreshToken(token).access_token),
        'user': UserSerializer(user).data,
    }

    # Check for the flag set by our signal receiver
    # This attribute is dynamically added in the signal only for new social users without password
    if hasattr(user, '_password_setup_required') and user._password_setup_required:
        payload['password_setup_required'] = True
        logger.info(f"Added 'password_setup_required: True' to JWT response for {user.email}")
    else:
        payload['password_setup_required'] = False
        logger.info(f"Added 'password_setup_required: False' to JWT response for {user.email}")

    return payload