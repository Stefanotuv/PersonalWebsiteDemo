// frontend/src/api/photos_api.ts
import api from '../../../api'; // Import your main API client instance (assuming src/api/api.ts)
import { AxiosResponse } from 'axios';

// --- Types for Photo Store ---
export interface Gallery {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  // images: GalleryImage[]; // If nested serializer is used, but often fetched separately
}

export interface GalleryImage {
  id: number;
  title: string | null;
  description: string | null;
  image: string; // File path on server (e.g., 'photos/gallery-slug/image.jpg')
  image_url: string; // Full URL from backend for display/download
  uploaded_at: string;
  gallery: number | null; // Gallery ID
  gallery_name?: string; // Populated by serializer
}

// --- API Functions for Photo Store ---

// Galleries
export const getGalleries = (): Promise<AxiosResponse<Gallery[]>> => {
  return api.get('/api/photos/galleries/');
};

export const getGalleryBySlug = (slug: string): Promise<AxiosResponse<Gallery>> => {
  return api.get(`/api/photos/galleries/${slug}/`); // Using lookup_field 'slug'
};

export const createGallery = (name: string, description?: string): Promise<AxiosResponse<Gallery>> => {
  return api.post('/api/photos/galleries/', { name, description });
};

export const updateGallery = (id: number, name?: string, description?: string): Promise<AxiosResponse<Gallery>> => {
  return api.patch(`/api/photos/galleries/${id}/`, { name, description });
};

export const deleteGallery = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/photos/galleries/${id}/`);
};

// Gallery Images
// Supports filtering by gallery_id, gallery_slug, or unassigned=true
export const getGalleryImages = (params?: { gallery_id?: number; gallery_slug?: string; unassigned?: boolean }): Promise<AxiosResponse<GalleryImage[]>> => {
  return api.get('/api/photos/images/', { params });
};

export const uploadGalleryImage = (formData: FormData): Promise<AxiosResponse<GalleryImage>> => {
  // FormData must be used for file uploads, axios instance handles 'Content-Type'
  return api.post('/api/photos/images/', formData);
};

export const updateGalleryImage = (id: number, formData: FormData): Promise<AxiosResponse<GalleryImage>> => {
  // Use PATCH for partial updates, especially when sending FormData for files
  return api.patch(`/api/photos/images/${id}/`, formData);
};

export const deleteGalleryImage = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/photos/images/${id}/`);
};


export const updateGallerySeparate = (galleryId: number, data: { name: string; description: string }) => {
  // This calls our new, dedicated URL
  return api.patch(`/api/photos/galleries/update/${galleryId}/`, data);
};