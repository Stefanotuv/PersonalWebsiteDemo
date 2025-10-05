// frontend/src/pages/DocumentManagementPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../../context/AuthContext'; // To check if user is staff/admin
import * as cvApi from './documents_api'; // Import all functions from cv_api.ts
import { Document, DocumentCategory } from './documents_api'; // Import types

import { FaUpload, FaTrash, FaCheckCircle, FaEdit, FaTimesCircle, FaDownload, FaPlus } from 'react-icons/fa';

const DocumentManagementPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.is_staff;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for new document
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentDescription, setNewDocumentDescription] = useState('');
  const [newDocumentCategory, setNewDocumentCategory] = useState<number | ''>(''); // Stores category ID
  const [newDocumentIsCurrent, setNewDocumentIsCurrent] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states for new category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);


  const fetchDocumentsAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, catsRes] = await Promise.all([
        cvApi.getDocuments(),
        cvApi.getDocumentCategories()
      ]);
      setDocuments(docsRes.data);
      setCategories(catsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch documents or categories:", err.response?.data || err.message);
      setError("Failed to load documents or categories. Access denied or server error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) { // Only fetch if auth status is known
      if (isAdmin) {
        fetchDocumentsAndCategories();
      } else {
        setLoading(false);
        setError("You do not have permission to view this page.");
      }
    }
  }, [authLoading, isAdmin, fetchDocumentsAndCategories]); // Depend on auth state

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocumentFile || !newDocumentName || !newDocumentCategory) {
      setError("File, Name, and Category are required for upload.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', newDocumentFile);
    formData.append('name', newDocumentName);
    if (newDocumentDescription) formData.append('description', newDocumentDescription);
    formData.append('category', String(newDocumentCategory)); // API expects ID
    formData.append('is_current', String(newDocumentIsCurrent)); // Convert boolean to string

    try {
      await cvApi.uploadDocument(formData);
      setNewDocumentFile(null);
      setNewDocumentName('');
      setNewDocumentDescription('');
      setNewDocumentCategory('');
      setNewDocumentIsCurrent(false);
      await fetchDocumentsAndCategories(); // Refresh list
      alert("Document uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err.response?.data || err.message);
      setError("Failed to upload document. " + (err.response?.data?.file || err.response?.data?.name || err.response?.data?.detail || ""));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await cvApi.deleteDocument(docId);
        await fetchDocumentsAndCategories(); // Refresh list
      } catch (err: any) {
        console.error("Delete error:", err.response?.data || err.message);
        setError("Failed to delete document.");
      }
    }
  };

  const handleMarkCurrent = async (docId: number, categoryId: number) => {
    if (window.confirm("Are you sure you want to mark this as the current document for its category? This will unmark any other current documents in this category.")) {
      try {
        await cvApi.markDocumentCurrent(docId, categoryId);
        await fetchDocumentsAndCategories(); // Refresh list
        alert("Document marked as current!");
      } catch (err: any) {
        console.error("Mark current error:", err.response?.data || err.message);
        setError("Failed to mark document as current.");
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) {
      setError("Category name cannot be empty.");
      return;
    }
    setCreatingCategory(true);
    setError(null);
    try {
      await cvApi.createDocumentCategory(newCategoryName, newCategoryDescription);
      setNewCategoryName('');
      setNewCategoryDescription('');
      await fetchDocumentsAndCategories(); // Refresh categories
      alert("Category created successfully!");
    } catch (err: any) {
      console.error("Create category error:", err.response?.data || err.message);
      setError("Failed to create category. " + (err.response?.data?.name || err.response?.data?.detail || ""));
    } finally {
      setCreatingCategory(false);
    }
  };

  // Render permission denied if not admin
  if (!isAdmin && !authLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You must be an administrator to manage documents.</p>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <FaUpload className="animate-spin text-4xl mx-auto text-blue-600" />
        <p className="mt-4">Loading document management interface...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - Document Management</title>
        <meta name="description" content="Manage CVs and other documents for the personal website." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Management</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}







        {/* Upload New Document Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Document</h2>
          <form onSubmit={handleDocumentUpload} className="space-y-4">
            <div>
              <label htmlFor="document-file" className="block text-sm font-medium text-gray-700">File:</label>
              <input
                type="file"
                id="document-file"
                onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label htmlFor="document-name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                id="document-name"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="document-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
              <textarea
                id="document-description"
                value={newDocumentDescription}
                onChange={(e) => setNewDocumentDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
            <div>
              <label htmlFor="document-category" className="block text-sm font-medium text-gray-700">Category:</label>
              <select
                id="document-category"
                value={newDocumentCategory}
                onChange={(e) => setNewDocumentCategory(Number(e.target.value))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="document-is-current"
                checked={newDocumentIsCurrent}
                onChange={(e) => setNewDocumentIsCurrent(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="document-is-current" className="ml-2 block text-sm text-gray-900">Mark as Current (e.g., current CV)</label>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaUpload className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-600">No documents uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category_name || 'Uncategorized'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {doc.is_current ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {doc.download_url && (
                          <a href={doc.download_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">
                            <FaDownload className="inline-block" title="Download" />
                          </a>
                        )}
                        <button onClick={() => handleMarkCurrent(doc.id, doc.category!)} className="text-purple-600 hover:text-purple-900 mr-4" disabled={doc.is_current || !doc.category}>
                            <FaCheckCircle className="inline-block" title="Mark Current" />
                        </button>
                        <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                            <FaTrash className="inline-block" title="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create New Category Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Category</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Category Name:</label>
              <input
                type="text"
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
              <textarea
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={creatingCategory}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" /> {creatingCategory ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-600">No categories created yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map(cat => (
                <li key={cat.id} className="py-3 flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{cat.name}</span>
                  <div className="text-sm text-gray-600">
                    {cat.description && <span className="mr-2">{cat.description}</span>}
                    {/* Delete category is handled here (no edit for simplicity) */}
                    {/* <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-800 ml-2">
                        <FaTrash />
                    </button> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>


      </div>
    </>
  );
};

export default DocumentManagementPage;