import React from 'react';

// Define a type for our terms data for better TypeScript support
type TermsData = {
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content: string;
  }[];
};

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: TermsData;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, terms }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Close modal on overlay click
    >
      {/* Modal content */}
      <div
        className="bg-stone-800 text-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{terms.title}</h2>
            <button onClick={onClose} className="text-gray-300 hover:text-white text-3xl">×</button>
        </div>
        <p className="text-sm text-gray-400 mb-4">Last updated: {terms.lastUpdated}</p>

        {/* Scrollable Terms Content */}
        <div className="overflow-y-auto pr-2 space-y-4">
          {terms.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-red-500">{section.heading}</h3>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 self-end"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TermsModal;