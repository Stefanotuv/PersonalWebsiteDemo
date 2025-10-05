import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // To check if user is staff/admin (from src/pages to src/contexts)
import * as photoApi from './photos_api'; // Import all functions from photos_api.ts (from src/pages to src/api)
import { Gallery, GalleryImage } from './photos_api'; // Import types
import { FaEdit, FaTrash, FaSave, FaTimes, FaImage } from 'react-icons/fa';

const GalleryManagementPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.is_staff;

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for in-line editing
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [editGalleryData, setEditGalleryData] = useState({ name: '', description: '' });

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const galleriesRes = await photoApi.getGalleries();
      setGalleries(galleriesRes.data);
    } catch (err: any) {
      console.error("Failed to fetch galleries:", err.response?.data || err.message);
      setError("Failed to load galleries. Access denied or server error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchGalleries();
    }
  }, [authLoading, isAdmin, fetchGalleries]);

  const handleEditClick = (gallery: Gallery) => {
    setEditingGalleryId(gallery.id);
    setEditGalleryData({ name: gallery.name, description: gallery.description || '' });
  };

  const handleCancelClick = () => {
    setEditingGalleryId(null);
  };

 const handleSaveClick = async (galleryId: number) => {
    if (!editGalleryData.name) {
      setError("Gallery name cannot be empty.");
      return;
    }
    try {
      // --- THIS IS THE ONLY CHANGE NEEDED IN THIS FILE ---
      // We are now calling the new, separate API function.
      await photoApi.updateGallerySeparate(galleryId, editGalleryData);

      setEditingGalleryId(null); // Exit editing mode
      await fetchGalleries(); // Refresh the list
    } catch (err: any) {
      setError("Failed to save gallery changes.");
    }
  };
  const handleDeleteClick = async (galleryId: number) => {
    if (window.confirm("Are you sure you want to delete this gallery? This will not delete the images inside it; they will become unassigned.")) {
      try {
        await photoApi.deleteGallery(galleryId);
        await fetchGalleries();
      } catch (err: any) {
        setError("Failed to delete gallery.");
      }
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You must be an administrator to manage galleries.</p>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <FaImage className="animate-spin text-4xl mx-auto text-blue-600" />
        <p className="mt-4">Loading galleries...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - Gallery Management</title>
      </Helmet>
      <div className="container mx-auto p-4 sm:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md my-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Galleries</h1>
            <Link to="/photos" className="text-sm text-blue-600 hover:underline">
              ← Back to Photo Management
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <ul className="divide-y divide-gray-200">
            {galleries.map(gal => (
              <li key={gal.id} className="py-4 px-2">
                {editingGalleryId === gal.id ? (
                  // --- EDITING VIEW ---
                  <div className="space-y-3">
                    <input type="text" value={editGalleryData.name} onChange={(e) => setEditGalleryData({...editGalleryData, name: e.target.value})} className="block w-full border border-blue-400 rounded-md p-2" />
                    <textarea value={editGalleryData.description} onChange={(e) => setEditGalleryData({...editGalleryData, description: e.target.value})} className="block w-full border border-gray-300 rounded-md p-2" rows={2}></textarea>
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={handleCancelClick} className="text-gray-500 hover:text-gray-800 p-2" title="Cancel"><FaTimes /></button>
                      <button onClick={() => handleSaveClick(gal.id)} className="text-green-600 hover:text-green-800 p-2" title="Save"><FaSave /></button>
                    </div>
                  </div>
                ) : (
                  // --- DISPLAY VIEW ---
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{gal.name} <span className="text-sm text-gray-500">({gal.slug})</span></p>
                      <p className="text-sm text-gray-600">{gal.description || <i>No description</i>}</p>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <button onClick={() => handleEditClick(gal)} className="text-blue-600 hover:text-blue-900" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDeleteClick(gal.id)} className="text-red-600 hover:text-red-900" title="Delete"><FaTrash /></button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default GalleryManagementPage;