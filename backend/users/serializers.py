# backend/users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'password2', 'first_name', 'last_name','interest_notes')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            # Make the interest notes optional on the API level
            'interest_notes': {'required': False, 'allow_blank': True},}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError("Incorrect Credentials")

class UserProfileSerializer(serializers.ModelSerializer): # <--- NEW SERIALIZER
    class Meta:
        model = UserProfile
        fields = ('bio', 'phone_number', 'address', 'profile_picture')
        # We make profile_picture read-only here, to avoid updating it via the general UserSerializer PATCH
        read_only_fields = ('profile_picture',)


class UserSerializer(serializers.ModelSerializer):
    # This serializer is for VIEWING and UPDATING (first_name, last_name, email).
    profile = UserProfileSerializer(read_only=True) # <--- ADD NESTED PROFILE

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff', 'profile') # <--- ADD 'profile'
        # You can add more fields from UserProfile here later if you want.


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Your old password was entered incorrectly. Please enter it again.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class ProfilePictureSerializer(serializers.ModelSerializer): # <--- NEW SERIALIZER FOR PICTURE UPDATE
    class Meta:
        model = UserProfile
        fields = ('profile_picture',)
        # Ensure 'profile_picture' is not read-only here

    def update(self, instance, validated_data):
        # Handle the file upload and save
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
            instance.save()
        return instance