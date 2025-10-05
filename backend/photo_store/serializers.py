# backend/photo_store/serializers.py
from rest_framework import serializers
from .models import Gallery, GalleryImage

# class GalleryImageSerializer(serializers.ModelSerializer):
#     # This field will return the absolute URL for the image, crucial for frontend
#     image_url = serializers.SerializerMethodField()
#     gallery_name = serializers.CharField(source='gallery.name', read_only=True) # For display
#
#     class Meta:
#         model = GalleryImage
#         fields = ['id', 'title', 'description', 'image', 'image_url', 'uploaded_at', 'gallery', 'gallery_name']
#         read_only_fields = ['uploaded_at', 'image_url'] # image_url is generated, not saved directly
#
#     def get_image_url(self, obj):
#         # Build the full absolute URL for the image.
#         if obj.image:
#             request = self.context.get('request')
#             if request is not None:
#                 return request.build_absolute_uri(obj.image.url)
#             return obj.image.url # Fallback if request context not available
#         return None
#
#     # Handle image upload explicitly (Django REST Framework automatically handles FileField)
#     # This part is mostly for documentation or if custom validation/handling is needed.
#     # No custom create/update needed if direct ModelSerializer save works with ImageField.

# class GalleryImageSerializer(serializers.ModelSerializer):
#     # This read-only field gets the full URL for the frontend
#     image_url = serializers.ImageField(source='image', read_only=True)
#     gallery_name = serializers.CharField(source='gallery.name', read_only=True, allow_null=True)
#
#     # Make the 'image' field not required for updates (PATCH)
#     # This allows users to change the title/gallery without re-uploading the image.
#     image = serializers.ImageField(write_only=True, required=False)
#
#     class Meta:
#         model = GalleryImage
#         fields = [
#             'id',
#             'title',
#             'description',
#             'image',  # The write-only upload field
#             'image_url',  # The read-only URL field for display
#             'uploaded_at',
#             'gallery',  # The gallery ID (write-only)
#             'gallery_name'  # The gallery name (read-only for display)
#         ]
#         # For writing (POST/PATCH), only these fields are expected from the client
#         extra_kwargs = {
#             'gallery': {'write_only': True, 'required': False, 'allow_null': True},
#             'title': {'required': False},  # Title is also not strictly required on update
#         }
#
#     def create(self, validated_data):
#         # On create, the image file IS required. Let's enforce that here.
#         if 'image' not in validated_data:
#             raise serializers.ValidationError({'image': 'This field is required for new uploads.'})
#         return super().create(validated_data)
#
#     def update(self, instance, validated_data):
#         # Handle un-assigning from a gallery
#         # If 'gallery' is in the data and its value is None or '', set it to None.
#         if 'gallery' in validated_data and not validated_data['gallery']:
#             validated_data['gallery'] = None
#         return super().update(instance, validated_data)

class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source='image', read_only=True)
    gallery_name = serializers.CharField(source='gallery.name', read_only=True, allow_null=True)

    # Make the 'image' field optional for updates (PATCH requests)
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = GalleryImage
        fields = [
            'id',
            'title',
            'description',
            'image',
            'image_url',
            'uploaded_at',
            'gallery',
            'gallery_name'
        ]
        extra_kwargs = {
            'gallery': {'write_only': True, 'required': False, 'allow_null': True},
            'title': {'required': False},
        }

    def create(self, validated_data):
        if 'image' not in validated_data:
            raise serializers.ValidationError({'image': 'This field is required for new uploads.'})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle un-assigning from a gallery if an empty string is sent
        if 'gallery' in validated_data and not validated_data['gallery']:
            validated_data['gallery'] = None
        return super().update(instance, validated_data)

class GallerySerializer(serializers.ModelSerializer):
    # Optionally nest images to show them when retrieving a gallery
    # If you expect many images per gallery, consider a separate endpoint for images.
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = ['id', 'name', 'slug', 'description', 'created_at', 'images']
        # fields = ['id', 'name', 'slug', 'description', 'created_at']
        read_only_fields = ['created_at', 'slug'] # Slug is auto-generated

class GalleryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['name', 'description']