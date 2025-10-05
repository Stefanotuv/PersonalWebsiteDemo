# backend/photo_store/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import GalleryViewSet, GalleryImageViewSet, GalleryUpdateView

router = DefaultRouter()
# router.register(r'galleries', GalleryViewSet) # Path will be /api/photos/galleries/
# router.register(r'images', GalleryImageViewSet) # Path will be /api/photos/images/
router.register(r'galleries', GalleryViewSet, basename='gallery')
router.register(r'images', GalleryImageViewSet, basename='galleryimage')

urlpatterns = [
    path('galleries/update/<int:pk>/', GalleryUpdateView.as_view(), name='gallery-update'),
    path('', include(router.urls)),
]