// frontend/src/api/documents_api.ts
import api from '../../../api'; // Import your main API client instance
import { AxiosResponse } from 'axios';

// --- Types for Document Store ---
export interface DocumentCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface Document {
  id: number;
  file: string; // URL to the file
  name: string;
  description: string | null;
  category: number | null; // Category ID
  category_name?: string; // Populated by serializer
  is_current: boolean;
  uploaded_at: string;
  updated_at: string;
  download_url?: string; // Full downloadable URL from backend
}

// --- API Functions for Document Store ---

// Categories
export const getDocumentCategories = (): Promise<AxiosResponse<DocumentCategory[]>> => {
  return api.get('/api/documents/categories/');
};

export const createDocumentCategory = (name: string, description?: string): Promise<AxiosResponse<DocumentCategory>> => {
  return api.post('/api/documents/categories/', { name, description });
};

export const updateDocumentCategory = (id: number, name: string, description?: string): Promise<AxiosResponse<DocumentCategory>> => {
  return api.patch(`/api/documents/categories/${id}/`, { name, description });
};

export const deleteDocumentCategory = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/documents/categories/${id}/`);
};

// Documents
export const getDocuments = (): Promise<AxiosResponse<Document[]>> => {
  return api.get('/api/documents/documents/');
};

export const uploadDocument = (formData: FormData): Promise<AxiosResponse<Document>> => {
  // FormData must be used for file uploads, ensure 'Content-Type' is handled by axios instance (which it is)
  return api.post('/api/documents/documents/', formData);
};

export const updateDocument = (id: number, formData: FormData): Promise<AxiosResponse<Document>> => {
  // Use PATCH for partial updates, especially when sending FormData for files
  return api.patch(`/api/documents/documents/${id}/`, formData);
};

export const deleteDocument = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/documents/documents/${id}/`);
};

export const markDocumentCurrent = (id: number, categoryId: number): Promise<AxiosResponse<Document>> => {
  // This is a specific action to set one document as current for its category.
  // The backend viewset handles setting others to false.
  return api.patch(`/api/documents/documents/${id}/`, { is_current: true, category: categoryId });
};

export const getCurrentCV = (): Promise<AxiosResponse<Document>> => {
  // Publicly accessible endpoint for the current CV
  return api.get('/api/documents/documents/current_cv/');
};

// Add other specific document-related API calls as needed