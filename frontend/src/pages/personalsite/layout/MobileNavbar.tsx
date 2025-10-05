
// // src/pages/Bee/layout/MobileNavbar.tsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import BeeIcon from "../../../images/BeeIcon.png";
// import default_avatar from "../../../images/default_avatar.png";
// import api from "../../../api.ts";
// import { FaPaperPlane, FaTimes, FaBars } from 'react-icons/fa'; // Import FaTimes (X) and FaBars (Hamburger) icons
//
// // Define AuthUser interface (can be imported from a shared types file)
// interface AuthUser {
//   id?: number;
//   username?: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   is_staff?: boolean;
//   profile?: {
//     profile_picture?: string | null;
//   } | null;
// }
//
// // Modal component (copied from DefaultNavbar.tsx)
// interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     children: React.ReactNode;
// }
//
// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" onClick={onClose}>
//             <div className="relative p-4 bg-white rounded shadow-lg" onClick={e => e.stopPropagation()}>
//                 <button onClick={onClose} className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
//                     X
//                 </button>
//                 {children}
//             </div>
//         </div>
//     );
// };
//
//
// const MobileNavbar: React.FC = () => {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the full-screen menu
//   // States for password check
//   const [hasPassword, setHasPassword] = useState<boolean | null>(null);
//   const [checkingPassword, setCheckingPassword] = useState(true);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//
//   const { isAuthenticated, user, isLoading, logout } = useAuth() as {
//     isAuthenticated: boolean;
//     user: AuthUser | null;
//     isLoading: boolean;
//     logout: () => void;
//   };
//
//   const toggleMenu = () => {
//       setIsMenuOpen(!isMenuOpen);
//   };
//
//   const handleLinkClick = (path: string) => {
//     navigate(path);
//     setIsMenuOpen(false); // Close menu on navigation
//   };
//
//   const handleLogout = () => {
//      logout();
//      setIsMenuOpen(false);
//      navigate('/'); // Or to signin page
//   };
//
//   // --- Password Status Logic ---
//   useEffect(() => {
//     const checkPasswordStatus = async () => {
//         setCheckingPassword(true);
//         try {
//             const response = await api.get('/backend/api/user/has-password-set/');
//             setHasPassword(response.data.has_password);
//         } catch (err) {
//             console.error("Error checking password status (MobileNavbar):", err);
//             setHasPassword(false); // Fallback solution
//         } finally {
//             setCheckingPassword(false);
//         }
//     };
//
//     if (isAuthenticated) { // Only check if authenticated
//         checkPasswordStatus();
//     } else {
//         setHasPassword(null); // Reset if not authenticated
//     }
//   }, [isAuthenticated]);
//
//   useEffect(() => {
//     // Only show modal if authenticated, password is not set, and it's done checking
//     if(isAuthenticated && hasPassword === false && !checkingPassword) {
//         setShowPasswordModal(true);
//     } else {
//         setShowPasswordModal(false);
//     }
//   }, [isAuthenticated, hasPassword, checkingPassword]);
//   // --- End Password Status Logic ---
//
//   // Control body scrolling when menu is open
//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = ''; // Clean up on unmount
//     };
//   }, [isMenuOpen]);
//
//
//   // Profile Picture Logic (simplified from your desktop navbar)
//   const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
//   let profilePictureUrl = default_avatar;
//   const imagePath = user?.profile?.profile_picture;
//   if (imagePath) {
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       profilePictureUrl = imagePath;
//     } else if (cleanedBackendBaseUrl) {
//       profilePictureUrl = `${cleanedBackendBaseUrl}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
//     }
//   }
//
//   // Mobile Navbar Loading State
//   if (isAuthenticated && (isLoading || checkingPassword)) {
//     return (
//         <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-center items-center h-16">
//             Loading...
//         </nav>
//     );
//   }
//
//   return (
//     <> {/* Use a fragment to contain both navbar and modal */}
//       <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
//         <div className="flex items-center justify-between">
//           <Link to="/Welcome" className="text-lg font-bold">
//             <img className="h-8 w-auto" src={BeeIcon} alt="Logo" />
//           </Link>
//
//           <div className="flex items-center space-x-4"> {/* Container for Post button and Hamburger */}
//             {isAuthenticated && (
//                 <button
//                   onClick={() => handleLinkClick("/blog/create")} // Use handleLinkClick for consistency
//                   className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"
//                 >
//                   <FaPaperPlane className="text-base" /> Post
//                 </button>
//             )}
//
//             {/* Hamburger Button (now always shows FaBars) */}
//             <button onClick={toggleMenu} className="p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
//               <FaBars className="h-6 w-6" /> {/* Always show hamburger icon here */}
//             </button>
//           </div>
//         </div>
//       </nav>
//
//       {/* Full-Screen Mobile Menu Overlay */}
//       <div className={`
//         fixed inset-0 z-[100] bg-gray-900 text-white
//         flex flex-col items-center justify-center
//         transition-transform duration-300 ease-in-out transform
//         ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
//       `}>
//         <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white">
//           <FaTimes className="h-8 w-8" /> {/* X icon for closing */}
//         </button>
//
//         <ul className="space-y-6 text-xl text-center"> {/* Larger text and spacing for mobile menu */}
//           <li><button onClick={() => handleLinkClick("/")} className="w-full text-left hover:text-yellow-400">Home</button></li>
//           <li><button onClick={() => handleLinkClick("/causes")} className="w-full text-left hover:text-yellow-400">Causes</button></li>
//           <li><button onClick={() => handleLinkClick("/palestineheart")} className="w-full text-left hover:text-yellow-400">Palestine</button></li>
//           <li><button onClick={() => handleLinkClick("/new-shop")} className="w-full text-left hover:text-yellow-400">Shop</button></li>
//           <li><button onClick={() => handleLinkClick("/blog")} className="w-full text-left hover:text-yellow-400">Blog</button></li>
//           <li><button onClick={() => handleLinkClick("/about")} className="w-full text-left hover:text-yellow-400">About Us</button></li>
//           <hr className="border-gray-700 my-4"/>
//           {isAuthenticated && user ? (
//             <>
//               <li className="flex items-center justify-center space-x-3">
//                  <img src={profilePictureUrl} alt="profile" className="h-10 w-10 rounded-full object-cover border-2 border-white" />
//                  <span className="font-semibold text-2xl">{user.first_name || user.username}</span>
//               </li>
//               <li><button onClick={() => handleLinkClick("/profile")} className="w-full text-center hover:text-yellow-400">Profile</button></li>
//               <li><button onClick={() => handleLinkClick("/myfriendships")} className="w-full text-center hover:text-yellow-400">Friends</button></li>
//               <li><button onClick={() => handleLinkClick("/my-public-profile")} className="w-full text-center hover:text-yellow-400">Public Profile</button></li>
//               {user?.is_staff && (
//                 <li><button onClick={() => handleLinkClick("/dashboard")} className="w-full text-center hover:text-yellow-400">Dashboard</button></li>
//               )}
//               <li><button onClick={handleLogout} className="w-full text-center text-red-400 hover:text-red-300">Sign Out</button></li>
//             </>
//           ) : (
//             <li><button onClick={() => handleLinkClick("/signin")} className="w-full text-center hover:text-yellow-400">Join / Sign In</button></li>
//           )}
//         </ul>
//       </div>
//
//       {/* Password Modal - Rendered outside of the nav to ensure it appears correctly */}
//       <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
//           <div className="p-6">
//               <h2 className="text-lg font-bold text-gray-800">Set Your Password</h2>
//               <p className="mt-2 text-gray-600">
//                   For full access and to enable email/password login, please set your password now.
//               </p>
//               <Link
//                     to="/setpassword"
//                     className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                     onClick={() => setShowPasswordModal(false)} // Close modal on link click
//                 >
//                     Set Password
//                 </Link>
//           </div>
//       </Modal>
//     </>
//   );
// };
//
// export default MobileNavbar;
//

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import BeeIcon from "../../../images/BeeIcon.png";
// import default_avatar from "../../../images/default_avatar.png";
// import api from "../../../api.ts";
// import { FaPaperPlane, FaTimes, FaBars, FaUsersCog } from 'react-icons/fa';
// import { fetchCurrentEnvSettings } from '../config/api_config.ts';
// // --- NEW --- Import the Modal and its config interface
// import MessageModal, { MessageModalConfig } from './MessageModal';
//
// // --- NEW --- PRE-CONFIGURED MODALS DEFINED ON THE FRONTEND
// // You can easily change the text and links for each modal right here.
// const MODAL_CONFIGURATIONS: Record<string, MessageModalConfig> = {
//     "two_buttons": {
//         show: true, variant: 'yes/no', title: 'Check out the Shop?',
//         message: 'We have new items available for Palestine. Would you like to see them?',
//         yesLink: '/new-shop', noLink: '/welcome'
//     },
//     "one_button": {
//         show: true, variant: 'simple_confirm', title: 'Action Required',
//         message: 'Please update your public profile to connect with friends.',
//         confirmLink: '/my-public-profile'
//     },
//     "simple": {
//         show: true, variant: 'static', title: 'Quick Update',
//         message: 'We will be performing site maintenance tonight at midnight. The app may be briefly unavailable.'
//     }
// };
//
// // ... (AuthUser interface and the other Modal for password)
// interface AuthUser { id?: number; username?: string; email?: string; first_name?: string; last_name?: string; is_staff?: boolean; profile?: { profile_picture?: string | null; } | null; }
// interface PasswordModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode; }
// const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, children }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" onClick={onClose}><div className="relative p-4 bg-white rounded shadow-lg" onClick={e => e.stopPropagation()}><button onClick={onClose} className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">X</button>{children}</div></div> ); };
//
//
// const MobileNavbar: React.FC = () => {
//     const navigate = useNavigate();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [hasPassword, setHasPassword] = useState<boolean | null>(null);
//     const [checkingPassword, setCheckingPassword] = useState(true);
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [currentEnvironment, setCurrentEnvironment] = useState<string | null>(null);
//
//     // --- NEW --- STATE FOR THE NEW MESSAGE MODAL
//     const [messageModalConfig, setMessageModalConfig] = useState<MessageModalConfig | null>(null);
//     const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
//
//     const { isAuthenticated, user, isLoading, logout } = useAuth() as { isAuthenticated: boolean; user: AuthUser | null; isLoading: boolean; logout: () => void; };
//
//     // --- NEW --- useEffect to check and show the message modal
//     useEffect(() => {
//         const fetchSettingsAndShowModal = async () => {
//             // Only run if user is authenticated
//             if (!isAuthenticated) return;
//
//             // Prevent showing again in the same browser session
//             const hasSeenModal = sessionStorage.getItem('hasSeenMessageModal');
//             if (hasSeenModal) return;
//
//             try {
//                 const response = await fetchCurrentEnvSettings();
//                 const settings = response.settings;
//                 const modalVariantKey = settings?.message_modal; // e.g., "two_buttons"
//
//                 // If the key exists and we have a config for it, show the modal
//                 if (modalVariantKey && MODAL_CONFIGURATIONS[modalVariantKey]) {
//                     setMessageModalConfig(MODAL_CONFIGURATIONS[modalVariantKey]);
//                     setIsMessageModalOpen(true);
//                 }
//             } catch (err) {
//                 console.error("Failed to load settings for message modal:", err);
//             }
//         };
//
//         fetchSettingsAndShowModal();
//     }, [isAuthenticated]); // This hook runs when the user's auth state changes
//
//     // --- NEW --- Function to close the new modal
//     const handleCloseMessageModal = () => {
//         setIsMessageModalOpen(false);
//         sessionStorage.setItem('hasSeenMessageModal', 'true');
//     };
//
//     // ... The rest of your existing functions and hooks ...
//     const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
//     const handleLinkClick = (path: string) => { navigate(path); setIsMenuOpen(false); };
//     const handleLogout = () => { logout(); setIsMenuOpen(false); navigate('/'); };
//     useEffect(() => { /* ... fetch environment ... */ async function fetchEnv() { try { const d = await fetchCurrentEnvSettings(); setCurrentEnvironment(d.environment.name); } catch { setCurrentEnvironment("Unknown"); } } fetchEnv(); }, []);
//     useEffect(() => { /* ... check password ... */ async function checkPass() { if (!isAuthenticated) { setHasPassword(null); return; } setCheckingPassword(true); try { const r = await api.get('/backend/api/user/has-password-set/'); setHasPassword(r.data.has_password); } catch { setHasPassword(false); } finally { setCheckingPassword(false); } } checkPass(); }, [isAuthenticated]);
//     useEffect(() => { if (isAuthenticated && hasPassword === false && !checkingPassword) { setShowPasswordModal(true); } else { setShowPasswordModal(false); } }, [isAuthenticated, hasPassword, checkingPassword]);
//     useEffect(() => { if (isMenuOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; } return () => { document.body.style.overflow = ''; }; }, [isMenuOpen]);
//     const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
//     let profilePictureUrl = default_avatar;
//     const imagePath = user?.profile?.profile_picture;
//     if (imagePath) { if (imagePath.startsWith('http')) { profilePictureUrl = imagePath; } else if (cleanedBackendBaseUrl) { profilePictureUrl = `${cleanedBackendBaseUrl}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`; } }
//     if (isAuthenticated && (isLoading || checkingPassword)) { return (<nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-center items-center h-16">Loading...</nav>); }
//
//     return (
//         <>
//             {/* The actual Navbar JSX */}
//             <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
//                 {/* ... existing navbar content ... */}
//                 <div className="flex items-center justify-between">
//                     <Link to="/Welcome" className="text-lg font-bold"><img className="h-8 w-auto" src={BeeIcon} alt="Logo" /></Link>
//                     <div className="flex items-center space-x-4">
//                         {isAuthenticated && (<button onClick={() => handleLinkClick("/blog/create")} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"><FaPaperPlane className="text-base" /> Post</button>)}
//                         <button onClick={toggleMenu} className="p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"><FaBars className="h-6 w-6" /></button>
//                     </div>
//                 </div>
//             </nav>
//
//             {/* The Full-Screen Menu Overlay JSX with your requested link changes */}
//             <div className={`fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col justify-between pt-24 pb-8 items-center transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
//                 <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"><FaTimes className="h-8 w-8" /></button>
//                 <ul className="space-y-6 text-xl text-center">
//                     <li><button onClick={() => handleLinkClick("/")} className="w-full text-left hover:text-yellow-400">Home</button></li>
//                     <li><button onClick={() => handleLinkClick("/causes")} className="w-full text-left hover:text-yellow-400">Causes</button></li>
//                     <li><button onClick={() => handleLinkClick("/palestineheart")} className="w-full text-left hover:text-yellow-400">Palestine</button></li>
//                     <li><button onClick={() => handleLinkClick("/new-shop")} className="w-full text-left hover:text-yellow-400">Shop</button></li>
//                     <li><button onClick={() => handleLinkClick("/blog")} className="w-full text-left hover:text-yellow-400">Blog</button></li>
//                     <li><button onClick={() => handleLinkClick("/engage")} className="w-full text-left hover:text-yellow-400">Engage</button></li>
//                     <li><button onClick={() => handleLinkClick("/about")} className="w-full text-left hover:text-yellow-400">About Us</button></li>
//                     <hr className="border-gray-700 my-4"/>
//                     {isAuthenticated && user ? (
//                         <>
//                             <li className="flex items-center justify-center space-x-3"><img src={profilePictureUrl} alt="profile" className="h-10 w-10 rounded-full object-cover border-2 border-white" /><span className="font-semibold text-2xl">{user.first_name || user.username}</span></li>
//                             <li><button onClick={() => handleLinkClick("/profile")} className="w-full text-center hover:text-yellow-400">Profile</button></li>
//                             <li><button onClick={() => handleLinkClick("/myfriendships")} className="w-full text-center hover:text-yellow-400">Friends</button></li>
//                             <li><button onClick={() => handleLinkClick("/my-public-profile")} className="w-full text-center hover:text-yellow-400">Public Profile</button></li>
//                             {user?.is_staff && (
//                                 <>
//                                     <li><button onClick={() => handleLinkClick("/dashboard")} className="w-full text-center hover:text-yellow-400">Dashboard</button></li>
//                                     <li><button onClick={() => handleLinkClick("/config/environments")} className="w-full text-center hover:text-yellow-400 flex items-center justify-center gap-2"><FaUsersCog/> Engagement</button></li>
//                                 </>
//                             )}
//                             <li><button onClick={handleLogout} className="w-full text-center text-red-400 hover:text-red-300">Sign Out</button></li>
//                         </>
//                     ) : (
//                         <li><button onClick={() => handleLinkClick("/signin")} className="w-full text-center hover:text-yellow-400">Join / Sign In</button></li>
//                     )}
//                 </ul>
//                 <div className="text-center mt-8">{currentEnvironment && (<p className="text-xs text-gray-500 font-mono">Env: {currentEnvironment}</p>)}</div>
//             </div>
//
//             {/* --- NEW --- RENDER THE NEW MESSAGE MODAL GLOBALLY */}
//             <MessageModal
//                 isOpen={isMessageModalOpen}
//                 onClose={handleCloseMessageModal}
//                 config={messageModalConfig}
//             />
//
//             {/* The existing password modal */}
//             <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
//                 <div className="p-6">
//                     <h2 className="text-lg font-bold text-gray-800">Set Your Password</h2>
//                     <p className="mt-2 text-gray-600">For full access and to enable email/password login, please set your password now.</p>
//                     <Link to="/setpassword" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setShowPasswordModal(false)}>Set Password</Link>
//                 </div>
//             </PasswordModal>
//         </>
//     );
// };
//
// export default MobileNavbar;

