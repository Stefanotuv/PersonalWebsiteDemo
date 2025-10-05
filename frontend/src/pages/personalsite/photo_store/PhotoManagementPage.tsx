// // frontend/src/pages/PhotoManagementPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from '../../../context/AuthContext'; // To check if user is staff/admin (from src/pages to src/contexts)
// import * as photoApi from './photos_api'; // Import all functions from photos_api.ts (from src/pages to src/api)
// import { Gallery, GalleryImage } from './photos_api'; // Import types
//
// import { FaUpload, FaTrash, FaPlus, FaImage, FaEdit } from 'react-icons/fa';
//
// const PhotoManagementPage: React.FC = () => {
//   const { user, isAuthenticated, isLoading: authLoading } = useAuth();
//   const isAdmin = isAuthenticated && user?.is_staff;
//
//   const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
//   const [galleries, setGalleries] = useState<Gallery[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   // Form states for new image
//   const [newImageFile, setNewImageFile] = useState<File | null>(null);
//   const [newImageTitle, setNewImageTitle] = useState('');
//   const [newImageDescription, setNewImageDescription] = useState('');
//   const [newImageGalleryId, setNewImageGalleryId] = useState<number | ''>(''); // Stores gallery ID
//   const [uploadingImage, setUploadingImage] = useState(false);
//
//   // Form states for new gallery
//   const [newGalleryName, setNewGalleryName] = useState('');
//   const [newGalleryDescription, setNewGalleryDescription] = useState('');
//   const [creatingGallery, setCreatingGallery] = useState(false);
//
//
//   const fetchImagesAndGalleries = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [imagesRes, galleriesRes] = await Promise.all([
//         photoApi.getGalleryImages(),
//         photoApi.getGalleries()
//       ]);
//       setGalleryImages(imagesRes.data);
//       setGalleries(galleriesRes.data);
//     } catch (err: any) {
//       console.error("Failed to fetch images or galleries:", err.response?.data || err.message);
//       setError("Failed to load images or galleries. Access denied or server error.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   useEffect(() => {
//     if (!authLoading) { // Only fetch if auth status is known
//       if (isAdmin) {
//         fetchImagesAndGalleries();
//       } else {
//         setLoading(false);
//         setError("You do not have permission to view this page.");
//       }
//     }
//   }, [authLoading, isAdmin, fetchImagesAndGalleries]);
//
//   const handleImageUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newImageFile || !newImageTitle) {
//       setError("File and Title are required for image upload.");
//       return;
//     }
//     setUploadingImage(true);
//     setError(null);
//
//     const formData = new FormData();
//     formData.append('image', newImageFile); // 'image' field for the file
//     formData.append('title', newImageTitle);
//     if (newImageDescription) formData.append('description', newImageDescription);
//     if (newImageGalleryId) formData.append('gallery', String(newImageGalleryId)); // API expects gallery ID
//
//     try {
//       await photoApi.uploadGalleryImage(formData);
//       setNewImageFile(null);
//       setNewImageTitle('');
//       setNewImageDescription('');
//       setNewImageGalleryId('');
//       await fetchImagesAndGalleries(); // Refresh list
//       alert("Image uploaded successfully!");
//     } catch (err: any) {
//       console.error("Upload error:", err.response?.data || err.message);
//       setError("Failed to upload image. " + (err.response?.data?.image || err.response?.data?.title || err.response?.data?.detail || ""));
//     } finally {
//       setUploadingImage(false);
//     }
//   };
//
//   const handleDeleteImage = async (imageId: number) => {
//     if (window.confirm("Are you sure you want to delete this image?")) {
//       try {
//         await photoApi.deleteGalleryImage(imageId);
//         await fetchImagesAndGalleries(); // Refresh list
//       } catch (err: any) {
//         console.error("Delete error:", err.response?.data || err.message);
//         setError("Failed to delete image.");
//       }
//     }
//   };
//
//   const handleCreateGallery = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newGalleryName) {
//       setError("Gallery name cannot be empty.");
//       return;
//     }
//     setCreatingGallery(true);
//     setError(null);
//     try {
//       await photoApi.createGallery(newGalleryName, newGalleryDescription);
//       setNewGalleryName('');
//       setNewGalleryDescription('');
//       await fetchImagesAndGalleries(); // Refresh galleries
//       alert("Gallery created successfully!");
//     } catch (err: any) {
//       console.error("Create gallery error:", err.response?.data || err.message);
//       setError("Failed to create gallery. " + (err.response?.data?.name || err.response?.data?.detail || ""));
//     } finally {
//       setCreatingGallery(false);
//     }
//   };
//
//   // Render permission denied if not admin
//   if (!isAdmin && !authLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center text-red-600">
//         <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
//         <p>You must be an administrator to manage photos and galleries.</p>
//       </div>
//     );
//   }
//
//   if (loading || authLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center">
//         <FaImage className="animate-spin text-4xl mx-auto text-blue-600" />
//         <p className="mt-4">Loading photo management interface...</p>
//       </div>
//     );
//   }
//
//   return (
//     <>
//       <Helmet>
//         <title>Admin - Photo & Gallery Management</title>
//         <meta name="description" content="Manage images and galleries for the personal website." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Photo & Gallery Management</h1>
//
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
//             <p className="font-bold">Error:</p>
//             <p>{error}</p>
//           </div>
//         )}
//
//         {/* Upload New Image Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Image</h2>
//           <form onSubmit={handleImageUpload} className="space-y-4">
//             <div>
//               <label htmlFor="image-file" className="block text-sm font-medium text-gray-700">Image File:</label>
//               <input
//                 type="file"
//                 id="image-file"
//                 accept="image/*" // Restrict to image files
//                 onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)}
//                 required
//                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>
//             <div>
//               <label htmlFor="image-title" className="block text-sm font-medium text-gray-700">Title:</label>
//               <input
//                 type="text"
//                 id="image-title"
//                 value={newImageTitle}
//                 onChange={(e) => setNewImageTitle(e.target.value)}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="image-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
//               <textarea
//                 id="image-description"
//                 value={newImageDescription}
//                 onChange={(e) => setNewImageDescription(e.target.value)}
//                 rows={3}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="image-gallery" className="block text-sm font-medium text-gray-700">Gallery (Optional):</label>
//               <select
//                 id="image-gallery"
//                 value={newImageGalleryId}
//                 onChange={(e) => setNewImageGalleryId(Number(e.target.value))}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
//               >
//                 <option value="">No Gallery</option>
//                 {galleries.map(gal => (
//                   <option key={gal.id} value={gal.id}>{gal.name}</option>
//                 ))}
//               </select>
//             </div>
//             <button
//               type="submit"
//               disabled={uploadingImage}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <FaUpload className="mr-2" /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
//             </button>
//           </form>
//         </div>
//
//         {/* Create New Gallery Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Gallery</h2>
//           <form onSubmit={handleCreateGallery} className="space-y-4">
//             <div>
//               <label htmlFor="gallery-name" className="block text-sm font-medium text-gray-700">Gallery Name:</label>
//               <input
//                 type="text"
//                 id="gallery-name"
//                 value={newGalleryName}
//                 onChange={(e) => setNewGalleryName(e.target.value)}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="gallery-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
//               <textarea
//                 id="gallery-description"
//                 value={newGalleryDescription}
//                 onChange={(e) => setNewGalleryDescription(e.target.value)}
//                 rows={2}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               disabled={creatingGallery}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <FaPlus className="mr-2" /> {creatingGallery ? 'Creating...' : 'Create Gallery'}
//             </button>
//           </form>
//         </div>
//
//         {/* Existing Galleries List */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Galleries</h2>
//           {galleries.length === 0 ? (
//             <p className="text-gray-600">No galleries created yet.</p>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {galleries.map(gal => (
//                 <li key={gal.id} className="py-3 flex justify-between items-center">
//                   <span className="text-gray-900 font-medium">{gal.name} ({gal.slug})</span>
//                   <div className="text-sm text-gray-600">
//                     {gal.description && <span className="mr-2">{gal.description}</span>}
//                     {/* <button onClick={() => handleDeleteGallery(gal.id)} className="text-red-600 hover:text-red-800 ml-2">
//                         <FaTrash />
//                     </button> */}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//
//
//         {/* Images List */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Images</h2>
//           {galleryImages.length === 0 ? (
//             <p className="text-gray-600">No images uploaded yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {galleryImages.map(img => (
//                     <tr key={img.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {img.image_url && <img src={img.image_url} alt={img.title || "Image"} className="h-12 w-12 object-cover rounded-md" />}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{img.title || 'No Title'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.gallery_name || 'Unassigned'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(img.uploaded_at).toLocaleDateString()}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         {img.image_url && (
//                             <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">
//                                 <FaDownload className="inline-block" title="Download Image" />
//                             </a>
//                         )}
//                         {/* No 'Mark Current' for images in this model */}
//                         <button onClick={() => handleDeleteImage(img.id)} className="text-red-600 hover:text-red-900">
//                             <FaTrash className="inline-block" title="Delete Image" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default PhotoManagementPage;

