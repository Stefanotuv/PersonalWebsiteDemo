// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';
//
// // Define the structure of the configuration object this modal expects
// // This is used by both the modal and the TemplateLandingPage
// export interface MessageModalConfig {
//     show: boolean;
//     variant: 'yes/no' | 'simple_confirm' | 'static';
//     title: string;
//     message: string;
//     yesLink?: string;
//     noLink?: string;
//     confirmLink?: string;
// }
//
// interface MessageModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     config: MessageModalConfig | null;
// }
//
// const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, config }) => {
//     if (!isOpen || !config) return null;
//
//     // A helper to close the modal when a link is clicked
//     const handleLinkClick = () => {
//         onClose();
//     };
//
//     const renderButtons = () => {
//         switch (config.variant) {
//             case 'yes/no':
//                 return (
//                     <div className="flex justify-end space-x-4 mt-6">
//                         {config.noLink && (
//                             <Link
//                                 to={config.noLink}
//                                 onClick={handleLinkClick}
//                                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
//                             >
//                                 No
//                             </Link>
//                         )}
//                         {config.yesLink && (
//                             <Link
//                                 to={config.yesLink}
//                                 onClick={handleLinkClick}
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                             >
//                                 Yes
//                             </Link>
//                         )}
//                     </div>
//                 );
//             case 'simple_confirm':
//                 return (
//                     <div className="flex justify-end mt-6">
//                          {config.confirmLink && (
//                             <Link
//                                 to={config.confirmLink}
//                                 onClick={handleLinkClick}
//                                 className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                             >
//                                 Confirm
//                             </Link>
//                         )}
//                     </div>
//                 );
//             case 'static':
//             default:
//                 return null; // No buttons for static modal
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[200]" onClick={onClose}>
//             <div
//                 className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
//                 onClick={e => e.stopPropagation()}
//             >
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//                     aria-label="Close modal"
//                 >
//                     <FaTimes size={20} />
//                 </button>
//
//                 <div className="text-center">
//                     <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
//                     <p className="mt-2 text-gray-600">{config.message}</p>
//                 </div>
//
//                 {renderButtons()}
//             </div>
//         </div>
//     );
// };
//
// export default MessageModal;


import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

export interface MessageModalConfig {
    show: boolean;
    variant: 'yes/no' | 'simple_confirm' | 'static';
    title: string;
    message: string;
    yesLink?: string;
    noLink?: string;
    confirmLink?: string;
}

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: MessageModalConfig | null;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, config }) => {
    if (!isOpen || !config) return null;

    const handleLinkClick = () => {
        onClose();
    };

    const renderButtons = () => {
        switch (config.variant) {
            case 'yes/no':
                return (
                    <div className="flex justify-end space-x-4 mt-6">
                        {config.noLink && ( <Link to={config.noLink} onClick={handleLinkClick} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">No</Link> )}
                        {config.yesLink && ( <Link to={config.yesLink} onClick={handleLinkClick} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Yes</Link> )}
                    </div>
                );
            case 'simple_confirm':
                return (
                    <div className="flex justify-end mt-6">
                        {config.confirmLink && ( <Link to={config.confirmLink} onClick={handleLinkClick} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Confirm</Link> )}
                    </div>
                );
            case 'static': default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[200]" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close modal"> <FaTimes size={20} /> </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
                    <p className="mt-2 text-gray-600">{config.message}</p>
                </div>
                {renderButtons()}
            </div>
        </div>
    );
};

export default MessageModal;