# backend/photo_store/views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.parsers import MultiPartParser, FormParser # For handling file uploads
from rest_framework.response import Response
from rest_framework.decorators import action # For custom actions like by slug
from django.shortcuts import get_object_or_404 # For retrieving by slug

from .models import Gallery, GalleryImage
from .serializers import GallerySerializer, GalleryImageSerializer, GalleryUpdateSerializer


class GalleryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows galleries to be viewed or edited.
    - Public users can list and retrieve galleries.
    - Admin users (IsAdminUser) can create, update, or delete galleries.
    """
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    # lookup_field = 'slug' # Allows retrieving a gallery by its slug instead of ID

    def get_permissions(self):
        """
        Permissions logic for Galleries:
        - 'list', 'retrieve', 'retrieve_by_slug': AllowAny (public access)
        - 'create', 'update', 'partial_update', 'destroy': IsAdminUser (only staff can manage)
        """
        if self.action in ['list', 'retrieve', 'retrieve_by_slug']:
            permission_classes = [permissions.AllowAny]
        else: # For create, update, delete
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    # Custom action to retrieve a gallery by its slug
    @action(detail=True, methods=['get'], url_path='by-slug')
    def retrieve_by_slug(self, request, slug=None):
        gallery = get_object_or_404(Gallery, slug=slug)
        serializer = self.get_serializer(gallery)
        return Response(serializer.data)


class GalleryImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows gallery images to be viewed, uploaded, or deleted.
    - Public users can list and retrieve images.
    - Admin users (IsAdminUser) can create, update, or delete images.
    - Supports filtering by gallery slug or ID, or listing unassigned images.
    """
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    # CRUCIAL: Add parsers for handling file uploads (multipart form data)
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Permissions logic for Gallery Images:
        - 'list', 'retrieve': AllowAny (public access)
        - 'create', 'update', 'partial_update', 'destroy': IsAdminUser (only staff can manage)
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else: # For create, update, delete
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Optionally restricts the returned images to a given gallery or unassigned.
        Expected query params: gallery_id, gallery_slug, unassigned=true
        """
        queryset = GalleryImage.objects.all()
        gallery_id = self.request.query_params.get('gallery_id', None)
        gallery_slug = self.request.query_params.get('gallery_slug', None)
        unassigned = self.request.query_params.get('unassigned', None)

        if gallery_id is not None:
            queryset = queryset.filter(gallery_id=gallery_id)
        elif gallery_slug is not None:
            queryset = queryset.filter(gallery__slug=gallery_slug)
        elif unassigned == 'true':
            queryset = queryset.filter(gallery__isnull=True)

        return queryset.order_by('-uploaded_at') # Always order by newest first

class GalleryUpdateView(generics.UpdateAPIView):
    queryset = Gallery.objects.all()
    serializer_class = GalleryUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['patch'] # Lock it down to only allow PATCH