// frontend/src/pages/PhotoManagementPage.tsx - MODIFIED FOR MULTIPLE IMAGE UPLOAD
// import React, { useState, useEffect, useCallback } from 'react';
// import { Helmet } from 'react-helmet-async';
//
// import { useAuth } from '../../../context/AuthContext'; // To check if user is staff/admin (from src/pages to src/contexts)
// import * as photoApi from './photos_api'; // Import all functions from photos_api.ts (from src/pages to src/api)
// import { Gallery, GalleryImage } from './photos_api'; // Import types
//
//
// import { FaUpload, FaTrash, FaPlus, FaImage, FaEdit, FaCheckCircle, FaTimesCircle, FaDownload } from 'react-icons/fa'; // Ensure all icons are imported
//
// const PhotoManagementPage: React.FC = () => {
//   const { user, isAuthenticated, isLoading: authLoading } = useAuth();
//   const isAdmin = isAuthenticated && user?.is_staff;
//
//   const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
//   const [galleries, setGalleries] = useState<Gallery[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   // Form states for new image (now an array for multiple files)
//   const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null); // Use FileList for multiple
//   const [newImageTitle, setNewImageTitle] = useState('');
//   const [newImageDescription, setNewImageDescription] = useState('');
//   const [newImageGalleryId, setNewImageGalleryId] = useState<number | ''>(''); // All uploaded images go to this gallery
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0); // For multiple file progress
//
//   // Form states for new gallery
//   const [newGalleryName, setNewGalleryName] = useState('');
//   const [newGalleryDescription, setNewGalleryDescription] = useState('');
//   const [creatingGallery, setCreatingGallery] = useState(false);
//
//
//   const fetchImagesAndGalleries = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [imagesRes, galleriesRes] = await Promise.all([
//         photoApi.getGalleryImages(),
//         photoApi.getGalleries()
//       ]);
//       setGalleryImages(imagesRes.data);
//       setGalleries(galleriesRes.data);
//     } catch (err: any) {
//       console.error("Failed to fetch images or galleries:", err.response?.data || err.message);
//       setError("Failed to load images or galleries. Access denied or server error.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   useEffect(() => {
//     if (!authLoading) {
//       if (isAdmin) {
//         fetchImagesAndGalleries();
//       } else {
//         setLoading(false);
//         setError("You do not have permission to view this page.");
//       }
//     }
//   }, [authLoading, isAdmin, fetchImagesAndGalleries]);
//
//   const handleImageUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newImageFiles || newImageFiles.length === 0 || !newImageTitle) {
//       setError("At least one File and a Title are required for image upload.");
//       return;
//     }
//     // Gallery selection is now optional, so allow empty string
//     // if (!newImageGalleryId) {
//     //   setError("A Gallery must be selected for multiple uploads.");
//     //   return;
//     // }
//
//     setUploadingImage(true);
//     setUploadProgress(0);
//     setError(null);
//
//     const filesToUpload = Array.from(newImageFiles);
//     let successfulUploads = 0;
//     let failedUploads = 0;
//
//     for (let i = 0; i < filesToUpload.length; i++) {
//         const file = filesToUpload[i];
//         const formData = new FormData();
//         formData.append('image', file); // 'image' field for the file
//         formData.append('title', `${newImageTitle} - ${file.name}`); // Add filename to title for uniqueness/clarity
//         if (newImageDescription) formData.append('description', newImageDescription);
//         if (newImageGalleryId) formData.append('gallery', String(newImageGalleryId)); // All go to the same gallery
//
//         try {
//             await photoApi.uploadGalleryImage(formData);
//             successfulUploads++;
//             setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
//         } catch (err: any) {
//             console.error(`Upload error for ${file.name}:`, err.response?.data || err.message);
//             failedUploads++;
//             // Aggregate errors if desired, or just show a general failure
//             setError(prev => (prev ? prev + `\nFailed to upload ${file.name}.` : `Failed to upload ${file.name}.`));
//         }
//     }
//
//     setNewImageFiles(null); // Clear input
//     setNewImageTitle('');
//     setNewImageDescription('');
//     setNewImageGalleryId(''); // Clear selected gallery
//     await fetchImagesAndGalleries(); // Refresh list
//
//     if (failedUploads === 0) {
//         alert(`Successfully uploaded ${successfulUploads} image(s)!`);
//     } else {
//         alert(`Finished uploading. ${successfulUploads} succeeded, ${failedUploads} failed. Check errors.`);
//     }
//
//     setUploadingImage(false);
//     setUploadProgress(0);
//   };
//
//   const handleDeleteImage = async (imageId: number) => {
//     if (window.confirm("Are you sure you want to delete this image?")) {
//       try {
//         await photoApi.deleteGalleryImage(imageId);
//         await fetchImagesAndGalleries(); // Refresh list
//       } catch (err: any) {
//         console.error("Delete error:", err.response?.data || err.message);
//         setError("Failed to delete image.");
//       }
//     }
//   };
//
//   const handleCreateGallery = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newGalleryName) {
//       setError("Gallery name cannot be empty.");
//       return;
//     }
//     setCreatingGallery(true);
//     setError(null);
//     try {
//       await photoApi.createGallery(newGalleryName, newGalleryDescription);
//       setNewGalleryName('');
//       setNewGalleryDescription('');
//       await fetchImagesAndGalleries(); // Refresh galleries
//       alert("Gallery created successfully!");
//     } catch (err: any) {
//       console.error("Create gallery error:", err.response?.data || err.message);
//       setError("Failed to create gallery. " + (err.response?.data?.name || err.response?.data?.detail || ""));
//     } finally {
//       setCreatingGallery(false);
//     }
//   };
//
//   // Render permission denied if not admin
//   if (!isAdmin && !authLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center text-red-600">
//         <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
//         <p>You must be an administrator to manage photos and galleries.</p>
//       </div>
//     );
//   }
//
//   if (loading || authLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center">
//         <FaImage className="animate-spin text-4xl mx-auto text-blue-600" />
//         <p className="mt-4">Loading photo management interface...</p>
//       </div>
//     );
//   }
//
//   return (
//     <>
//       <Helmet>
//         <title>Admin - Photo & Gallery Management</title>
//         <meta name="description" content="Manage images and galleries for the personal website." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Photo & Gallery Management</h1>
//
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
//             <p className="font-bold">Error:</p>
//             <p className="whitespace-pre-wrap">{error}</p> {/* Use pre-wrap for multiline errors */}
//           </div>
//         )}
//
//         {/* Upload New Image Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Image(s)</h2>
//           <form onSubmit={handleImageUpload} className="space-y-4">
//             <div>
//               <label htmlFor="image-file" className="block text-sm font-medium text-gray-700">Image File(s):</label>
//               <input
//                 type="file"
//                 id="image-file"
//                 accept="image/*"
//                 multiple // <--- CRUCIAL: Allow multiple file selection
//                 onChange={(e) => setNewImageFiles(e.target.files)}
//                 required
//                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>
//             <div>
//               <label htmlFor="image-title" className="block text-sm font-medium text-gray-700">Base Title (e.g., "Family Photos", filename will be appended):</label>
//               <input
//                 type="text"
//                 id="image-title"
//                 value={newImageTitle}
//                 onChange={(e) => setNewImageTitle(e.target.value)}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="image-description" className="block text-sm font-medium text-gray-700">Description (Optional, applies to all):</label>
//               <textarea
//                 id="image-description"
//                 value={newImageDescription}
//                 onChange={(e) => setNewImageDescription(e.target.value)}
//                 rows={3}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="image-gallery" className="block text-sm font-medium text-gray-700">Gallery (Optional, applies to all):</label>
//               <select
//                 id="image-gallery"
//                 value={newImageGalleryId}
//                 onChange={(e) => setNewImageGalleryId(Number(e.target.value))}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
//               >
//                 <option value="">No Gallery</option>
//                 {galleries.map(gal => (
//                   <option key={gal.id} value={gal.id}>{gal.name}</option>
//                 ))}
//               </select>
//             </div>
//             <button
//               type="submit"
//               disabled={uploadingImage}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <FaUpload className="mr-2" /> {uploadingImage ? `Uploading... (${uploadProgress}%)` : `Upload Image(s)`}
//             </button>
//             {uploadingImage && <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div></div>}
//           </form>
//         </div>
//
//         {/* Create New Gallery Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Gallery</h2>
//
//           <form onSubmit={handleCreateGallery} className="space-y-4">
//             <div>
//               <label htmlFor="gallery-name" className="block text-sm font-medium text-gray-700">Gallery Name:</label>
//               <h2 className="text-xl font-semibold text-orange-400 mb-4"> create page-logos or add to gallery page-logos to add picture to the front page</h2>
//               <input
//                 type="text"
//                 id="gallery-name"
//                 value={newGalleryName}
//                 onChange={(e) => setNewGalleryName(e.target.value)}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="gallery-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
//               <textarea
//                 id="gallery-description"
//                 value={newGalleryDescription}
//                 onChange={(e) => setNewGalleryDescription(e.target.value)}
//                 rows={2}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               disabled={creatingGallery}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <FaPlus className="mr-2" /> {creatingGallery ? 'Creating...' : 'Create Gallery'}
//             </button>
//           </form>
//         </div>
//
//         {/* Existing Galleries List */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Galleries</h2>
//           {galleries.length === 0 ? (
//             <p className="text-gray-600">No galleries created yet.</p>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {galleries.map(gal => (
//                 <li key={gal.id} className="py-3 flex justify-between items-center">
//                   <span className="text-gray-900 font-medium">{gal.name} ({gal.slug})</span>
//                   <div className="text-sm text-gray-600">
//                     {gal.description && <span className="mr-2">{gal.description}</span>}
//                     {/* Placeholder for Edit/Delete Category buttons if needed */}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//
//
//         {/* Images List */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Images</h2>
//           {galleryImages.length === 0 ? (
//             <p className="text-gray-600">No images uploaded yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {galleryImages.map(img => (
//                     <tr key={img.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {img.image_url && <img src={img.image_url} alt={img.title || "Image"} className="h-12 w-12 object-cover rounded-md" />}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{img.title || 'No Title'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.gallery_name || 'Unassigned'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(img.uploaded_at).toLocaleDateString()}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         {img.image_url && (
//                             <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">
//                                 <FaDownload className="inline-block" title="Download Image" />
//                             </a>
//                         )}
//                         <button onClick={() => handleDeleteImage(img.id)} className="text-red-600 hover:text-red-900">
//                             <FaTrash className="inline-block" title="Delete Image" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default PhotoManagementPage;

