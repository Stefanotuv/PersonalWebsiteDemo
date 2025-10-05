# backend/document_store/models.py
from django.db import models


class DocumentCategory(models.Model):
    """
    Categorizes documents (e.g., 'CV', 'Cover Letter', 'Certificate', 'Project Documentation').
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Document Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Document(models.Model):
    """
    Represents an uploaded document, like a CV or cover letter.
    """
    # Using Django's FileField which handles storage paths.
    # Files will be uploaded to MEDIA_ROOT/documents/
    file = models.FileField(upload_to='documents/')
    name = models.CharField(max_length=255)  # E.g., "My Resume 2024", "Cover Letter for X"
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(DocumentCategory, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='documents')

    # A flag to mark a specific CV as the 'current' one.
    # This will be specifically managed in the viewset.
    is_current = models.BooleanField(default=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-uploaded_at']  # Order by newest first

    def __str__(self):
        return self.name

    def get_download_url(self):
        """Returns the absolute URL for the document file."""
        # This uses MEDIA_URL defined in settings.py
        if self.file:
            return self.file.url
        return None
