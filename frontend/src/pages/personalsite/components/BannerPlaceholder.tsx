// // frontend/src/components/layout/BannerPlaceholder.tsx
// import React from 'react';
//
// const BannerPlaceholder: React.FC = () => {
//   return (
//     <div className="flex flex-col items-center justify-center text-white text-center p-4">
//       <span className="text-5xl md:text-7xl font-bold">ST</span>
//       {/*<span className="text-xl md:text-2xl mt-2">LOGO / PHOTO</span>*/}
//     </div>
//   );
// };
//
// export default BannerPlaceholder;

// frontend/src/components/layout/BannerPlaceholder.tsx - Dynamic Gallery Placeholder
import React, { useState, useEffect, useCallback } from 'react';
import * as photoApi from '../photo_store/photos_api'; // Import photo API functions
import default_avatar from "../../images/default_avatar.png"; // Fallback image if needed

// Define the gallery slug for logos
const LOGO_GALLERY_SLUG = 'page-logos'; // The specific gallery you'll create in Django admin
import { SITE_OWNER_INITIALS } from './siteConfig.ts';

const BannerPlaceholder: React.FC = () => {
  const [images, setImages] = useState<photoApi.GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images for the specified gallery
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await photoApi.getGalleryImages({ gallery_slug: LOGO_GALLERY_SLUG });
      if (response.data && response.data.length > 0) {
        setImages(response.data);
      } else {
        setImages([]); // No images found in gallery
      }
    } catch (err: any) {
      console.error("Failed to fetch banner images:", err.response?.data || err.message);
      setError("Failed to load banner images.");
      setImages([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Function to cycle to the next image
  const showNextImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, [images]);

  // Render the image or default "ST" text
  const currentImage = images[currentIndex];

  // Common styles for the container (copied from Welcome.tsx's usage)
  const containerClasses = "w-full h-full bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300";
  const contentClasses = "flex flex-col items-center justify-center text-white text-center p-4";


  if (loading) {
    return (
      <div className={`${containerClasses} bg-gray-500 animate-pulse`}>
        <span className="text-3xl md:text-5xl font-bold">...</span>
      </div>
    );
  }

  // If no images or error, show default "ST" text
  if (!currentImage || error) {
    return (
      <div className={`${containerClasses} bg-gray-700`}> {/* Darker gray for default */}
        <div className={contentClasses}>
          <span className="text-5xl md:text-7xl font-bold">{ SITE_OWNER_INITIALS } </span>
        </div>
      </div>
    );
  }

  // If images are available, display the current image
  return (
    <div
      className={containerClasses}
      onMouseEnter={showNextImage} // Change on hover
      onClick={showNextImage}     // Change on click
      style={{ overflow: 'hidden' }} // Ensure image doesn't spill out of rounded container
    >
      <img
        src={currentImage.image_url}
        alt={currentImage.title || currentImage.description || "Banner Image"}
        className="w-full h-full object-cover" // Ensure image covers the div, or object-contain if you want it to fit without cropping
      />
    </div>
  );
};

export default BannerPlaceholder;