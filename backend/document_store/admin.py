# backend/document_store/admin.py
from django.contrib import admin
from .models import Document, DocumentCategory


@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_current', 'uploaded_at')
    list_filter = ('category', 'is_current')
    search_fields = ('name', 'description')

    # Use raw_id_fields for category if you expect many categories
    # raw_id_fields = ('category',)

    # Custom form to ensure only one 'is_current' per category
    # This logic is also handled in viewsets, but good to have in admin too.
    def save_model(self, request, obj, form, change):
        if obj.is_current and obj.category:
            # Set other documents in the same category to not be current
            Document.objects.filter(category=obj.category).exclude(pk=obj.pk).update(is_current=False)
        super().save_model(request, obj, form, change)
