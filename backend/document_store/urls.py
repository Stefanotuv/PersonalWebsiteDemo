# backend/document_store/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import DocumentViewSet, DocumentCategoryViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'categories', DocumentCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]