// frontend/src/pages/PhotoManagementPage.tsx - MODIFIED WITH EDIT MODAL ONLY
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // To check if user is staff/admin (from src/pages to src/contexts)
import * as photoApi from './photos_api'; // Import all functions from photos_api.ts (from src/pages to src/api)
import { Gallery, GalleryImage } from './photos_api'; // Import types

// --- NO CHANGE TO IMPORTS, ADDED NEW ICONS TO EXISTING LINE ---
import { FaUpload, FaTrash, FaPlus, FaImage, FaEdit, FaCheckCircle, FaTimesCircle, FaDownload, FaSave, FaWindowClose } from 'react-icons/fa';

// ===================================================================================
// --- NEW: Edit Image Modal Component ---
// This component handles the popup for editing an image.
// ===================================================================================
interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageId: number, formData: FormData) => Promise<void>;
  image: GalleryImage | null;
  galleries: Gallery[];
}

const EditImageModal: React.FC<EditImageModalProps> = ({ isOpen, onClose, onSave, image, galleries }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [galleryId, setGalleryId] = useState<number | ''>('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // When the modal opens or the image prop changes, populate the form
  useEffect(() => {
    if (image) {
      setTitle(image.title || '');
      setDescription(image.description || '');
      setGalleryId(image.gallery || '');
      setNewImageFile(null); // Reset file input on open
    }
  }, [image]);

  if (!isOpen || !image) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('gallery', galleryId ? String(galleryId) : ''); // Send empty string to unassign
    if (newImageFile) {
      formData.append('image', newImageFile);
    }
    await onSave(image.id, formData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Image</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaWindowClose size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-center mb-4">
                <img src={image.image_url} alt="Current" className="h-32 w-auto object-cover rounded-md mx-auto shadow-md" />
                <p className="text-xs text-gray-500 mt-1">Current Image</p>
            </div>
          <div>
            <label htmlFor="edit-image-file" className="block text-sm font-medium text-gray-700">Replace Image (Optional):</label>
            <input type="file" id="edit-image-file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title:</label>
            <input type="text" id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>
          <div>
            <label htmlFor="edit-gallery" className="block text-sm font-medium text-gray-700">Gallery:</label>
            <select id="edit-gallery" value={galleryId} onChange={(e) => setGalleryId(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
              <option value="">No Gallery (Unassigned)</option>
              {galleries.map(gal => <option key={gal.id} value={gal.id}>{gal.name}</option>)}
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FaSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ===================================================================================
// --- Main Page Component ---
// ===================================================================================
const PhotoManagementPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.is_staff;

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for new image (now an array for multiple files)
  const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');
  const [newImageGalleryId, setNewImageGalleryId] = useState<number | ''>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states for new gallery
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');
  const [creatingGallery, setCreatingGallery] = useState(false);

  // --- NEW: State for the edit modal ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);


  const fetchImagesAndGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [imagesRes, galleriesRes] = await Promise.all([
        photoApi.getGalleryImages(),
        photoApi.getGalleries()
      ]);
      setGalleryImages(imagesRes.data);
      setGalleries(galleriesRes.data);
    } catch (err: any) {
      console.error("Failed to fetch images or galleries:", err.response?.data || err.message);
      setError("Failed to load images or galleries. Access denied or server error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (isAdmin) {
        fetchImagesAndGalleries();
      } else {
        setLoading(false);
        setError("You do not have permission to view this page.");
      }
    }
  }, [authLoading, isAdmin, fetchImagesAndGalleries]);

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFiles || newImageFiles.length === 0 || !newImageTitle) {
      setError("At least one File and a Title are required for image upload.");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError(null);

    const filesToUpload = Array.from(newImageFiles);
    let successfulUploads = 0;
    let failedUploads = 0;

    for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', `${newImageTitle} - ${file.name}`);
        if (newImageDescription) formData.append('description', newImageDescription);
        if (newImageGalleryId) formData.append('gallery', String(newImageGalleryId));

        try {
            await photoApi.uploadGalleryImage(formData);
            successfulUploads++;
            setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
        } catch (err: any) {
            console.error(`Upload error for ${file.name}:`, err.response?.data || err.message);
            failedUploads++;
            setError(prev => (prev ? prev + `\nFailed to upload ${file.name}.` : `Failed to upload ${file.name}.`));
        }
    }

    setNewImageFiles(null);
    setNewImageTitle('');
    setNewImageDescription('');
    setNewImageGalleryId('');
    await fetchImagesAndGalleries();

    if (failedUploads === 0) {
        alert(`Successfully uploaded ${successfulUploads} image(s)!`);
    } else {
        alert(`Finished uploading. ${successfulUploads} succeeded, ${failedUploads} failed. Check errors.`);
    }

    setUploadingImage(false);
    setUploadProgress(0);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await photoApi.deleteGalleryImage(imageId);
        await fetchImagesAndGalleries();
      } catch (err: any) {
        console.error("Delete error:", err.response?.data || err.message);
        setError("Failed to delete image.");
      }
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryName) {
      setError("Gallery name cannot be empty.");
      return;
    }
    setCreatingGallery(true);
    setError(null);
    try {
      await photoApi.createGallery(newGalleryName, newGalleryDescription);
      setNewGalleryName('');
      setNewGalleryDescription('');
      await fetchImagesAndGalleries();
      alert("Gallery created successfully!");
    } catch (err: any) {
      console.error("Create gallery error:", err.response?.data || err.message);
      setError("Failed to create gallery. " + (err.response?.data?.name || err.response?.data?.detail || ""));
    } finally {
      setCreatingGallery(false);
    }
  };

  // --- NEW: Handlers for the edit modal ---
  const handleOpenEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };

  const handleUpdateImage = async (imageId: number, formData: FormData) => {
    setError(null);
    try {
      await photoApi.updateGalleryImage(imageId, formData);
      await fetchImagesAndGalleries(); // Refresh the list
      handleCloseEditModal(); // Close the modal on success
      alert("Image updated successfully!");
    } catch (err: any) {
      console.error("Update image error:", err.response?.data || err.message);
      // We can display the error inside the modal in a future enhancement
      alert("Failed to update image. Check console for details.");
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You must be an administrator to manage photos and galleries.</p>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <FaImage className="animate-spin text-4xl mx-auto text-blue-600" />
        <p className="mt-4">Loading photo management interface...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - Photo & Gallery Management</title>
        <meta name="description" content="Manage images and galleries for the personal website." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Photo & Gallery Management</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error:</p>
            <p className="whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {/* Upload New Image Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Image(s)</h2>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div>
              <label htmlFor="image-file" className="block text-sm font-medium text-gray-700">Image File(s):</label>
              <input type="file" id="image-file" accept="image/*" multiple required onChange={(e) => setNewImageFiles(e.target.files)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label htmlFor="image-title" className="block text-sm font-medium text-gray-700">Base Title (e.g., "Family Photos", filename will be appended):</label>
              <input type="text" id="image-title" value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="image-description" className="block text-sm font-medium text-gray-700">Description (Optional, applies to all):</label>
              <textarea id="image-description" value={newImageDescription} onChange={(e) => setNewImageDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div>
              <label htmlFor="image-gallery" className="block text-sm font-medium text-gray-700">Gallery (Optional, applies to all):</label>
              <select id="image-gallery" value={newImageGalleryId} onChange={(e) => setNewImageGalleryId(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                <option value="">No Gallery</option>
                {galleries.map(gal => (<option key={gal.id} value={gal.id}>{gal.name}</option>))}
              </select>
            </div>
            <button type="submit" disabled={uploadingImage} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <FaUpload className="mr-2" /> {uploadingImage ? `Uploading... (${uploadProgress}%)` : `Upload Image(s)`}
            </button>
            {uploadingImage && <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div></div>}
          </form>
        </div>

        {/* Create New Gallery Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Gallery</h2>
          <form onSubmit={handleCreateGallery} className="space-y-4">
            <div>
              <label htmlFor="gallery-name" className="block text-sm font-medium text-gray-700">Gallery Name:</label>
              <h2 className="text-sm font-semibold text-orange-400 mb-4"> (create page-logos or add to gallery page-logos to add pictures to the front page)</h2>
              <input type="text" id="gallery-name" value={newGalleryName} onChange={(e) => setNewGalleryName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="gallery-description" className="block text-sm font-medium text-gray-700">Description (Optional):</label>
              <textarea id="gallery-description" value={newGalleryDescription} onChange={(e) => setNewGalleryDescription(e.target.value)} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <button type="submit" disabled={creatingGallery} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaPlus className="mr-2" /> {creatingGallery ? 'Creating...' : 'Create Gallery'}
            </button>
          </form>
        </div>

        {/*/!* Existing Galleries List - NO CHANGES HERE *!/*/}
        {/*<div className="bg-white p-6 rounded-lg shadow-md mb-8">*/}
        {/*  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Galleries</h2>*/}
        {/*  {galleries.length === 0 ? (*/}
        {/*    <p className="text-gray-600">No galleries created yet.</p>*/}
        {/*  ) : (*/}
        {/*    <ul className="divide-y divide-gray-200">*/}
        {/*      {galleries.map(gal => (*/}
        {/*        <li key={gal.id} className="py-3 flex justify-between items-center">*/}
        {/*          <span className="text-gray-900 font-medium">{gal.name} ({gal.slug})</span>*/}
        {/*          <div className="text-sm text-gray-600">*/}
        {/*            {gal.description && <span className="mr-2">{gal.description}</span>}*/}
        {/*            /!* Placeholder for Edit/Delete Category buttons if needed *!/*/}
        {/*          </div>*/}
        {/*        </li>*/}
        {/*      ))}*/}
        {/*    </ul>*/}
        {/*  )}*/}
        {/*</div>*/}

        {/* Existing Galleries List */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* MODIFIED HEADER TO INCLUDE THE BUTTON */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Existing Galleries</h2>
            <Link
              to="/galleries"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              Manage Galleries
            </Link>
          </div>

          {/* THE REST OF THIS SECTION IS UNCHANGED */}
          {galleries.length === 0 ? (
            <p className="text-gray-600">No galleries created yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {galleries.map(gal => (
                <li key={gal.id} className="py-3 flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{gal.name} ({gal.slug})</span>
                  <div className="text-sm text-gray-600">
                    {gal.description && <span className="mr-2">{gal.description}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>


        {/* Images List - MODIFIED TO ADD EDIT BUTTON */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Images</h2>
          {galleryImages.length === 0 ? (
            <p className="text-gray-600">No images uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {galleryImages.map(img => (
                    <tr key={img.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {img.image_url && <img src={img.image_url} alt={img.title || "Image"} className="h-12 w-12 object-cover rounded-md" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{img.title || 'No Title'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.gallery_name || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(img.uploaded_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* --- NEW EDIT BUTTON --- */}
                        <button onClick={() => handleOpenEditModal(img)} className="text-blue-600 hover:text-blue-900 mr-4">
                            <FaEdit className="inline-block" title="Edit Image" />
                        </button>
                        {img.image_url && (
                            <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900 mr-4">
                                <FaDownload className="inline-block" title="Download Image" />
                            </a>
                        )}
                        <button onClick={() => handleDeleteImage(img.id)} className="text-red-600 hover:text-red-900">
                            <FaTrash className="inline-block" title="Delete Image" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- NEW: Render the modal conditionally --- */}
      {isEditModalOpen && (
        <EditImageModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            image={editingImage}
            galleries={galleries}
            onSave={handleUpdateImage}
        />
      )}
    </>
  );
};

export default PhotoManagementPage;