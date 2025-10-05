# backend/photo_store/admin.py
from django.contrib import admin
from .models import Gallery, GalleryImage

# Define an inline for GalleryImage to be managed directly within Gallery admin
class GalleryImageInline(admin.TabularInline): # Or admin.StackedInline for a different layout
    model = GalleryImage
    extra = 1 # Number of empty forms to display
    fields = ('title', 'description', 'image') # Fields to show
    # raw_id_fields = ('gallery',) # Useful if many galleries, but not needed here due to inline

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description', 'created_at')
    prepopulated_fields = {'slug': ('name',)} # Auto-fill slug from name in admin
    search_fields = ('name', 'description', 'slug')
    inlines = [GalleryImageInline] # Add images inline

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'gallery', 'uploaded_at', 'image')
    list_filter = ('gallery',)
    search_fields = ('title', 'description')
    raw_id_fields = ('gallery',) # Useful for selecting gallery from a large list, uses a popup