import React, { useState, useEffect } from 'react';
// --- NEW --- Import useLocation to detect page changes
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';
import BeeIcon from "../../../images/BeeIcon.png";
import default_avatar from "../../../images/default_avatar.png";
import api from "../../../api.ts";
import { FaPaperPlane, FaTimes, FaBars, FaUsersCog } from 'react-icons/fa';
import { fetchCurrentEnvSettings } from '../config/api_config.ts';
import MessageModal, { MessageModalConfig } from './MessageModal.tsx';

// --- CONFIGURATION FOR LOGGED-IN USERS ---
const LOGGED_IN_MODAL_CONFIGS: Record<string, MessageModalConfig> = {
    "two_buttons": {
        show: true, variant: 'yes/no', title: 'Check out the Shop?',
        message: 'We have new items available for Palestine. Would you like to see them?',
        yesLink: '/new-shop', noLink: '/welcome'
    },
    "one_button": {
        show: true, variant: 'simple_confirm', title: 'Action Required',
        message: 'Please update your public profile to connect with friends.',
        confirmLink: '/my-public-profile'
    },
    "simple": {
        show: true, variant: 'static', title: 'Quick Update',
        message: 'We will be performing site maintenance tonight at midnight.'
    }
};

// --- NEW --- CONFIGURATION FOR LOGGED-OUT GUESTS ---
const LOGGED_OUT_MODAL_CONFIGS: Record<string, MessageModalConfig> = {
    "two_buttons": {
        show: true, variant: 'yes/no', title: 'Join the Cause?',
        message: 'Create a free account to join our community and track your impact.',
        yesLink: '/signup', noLink: '/about'
    },
    "one_button": {
        show: true, variant: 'simple_confirm', title: 'Welcome!',
        message: 'Check out our latest blog post to see what we\'ve been up to.',
        confirmLink: '/blog'
    },
    "simple": {
        show: true, variant: 'static', title: 'Special Announcement',
        message: 'All proceeds from the shop this month go directly to our Palestine cause.'
    }
};


