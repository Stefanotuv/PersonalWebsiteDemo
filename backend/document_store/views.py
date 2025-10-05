# backend/document_store/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document, DocumentCategory
from .serializers import DocumentSerializer, DocumentCategorySerializer

class DocumentCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows document categories to be viewed or edited.
    Only staff (admin) users can create, update, or delete categories.
    Anyone can list categories.
    """
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny] # Anyone can list/view categories
        else:
            permission_classes = [permissions.IsAdminUser] # Only admin can create/update/delete
        return [permission() for permission in permission_classes]

class DocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows documents to be viewed, uploaded, or deleted.
    - Public users can retrieve the 'current' CV.
    - Authenticated users can list their own documents (if a 'user' field was added to Document model).
    - Admin users can perform full CRUD on all documents.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def get_permissions(self):
        """
        Permissions logic for Documents:
        - 'current-cv': AllowAny (public access)
        - 'list', 'retrieve': IsAuthenticated (only logged-in users can see list/individual non-current documents)
        - 'create', 'update', 'partial_update', 'destroy': IsAdminUser (only staff can manage)
        """
        if self.action == 'current_cv':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['list', 'retrieve']: # Default for general document listing/retrieval
            permission_classes = [permissions.IsAuthenticated] # Assuming documents are user-specific or restricted
        else: # For create, update, delete
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        When creating a document, if it's marked as 'is_current',
        set all other documents of the same category to 'is_current=False'.
        """
        instance = serializer.save()
        if instance.is_current and instance.category:
            Document.objects.filter(category=instance.category).exclude(pk=instance.pk).update(is_current=False)

    def perform_update(self, serializer):
        """
        When updating a document, if it's marked as 'is_current',
        set all other documents of the same category to 'is_current=False'.
        """
        instance = serializer.save()
        if instance.is_current and instance.category:
            Document.objects.filter(category=instance.category).exclude(pk=instance.pk).update(is_current=False)

    @action(detail=False, methods=['get'])
    def current_cv(self, request):
        """
        Retrieves the single document marked as 'is_current' and categorized as 'CV'.
        Accessible by anyone (AllowAny).
        """
        try:
            # First, try to find a category named 'CV' (case-insensitive for robustness)
            cv_category = DocumentCategory.objects.get(name__iexact='CV')
            current_document = Document.objects.get(category=cv_category, is_current=True)
            serializer = self.get_serializer(current_document)
            return Response(serializer.data)
        except DocumentCategory.DoesNotExist:
            return Response({"detail": "CV category not found."}, status=status.HTTP_404_NOT_FOUND)
        except Document.DoesNotExist:
            return Response({"detail": "No current CV document found in 'CV' category."}, status=status.HTTP_404_NOT_FOUND)
        except Document.MultipleObjectsReturned:
            # Handle edge case where multiple CVs are marked current (shouldn't happen with perform_create/update)
            current_document = Document.objects.filter(category=cv_category, is_current=True).first()
            serializer = self.get_serializer(current_document)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)