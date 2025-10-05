// src/components/WipModal.tsx
import React, { useState, useEffect } from 'react';
import BeeKind from '../../../images/BeeKind.png'; // You can choose any of your bee images here

interface WipModalProps {
  duration?: number; // How long the modal should be visible in milliseconds (default: 3000ms = 3 seconds)
}

const WipModal: React.FC<WipModalProps> = ({ duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the modal when the component mounts
    setIsVisible(true);

    // Set a timer to hide the modal after the specified duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Cleanup the timer if the component unmounts before the timer finishes
    return () => clearTimeout(timer);
  }, [duration]); // Dependency array ensures effect runs only when duration changes (or on mount)

  if (!isVisible) {
    return null; // Don't render anything if the modal is not visible
  }

  return (
    // Fixed overlay to cover the whole screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn">
      {/* Modal content box */}
      {/* --- CHANGE THIS LINE --- */}
      {/* Before: className="relative bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center transform scale-95 opacity-0 animate-scaleIn" */}
      {/* After:  className="relative bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center transform scale-95 animate-scaleIn" */}
      <div className="relative bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center transform scale-95 animate-scaleIn">
        {/* Bee Image */}
        <img
          src={BeeKind} // Your chosen bee image
          alt="Work in Progress Bee"
          className="mx-auto mb-6 w-32 h-32 object-contain" // Centered, fixed size, maintains aspect ratio
        />

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Work in Progress!</h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          We're currently building something amazing for you. Stay tuned for updates!
        </p>

        {/* Optional: A simple progress bar/animation to enhance "work in progress" feel */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-yellow-400 h-2.5 rounded-full w-[70%] animate-pulse"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Almost there!</p>
      </div>
    </div>
  );
};

export default WipModal;