// ... (AuthUser and PasswordModal interfaces remain the same)
interface AuthUser { id?: number; username?: string; email?: string; first_name?: string; last_name?: string; is_staff?: boolean; profile?: { profile_picture?: string | null; } | null; }
interface PasswordModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode; }
const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, children }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" onClick={onClose}><div className="relative p-4 bg-white rounded shadow-lg" onClick={e => e.stopPropagation()}><button onClick={onClose} className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">X</button>{children}</div></div> ); };


const MobileNavbar: React.FC = () => {
    // --- NEW --- Get the location object to track navigation
    const location = useLocation();

    // ... (All other state variables remain the same)
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [checkingPassword, setCheckingPassword] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentEnvironment, setCurrentEnvironment] = useState<string | null>(null);
    const [messageModalConfig, setMessageModalConfig] = useState<MessageModalConfig | null>(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const { isAuthenticated, user, isLoading, logout } = useAuth() as { isAuthenticated: boolean; user: AuthUser | null; isLoading: boolean; logout: () => void; };

    // --- UPGRADED useEffect to handle all modal logic ---
    // This now runs whenever the auth state OR the page URL changes.
    useEffect(() => {
        const fetchSettingsAndShowModal = async () => {
            try {
                const response = await fetchCurrentEnvSettings();
                const settings = response.settings;

                let modalKey: string | undefined;
                let modalConfigObject: Record<string, MessageModalConfig>;

                // STEP 1: Decide which variable and config to use based on auth state
                if (isAuthenticated) {
                    modalKey = settings?.message_modal; // Use the logged-in variable
                    modalConfigObject = LOGGED_IN_MODAL_CONFIGS;
                } else {
                    modalKey = settings?.message_modal_logout; // Use the new logged-out variable
                    modalConfigObject = LOGGED_OUT_MODAL_CONFIGS;
                }

                // STEP 2: Check if we should show a modal
                const lastShownKey = sessionStorage.getItem('lastShownModalKey');

                // Show the modal ONLY if there is a key AND it's a DIFFERENT key than the last one we showed
                if (modalKey && modalKey !== lastShownKey && modalConfigObject[modalKey]) {
                    const configToShow = modalConfigObject[modalKey];
                    setMessageModalConfig(configToShow);
                    setIsMessageModalOpen(true);
                    // IMPORTANT: Store the key of the modal we just decided to show
                    sessionStorage.setItem('lastShownModalKey', modalKey);
                }

            } catch (err) {
                console.error("Failed to load settings for message modal:", err);
            }
        };

        fetchSettingsAndShowModal();
    }, [isAuthenticated, location.pathname]); // The magic: re-runs on auth change OR page navigation

    const handleCloseMessageModal = () => {
        setIsMessageModalOpen(false);
        // We no longer need to set a generic "seen" flag here, the key check handles it
    };

    // ... (All other hooks and functions remain the same as before)
    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
    const handleLinkClick = (path: string) => { navigate(path); setIsMenuOpen(false); };
    const handleLogout = () => { logout(); sessionStorage.removeItem('lastShownModalKey'); setIsMenuOpen(false); navigate('/'); };
    useEffect(() => { async function fetchEnv() { try { const d = await fetchCurrentEnvSettings(); setCurrentEnvironment(d.environment.name); } catch { setCurrentEnvironment("Unknown"); } } fetchEnv(); }, []);
    useEffect(() => { async function checkPass() { if (!isAuthenticated) { setHasPassword(null); return; } setCheckingPassword(true); try { const r = await api.get('/backend/api/user/has-password-set/'); setHasPassword(r.data.has_password); } catch { setHasPassword(false); } finally { setCheckingPassword(false); } } checkPass(); }, [isAuthenticated]);
    useEffect(() => { if (isAuthenticated && hasPassword === false && !checkingPassword) { setShowPasswordModal(true); } else { setShowPasswordModal(false); } }, [isAuthenticated, hasPassword, checkingPassword]);
    useEffect(() => { if (isMenuOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; } return () => { document.body.style.overflow = ''; }; }, [isMenuOpen]);
    const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    let profilePictureUrl = default_avatar;
    const imagePath = user?.profile?.profile_picture;
    if (imagePath) { if (imagePath.startsWith('http')) { profilePictureUrl = imagePath; } else if (cleanedBackendBaseUrl) { profilePictureUrl = `${cleanedBackendBaseUrl}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`; } }
    if (isAuthenticated && (isLoading || checkingPassword)) { return (<nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-center items-center h-16">Loading...</nav>); }

    return (
        <>
            {/* The Navbar, Menu, and Modals JSX (no changes here from the last version) */}
            <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center justify-between">
                    <Link to="/Welcome" className="text-lg font-bold"><img className="h-8 w-auto" src={BeeIcon} alt="Logo" /></Link>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && (<button onClick={() => handleLinkClick("/blog/create")} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"><FaPaperPlane className="text-base" /> Post</button>)}
                        <button onClick={toggleMenu} className="p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"><FaBars className="h-6 w-6" /></button>
                    </div>
                </div>
            </nav>

            <div className={`fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col justify-between pt-24 pb-8 items-center transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"><FaTimes className="h-8 w-8" /></button>
                <ul className="space-y-6 text-xl text-center">
                    <li><button onClick={() => handleLinkClick("/")} className="w-full text-left hover:text-yellow-400">Home</button></li>
                    <li><button onClick={() => handleLinkClick("/causes")} className="w-full text-left hover:text-yellow-400">Causes</button></li>
                    <li><button onClick={() => handleLinkClick("/palestineheart")} className="w-full text-left hover:text-yellow-400">Palestine</button></li>
                    <li><button onClick={() => handleLinkClick("/new-shop")} className="w-full text-left hover:text-yellow-400">Shop</button></li>
                    <li><button onClick={() => handleLinkClick("/blog")} className="w-full text-left hover:text-yellow-400">Blog</button></li>
                    <li><button onClick={() => handleLinkClick("/engage")} className="w-full text-left hover:text-yellow-400">Engage</button></li>
                    <li><button onClick={() => handleLinkClick("/about")} className="w-full text-left hover:text-yellow-400">About Us</button></li>
                    <hr className="border-gray-700 my-4"/>
                    {isAuthenticated && user ? (
                        <>
                            <li className="flex items-center justify-center space-x-3"><img src={profilePictureUrl} alt="profile" className="h-10 w-10 rounded-full object-cover border-2 border-white" /><span className="font-semibold text-2xl">{user.first_name || user.username}</span></li>
                            <li><button onClick={() => handleLinkClick("/profile")} className="w-full text-center hover:text-yellow-400">Profile</button></li>
                            <li><button onClick={() => handleLinkClick("/myfriendships")} className="w-full text-center hover:text-yellow-400">Friends</button></li>
                            <li><button onClick={() => handleLinkClick("/my-public-profile")} className="w-full text-center hover:text-yellow-400">Public Profile</button></li>
                            {user?.is_staff && (
                                <>
                                    <li><button onClick={() => handleLinkClick("/dashboard")} className="w-full text-center hover:text-yellow-400">Dashboard</button></li>
                                    <li><button onClick={() => handleLinkClick("/config/environments")} className="w-full text-center hover:text-yellow-400 flex items-center justify-center gap-2"><FaUsersCog/> Engagement</button></li>
                                </>
                            )}
                            <li><button onClick={handleLogout} className="w-full text-center text-red-400 hover:text-red-300">Sign Out</button></li>
                        </>
                    ) : (
                        <li><button onClick={() => handleLinkClick("/signin")} className="w-full text-center hover:text-yellow-400">Join / Sign In</button></li>
                    )}
                </ul>
                <div className="text-center mt-8">{currentEnvironment && (<p className="text-xs text-gray-500 font-mono">Env: {currentEnvironment}</p>)}</div>
            </div>

            <MessageModal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} config={messageModalConfig} />
            <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">Set Your Password</h2>
                    <p className="mt-2 text-gray-600">For full access and to enable email/password login, please set your password now.</p>
                    <Link to="/setpassword" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setShowPasswordModal(false)}>Set Password</Link>
                </div>
            </PasswordModal>
        </>
    );
};

export default MobileNavbar;