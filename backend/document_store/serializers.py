# backend/document_store/serializers.py
from rest_framework import serializers
from .models import Document, DocumentCategory

class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    download_url = serializers.SerializerMethodField() # For the actual file URL

    class Meta:
        model = Document
        fields = '__all__' # Includes file, name, description, category, is_current, etc.

    def get_download_url(self, obj):
        # Build the full URL for download.
        # This will include Django's MEDIA_URL and the file path.
        if obj.file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None