# backend/photo_store/models.py
from django.db import models
from django.utils.text import slugify # For generating slugs
import os # For os.remove in delete method

# Gallery Model (The Container)
class Gallery(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True, help_text="URL-friendly identifier, auto-generated if blank.")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Gallery"
        verbose_name_plural = "Galleries"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-generate slug if it's empty or hasn't changed from old name
        if not self.slug:
            self.slug = slugify(self.name)
        # Ensure slug uniqueness when creating, or if name changes.
        # This basic slugify might not handle all conflicts perfectly,
        # but it's a start. More robust slug generation uses a loop.
        super().save(*args, **kwargs)

# Helper function for image upload path
def gallery_image_path(instance, filename):
    # Files will be uploaded to MEDIA_ROOT/photos/{gallery_slug}/
    # Or MEDIA_ROOT/photos/unassigned/ if not linked to a gallery
    gallery_folder = slugify(instance.gallery.name) if instance.gallery else 'unassigned'
    return f'photos/{gallery_folder}/{filename}'

# GalleryImage Model
class GalleryImage(models.Model):
    title = models.CharField(max_length=150, blank=True, help_text="Optional title for the image.")
    description = models.TextField(blank=True, help_text="Optional description for the image.")
    image = models.ImageField(upload_to=gallery_image_path) # Uses the helper function
    uploaded_at = models.DateTimeField(auto_now_add=True)

    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.SET_NULL, # Keep image if gallery is deleted, just unassign it
        null=True, # Allows images not assigned to any gallery
        blank=True, # Allows creating image without gallery in forms/admin
        related_name='images', # How to access images from a gallery instance (gallery.images.all())
        help_text="The gallery this image belongs to (optional)."
    )

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"

    def __str__(self):
        gallery_name = f" ({self.gallery.name})" if self.gallery else " (Unassigned)"
        return (self.title or f"Image {self.id}") + gallery_name

    # Delete method to remove file from storage when object is deleted
    def delete(self, *args, **kwargs):
        if self.image and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        super().delete(*args, **kwargs)
