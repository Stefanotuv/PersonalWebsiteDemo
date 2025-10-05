// // src/pages/Bee/layout/Navbar.tsx
// import React, { useState, useEffect } from "react";
// import FadeIn from "../components/FadeIn.tsx"
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../../../context/AuthContext.tsx'; // Verify path
// import api from '../../../api.ts'; // Import API
//
// import BeeIcon from "../../../images/BeeIcon.png"; // Verify path
// import BeeIconInverted from "../../../images/BeeIconInverted.png"; // Verify path
// import default_avatar from "../../../images/default_avatar.png";
// // import Banner1 from "../../../images/banners/BeeBanner1.png"; // Not used, can be removed if desired
// import { FaBookmark, FaEdit, FaPlus, FaHome, FaHandsHelping, FaHands, FaAmbulance, FaBookOpen, FaClipboardList, FaPaperPlane } from 'react-icons/fa'; // Import React Icons
//
//
// // Define expected User structure from AuthContext (adjust if needed)
// interface AuthUser {
//   id?: number; // Or string?
//   username?: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   is_staff?: boolean;
//   profile?: {
//     profile_picture?: string | null; // Crucial field
//   } | null;
// }
//
// // Modal component (no changes needed)
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
// function Navbar(props: { playPage?: boolean }) {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [show, handleShow] = useState(false);
//   const [hasPassword, setHasPassword] = useState<boolean | null>(null);
//   const [checkingPassword, setCheckingPassword] = useState(true);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//
//   // NEW STATE FOR MAGIC LINK
//   const [magicLink, setMagicLink] = useState<string | null>(null);
//   const [fetchingMagicLink, setFetchingMagicLink] = useState(false); // To indicate loading
//
//   // Use a more specific type for the user from context
//   const { isAuthenticated, user, isLoading, logout } = useAuth() as {
//     isAuthenticated: boolean;
//     user: AuthUser | null;
//     isLoading: boolean;
//     logout: () => void;
//   };
//
//   // Existing useEffect for password status
//   useEffect(() => {
//     const checkPasswordStatus = async () => {
//         setCheckingPassword(true);
//         try {
//             const response = await api.get('/backend/api/user/has-password-set/');
//             setHasPassword(response.data.has_password);
//         } catch (err) {
//             console.error("Error checking password status:", err);
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
//   }, [isAuthenticated]); // Dependency on isAuthenticated
//
//   useEffect(() => {
//     if(isAuthenticated && hasPassword === false) {
//         setShowPasswordModal(true);
//     } else {
//         setShowPasswordModal(false);
//     }
//   }, [isAuthenticated, hasPassword]);
//
//   // NEW useEffect for fetching the magic link
//   useEffect(() => {
//     const fetchAndSetMagicLink = async () => {
//       // Clear previous link if user is no longer authenticated
//       if (!isAuthenticated) {
//         setMagicLink(null);
//         setFetchingMagicLink(false);
//         return;
//       }
//
//       setFetchingMagicLink(true); // Indicate that we are fetching
//       try {
//         const response = await api.post("/generate-magic-link/");
//         // alert(`Response from generate magic link : ${response}`);
//         if (response.data && response.data.link) {
//             debugger
//             // alert(`Response response.data.link : ${response.data.link}`);
//           setMagicLink(response.data.link);
//         } else {
//           console.warn("Magic link API response did not contain a 'link' field:", response.data);
//           setMagicLink(null); // Ensure link is null if not provided
//         }
//       } catch (err) {
//         console.error("Failed to generate magic link:", err);
//         setMagicLink(null); // Clear link on error
//       } finally {
//         setFetchingMagicLink(false); // Done fetching
//       }
//     };
//
//     fetchAndSetMagicLink();
//   }, [isAuthenticated]); // Re-run when authentication status changes
//
//   useEffect(() => {
//     const transitionNavBar = () => handleShow(window.scrollY > 80);
//     window.addEventListener("scroll", transitionNavBar);
//     return () => window.removeEventListener("scroll", transitionNavBar);
//   }, []);
//
//   // --- Profile Picture URL Calculation (Corrected Logic) ---
//   const image_url = default_avatar;
//   console.log("Navbar - image_url:", image_url);
//
//   let profilePictureUrl = image_url; // Your default avatar path
//
//   const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '')
//                               .replace(/\/api\/?$/, '')
//                               .replace(/\/$/, '');
//
//   // Safely access path from context user
//   const imagePath = user?.profile?.profile_picture;
//
//   if (imagePath) {
//       if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//           profilePictureUrl = imagePath;
//       } else if (cleanedBackendBaseUrl) {
//           const cleanedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//           profilePictureUrl = `${cleanedBackendBaseUrl}/${cleanedImagePath}`;
//       } else {
//            console.error("Navbar - Cannot construct profile picture URL. VITE_API_URL missing or invalid.");
//       }
//   } else {
//       // This log will show if the path wasn't found in the user object from context
//       console.log("Navbar - No profile picture path found in user context, using default URL.");
//   }
//
//   // Log the final URL being used
//   console.log("Navbar - Final profilePictureUrl FOR IMG TAG:", profilePictureUrl);
//   // --- End Profile Picture URL Calculation ---
//
//   // Enhanced loading check to include magic link fetching
//   if (isAuthenticated && (isLoading || checkingPassword || fetchingMagicLink)) {
//     return <nav className="fixed top-0 z-30 w-full bg-gray-800 p-4 text-white dark:bg-black">Loading Auth, Password, and Magic Link...</nav>;
//   }
//
//   const isStaff = user?.is_staff === true;
//
//   // Conditionally set the notification icon color
//   const notificationIconColorClass = hasPassword
//       ? `${show ? "text-gray-200 hover:text-white" : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"}` // Default state
//       : 'text-red-500 hover:text-red-400 '; // Has the password to be set color
//
//   return (
//       <FadeIn>
//           <header className={`fixed top-0 z-30 w-full ${props.playPage ? "backdrop-blur-sm" : ""}`}>
//               <nav className={`transition duration-500 ease-in-out ${show ? "bg-black text-white" : ""} dark:bg-opacity-80 dark:backdrop-blur-sm ${show ? "dark:bg-black" : "dark:bg-gray-900/80"}`}>
//                   <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
//                       <div className="flex items-center justify-between h-16">
//                           {/* Left Section */}
//                           <div className="flex items-center">
//                               <div className="flex-shrink-0">
//                                   <Link to="/Welcome"><img className="h-10 w-auto cursor-pointer" src={show ? BeeIconInverted : BeeIcon} alt="Logo" /></Link>
//                               </div>
//                               {/* Desktop Nav Links */}
//                               <div className="hidden md:block">
//                                   <div className="flex items-baseline ml-10 space-x-4">
//                                       <Link to={"/"} className={`py-2 font-medium rounded-md hover:text-red-600 px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} transition-colors`}>
//                                            <FaHome className="inline-block ml-1 mr-2" /> Home
//                                       </Link>
//                                       <Link to={"/causes"} className={`py-2 font-medium rounded-md hover:text-red-600 px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} transition-colors`}>
//                                            <FaHands className="inline-block ml-1 mr-2" /> Causes
//                                       </Link>
//                                       <Link
//                                           to={"/palestineheart"}
//                                           className={`palestine-hover-flag py-2 font-medium rounded-md px-3 text-m transition-colors ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}
//                                       >
//                                           Palestine
//                                       </Link>
//                                         <div className="relative group">
//                                             <button type="button" className={`flex items-center py-2 font-medium rounded-md hover:text-blue-400 px-3 text-m ${show ? "text-blue-300" : "text-blue-600 dark:text-blue-400"} transition-colors focus:outline-none`} aria-haspopup="true">
//                                                 Shop
//                                                 <svg className="w-4 h-4 ml-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                                                     <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                                                 </svg>
//                                             </button>
//                                             <ul className="absolute hidden left-0 pt-2 w-48 group-hover:block pb-2 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40">
//                                                 {/* CORRECTED LINES START HERE */}
//                                                 <li><Link to="/new-shop" className="rounded-t-md block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Main Shop</Link></li>
//                                                 <li><Link to="/shop" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Social Shop</Link></li>
//                                                 {/* CORRECTED LINES END HERE */}
//                                             </ul>
//                                         </div>
//
//                                       <Link to={"/blog"} className={`py-2 font-medium rounded-md hover:text-red-600 px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} transition-colors`}>
//                                            <FaBookmark className="inline-block ml-1 mr-2" /> Blogs
//                                       </Link>
// {/*                                      <Link to={"/blog/create"} className={`py-2 font-medium rounded-md hover:text-blue-500 px-3 text-m ${show ? "text-gray-100" : "text-gray-800 dark:text-gray-300"} transition-colors`}*/}
// {/*>*/}
// {/*                                           <FaPaperPlane className="inline-block ml-1 mr-2" /> Post*/}
// {/*                                      </Link>*/}
//                                     <Link
//                                       to="/blog/create"
//                                       className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
//                                     >
//                                       <FaPaperPlane className="mb-2 mt-1 text-lg" /> Post
//                                     </Link>
//                                       {/*<Link to={"/engage"} className={`py-2 font-medium rounded-md hover:text-purple-400 px-3 text-m ${show ? "text-purple-300" : "text-purple-600 dark:text-purple-400"} transition-colors`}>Engage</Link>*/}
//                                         <Link to={"/engage_backend"} className={`py-2 font-medium rounded-md hover:text-purple-400 px-3 text-m ${show ? "text-purple-300" : "text-purple-600 dark:text-purple-400"} transition-colors`}>Engage</Link>
//
//                                       <Link to={"/about"} className={`py-2 font-medium rounded-md hover:text-red-600 px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} transition-colors`}>About Us</Link>
//
//                                       {/* Admin Dropdown Menu */}
//                                       {/*{isStaff && (*/}
//                                       {/*    <div className="relative group">*/}
//                                       {/*        <button type="button" className={`flex items-center py-2 font-medium rounded-md hover:text-yellow-400 px-3 text-m ${show ? "text-yellow-300" : "text-yellow-600 dark:text-yellow-400"} transition-colors focus:outline-none`} aria-haspopup="true"> Admin <svg className="w-4 h-4 ml-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg> </button>*/}
//                                       {/*        <ul className="absolute hidden left-0 pt-2 pb-2 w-48 group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40">*/}
//                                       {/*            <li>*/}
//                                       {/*                <a*/}
//
//
//
//                                     {isStaff && (
//                                           <Link to={"/dashboard"} className={`flex items-center py-2 font-medium rounded-md hover:text-yellow-400 px-3 text-m ${show ? "text-yellow-300" : "text-yellow-600 dark:text-yellow-400"} transition-colors focus:outline-none`}>Dashboard</Link>
//                                       )}
//                                       {isAuthenticated && (
//                                             <div className="relative group">
//                                                 <button type="button" className={`flex items-center py-2 font-medium rounded-md hover:text-blue-400 px-3 text-m ${show ? "text-blue-300" : "text-blue-600 dark:text-blue-400"} transition-colors focus:outline-none`} aria-haspopup="true">
//                                                     Friends
//                                                     <svg className="w-4 h-4 ml-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                                                         <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                                                     </svg>
//                                                 </button>
//                                                 <ul className="absolute hidden left-0 pt-2 w-48 group-hover:block pb-2 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40">
//                                                     {/* CORRECTED LINES START HERE */}
//                                                     <li><Link to="/myfriendships" className="rounded-t-md block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Friends</Link></li>
//                                                     <li><Link to="/my-public-profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Public Profile</Link></li>
//                                                     {/* CORRECTED LINES END HERE */}
//                                                 </ul>
//                                             </div>
//                                         )}
//                                       {/* Join Link */}
//                                       {!isAuthenticated && (
//                                           <Link to={"/signin"} className={`py-2 font-medium rounded-md hover:text-red-600 px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} transition-colors`}>Join</Link>
//                                       )}
//                                   </div>
//                               </div>
//                           </div>
//
//                           {/* Right Section */}
//                           <div className="flex items-center ml-auto">
//
//                               {/* User Name Display */}
//                               {isAuthenticated && user && (<span className={`py-2 font-medium lg:px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} hidden md:inline mr-4 transition-colors`} > {user.first_name || user.email} </span>)}
//
//                               {/* Notification Icon */}
//                               {isAuthenticated && (
//                                   <button
//                                       onClick={() => setShowPasswordModal(hasPassword === false)}
//                                       className={`hidden md:flex items-center p-1 rounded-full ${notificationIconColorClass} focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 mr-3`}
//                                       aria-label="Notifications"
//                                   >
//                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                                       </svg>
//                                   </button>
//                               )}
//
//                               {/* Profile Dropdown */}
//                               {isAuthenticated && user && (
//                                   <div className="relative group ml-3">
//                                       <Link to={"/profile"} className="block">
//                                           {/* Uses calculated URL, no onError */}
//                                           <img
//                                               className="h-10 w-10 md:h-12 md:w-12 rounded-full cursor-pointer border-2 border-transparent group-hover:border-white transition object-cover"
//                                               src={profilePictureUrl} // Use the calculated variable
//                                               alt="User Profile"
//                                           />
//                                       </Link>
//                                       <ul className="absolute hidden right-0 text-gray-700 dark:text-gray-200 pt-2 w-48 group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40">
//                                           {isStaff && (<li><a href="/admin/" target="_blank" rel="noopener noreferrer" className="rounded-t-md block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Django Admin</a></li>)}
//                                           <li><Link to={"/profile"} className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${!isStaff ? 'rounded-t-md' : ''}`}>Profile</Link></li>
//                                           <li><button onClick={logout} className="w-full text-left rounded-b-md block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Sign Out</button></li>
//                                       </ul>
//                                   </div>
//                               )}
//
//                               {/* Mobile Menu Button */}
//                               <div className="flex pl-4 -mr-2 md:hidden">
//                                   <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isOpen}>
//                                       <span className="sr-only">Open main menu</span>
//                                       {isOpen ? (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//                                       ) : (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>)}
//                                   </button>
//                               </div>
//                           </div>
//                       </div>
//                   </div>
//
//                   {/* Mobile Menu Content */}
//                   {isOpen && (
//                       <div className="md:hidden bg-black dark:bg-gray-800 w-full absolute left-0 top-16 shadow-lg z-30" id="mobile-menu">
//                           <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                               {/* ... Mobile Links (unchanged) ... */}
//                               <Link to={"/"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Home</Link>
//                               <Link to={"/causes"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Causes</Link>
//                               <Link to={"/palestine"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Palestine</Link>
//                               <Link to={"/shop"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Shop</Link>
//                               <Link to={"/blog"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Blog</Link>
//                               <Link to={"/blog/create"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Create a Blog </Link>
//                               <Link to={"/about"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">About Us</Link>
//
//                               {/* Admin Link (Mobile) */}
//                               {isStaff && (<a href="/admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-yellow-300 dark:text-yellow-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600" > Admin </a>)}
//
//                               {/* Auth Links (Mobile) */}
//                               <div className="border-t border-gray-700 pt-4 mt-3">
//                                   {!isAuthenticated ? (
//                                       <Link to={"/signin"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Join / Sign In</Link>
//                                   ) : (
//                                       <>
//                                           <Link to={"/profile"} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600">Profile</Link>
//                                           <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer" > Sign Out </button>
//                                       </>
//                                   )}
//                                   {isAuthenticated && magicLink && ( // Only show if authenticated AND magicLink is available
//                                                   <a
//                                                     href={magicLink} // Directly use the fetched magic link
//                                                     onClick={() => {
//                                                         setIsOpen(false); // Close mobile menu as before
//                                                         // Add an alert for user feedback
//                                                         // alert("Attempting to open the app... If it doesn't open, please ensure the app is installed.");
//                                                         // We do NOT call e.preventDefault() here.
//                                                         // The browser will automatically try to navigate to the deep link specified in the `href`
//                                                         // after the alert is dismissed by the user.
//                                                     }}
//                                                     className="w-full text-left block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
//                                                   >
//                                                     Open in App
//                                                   </a>
//                                                 )}
//                               </div>
//                           </div>
//                       </div>
//                   )}
//               </nav>
//               {/* Password Modal */}
//
//           </header>
//           <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
//                   <div className="p-6">
//                       <h2 className="text-lg font-bold text-gray-800">Set Your Password</h2>
//                       <p className="mt-2 text-gray-600">
//                           For full access and to enable email/password login, please set your password now.
//                       </p>
//                       <Link
//                             to="/setpassword"
//                             className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                             onClick={() => setShowPasswordModal(false)} // Close modal on link click
//                         >
//                             Set Password
//                         </Link>
//                   </div>
//               </Modal>
//       </FadeIn>
//   );
// }
//
// export default Navbar;


// frontend/src/components/layout/Navbar.tsx - SIMPLIFIED FOR PERSONAL WEBSITE

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from '../../../context/AuthContext.tsx'; // Corrected path from layout to contexts
//   import default_avatar from "../../../images/default_avatar.png"; // Corrected path
// // Placeholder if you don't have a specific icon or want text
// // import PersonalWebsiteLogo from "../../../images/PersonalWebsiteLogo.png"; // Example for a custom logo
//
// // FaHome for Home link, FaUserShield for Admin link
// import { FaHome, FaUserShield } from 'react-icons/fa';
//
// // Define expected User structure from AuthContext (adjust if needed)
// interface AuthUser {
//   id?: number;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   is_staff?: boolean;
//   profile?: {
//     profile_picture?: string | null; // Crucial field
//   } | null;
// }
//
// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false); // State for mobile menu
//   const [show, handleShow] = useState(false); // State for scroll effect
//
//   // Use the AuthUser type for the user from context
//   const { isAuthenticated, user, isLoading, logout } = useAuth() as {
//     isAuthenticated: boolean;
//     user: AuthUser | null;
//     isLoading: boolean;
//     logout: () => void;
//   };
//
//   // Effect for scroll-based styling (e.g., changing navbar background)
//   useEffect(() => {
//     const transitionNavBar = () => handleShow(window.scrollY > 80);
//     window.addEventListener("scroll", transitionNavBar);
//     return () => window.removeEventListener("scroll", transitionNavBar);
//   }, []);
//
//   // --- Profile Picture URL Calculation (Simplified Logic) ---
//   // Assuming a default avatar exists if no profile picture is set.
//   // Make sure to place a default_avatar.png in frontend/src/images/
//
//
//   let profilePictureUrl = default_avatar; // Your default avatar path
//
//   const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '')
//                               .replace(/\/api\/?$/, '')
//                               .replace(/\/$/, '');
//
//   const imagePath = user?.profile?.profile_picture;
//
//   if (imagePath) {
//       if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//           profilePictureUrl = imagePath;
//       } else if (cleanedBackendBaseUrl) {
//           const cleanedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//           profilePictureUrl = `${cleanedBackendBaseUrl}/${cleanedImagePath}`;
//       } else {
//            console.error("Navbar - Cannot construct profile picture URL. VITE_API_URL missing or invalid.");
//       }
//   }
//
//   if (isLoading) {
//     // Basic loading state for auth context
//     return (
//       <nav className="fixed top-0 z-30 w-full bg-gray-800 p-4 text-white flex items-center justify-center h-16">
//         Loading...
//       </nav>
//     );
//   }
//
//   const isStaff = user?.is_staff === true;
//
//   // Common Tailwind classes for links (for reusability)
//   const commonLinkClasses = `block px-3 py-2 font-medium rounded-md hover:bg-gray-700 transition-colors text-white`;
//
//
//   return (
//     <header className={`fixed top-0 z-30 w-full transition duration-500 ease-in-out ${show ? "bg-gray-900 shadow-md" : "bg-transparent"}`}>
//       <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Left Section: Logo and Desktop Nav Links */}
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               {/* Simplified Logo: Text or a generic icon */}
//               <Link to="/" className="text-xl font-bold text-white hover:text-gray-200">
//                 Stefano Tuveri
//               </Link>
//             </div>
//             {/* Desktop Nav Links */}
//             <div className="hidden md:block">
//               <div className="flex items-baseline ml-10 space-x-4">
//                 <Link to={"/"} className={commonLinkClasses}>
//                   <FaHome className="inline-block mr-2" /> Home
//                 </Link>
//                 <Link to={"/about"} className={commonLinkClasses}>
//                   About
//                 </Link>
//                 {/* Add more public links if needed, e.g., /projects, /contact */}
//
//                 {/* Admin Dashboard Link (only for staff) */}
//                 {isStaff && (
//                   <Link to={"/dashboard"} className={`${commonLinkClasses} text-yellow-300 hover:bg-gray-700`}>
//                     Dashboard
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//
//           {/* Right Section: User Info and Profile Dropdown */}
//           <div className="flex items-center ml-auto">
//             {isAuthenticated && user && (
//               <span className={`py-2 font-medium text-white hidden md:inline mr-4 transition-colors`}>
//                 {user.first_name || user.email}
//               </span>
//             )}
//
//             {/* Profile Dropdown */}
//             {isAuthenticated && user ? (
//               <div className="relative group ml-3">
//                 <Link to={"/profile"} className="block">
//                   <img
//                     className="h-10 w-10 rounded-full cursor-pointer border-2 border-transparent group-hover:border-white transition object-cover"
//                     src={profilePictureUrl}
//                     alt="User Profile"
//                   />
//                 </Link>
//                 <ul className="absolute hidden right-0 text-gray-700 bg-white shadow-lg rounded-md border border-gray-200 w-48 group-hover:block pb-2 z-40">
//                   {isStaff && (
//                     <li>
//                       <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="rounded-t-md block px-4 py-2 text-sm hover:bg-gray-100">
//                         <FaUserShield className="inline-block mr-2" /> Django Admin
//                       </a>
//                     </li>
//                   )}
//                   <li>
//                     <Link to={"/profile"} className={`block px-4 py-2 text-sm hover:bg-gray-100 ${!isStaff ? 'rounded-t-md' : ''}`}>
//                       Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <button onClick={logout} className="w-full text-left rounded-b-md block px-4 py-2 text-sm hover:bg-gray-100">
//                       Sign Out
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               // Auth Links (Join/Sign In) for unauthenticated users
//               <div className="flex items-center space-x-4">
//                 <Link to={"/login"} className={commonLinkClasses}>
//                   Login
//                 </Link>
//                 <Link to={"/register"} className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors`}>
//                   Register
//                 </Link>
//               </div>
//             )}
//
//             {/* Mobile Menu Button */}
//             <div className="flex pl-4 -mr-2 md:hidden">
//               <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isOpen}>
//                 <span className="sr-only">Open main menu</span>
//                 {isOpen ? (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//                 ) : (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>)}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//
//       {/* Mobile Menu Content */}
//       {isOpen && (
//         <div className="md:hidden bg-gray-900 w-full absolute left-0 top-16 shadow-lg z-30" id="mobile-menu">
//           <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <Link to={"/"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Home</Link>
//             <Link to={"/about"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>About</Link>
//             {isStaff && (<Link to={"/dashboard"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Dashboard</Link>)}
//
//             <div className="border-t border-gray-700 pt-4 mt-3">
//               {!isAuthenticated ? (
//                 <>
//                   <Link to={"/login"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Login</Link>
//                   <Link to={"/register"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} bg-blue-600 hover:bg-blue-700`}>Register</Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to={"/profile"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Profile</Link>
//                   {isStaff && (<a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Django Admin</a>)}
//                   <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 cursor-pointer">Sign Out</button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
//
// export default Navbar;

// frontend/src/components/layout/Navbar.tsx - FIXED & STYLED

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// DO NOT CHANGE THE FUCKING IMPORTS (as per your instruction)
import { useAuth } from '../../../context/AuthContext.tsx'; // Corrected path from layout to contexts (this was already here)
import default_avatar from "../../../images/default_avatar.png"; // Corrected path (this was already here)

// FaHome for Home link, FaUserShield for Admin link
import { FaHome, FaUserShield } from 'react-icons/fa';

// Define expected User structure from AuthContext (adjust if needed)
interface AuthUser {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  profile?: {
    profile_picture?: string | null; // Crucial field
  } | null;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [show, handleShow] = useState(false); // State for scroll effect

  // Use the AuthUser type for the user from context
  const { isAuthenticated, user, isLoading, logout } = useAuth() as {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    logout: () => void;
  };

  // Effect for scroll-based styling (e.g., changing navbar background)
  useEffect(() => {
    const transitionNavBar = () => handleShow(window.scrollY > 80);
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  // --- Profile Picture URL Calculation (Fixed Syntax) ---
  let profilePictureUrl = default_avatar; // Your default avatar path

  const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '')
                              .replace(/\/api\/?$/, ''); // Fixed regex syntax

  const imagePath = user?.profile?.profile_picture;

  if (imagePath) {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          profilePictureUrl = imagePath;
      } else if (cleanedBackendBaseUrl) {
          const cleanedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
          profilePictureUrl = `${cleanedBackendBaseUrl}/${cleanedImagePath}`;
      } else {
           console.error("Navbar - Cannot construct profile picture URL. VITE_API_URL missing or invalid.");
      }
  }

  if (isLoading) {
    // Basic loading state for auth context
    return (
      <nav className="fixed top-0 z-50 w-full bg-gray-900 p-4 text-white flex items-center justify-center h-16">
        Loading...
      </nav>
    );
  }

  const isStaff = user?.is_staff === true;

  // Common Tailwind classes for links (Fixed Syntax with backticks)
  const commonLinkClasses = `block px-3 py-2 font-medium rounded-md hover:bg-gray-700 transition-colors text-white`;

  return (
    // Fixed Syntax: template literal for className
    <header className={`fixed top-0 z-50 w-full transition duration-500 ease-in-out ${show ? "bg-gray-900 shadow-md" : "bg-gray-900"}`}> {/* Darker background (bg-gray-900) always, z-50 for visibility */}
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Desktop Nav Links */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Simplified Logo: Text or a generic icon */}
              <Link to="/" className="text-xl font-bold text-white hover:text-gray-200">
                Stefano Tuveri
              </Link>
            </div>
            {/* Desktop Nav Links */}
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                <Link to={"/"} className={commonLinkClasses}>
                  <FaHome className="inline-block mr-2" /> Home
                </Link>
                <Link to={"/about"} className={commonLinkClasses}>
                  About
                </Link>
                {/* Admin Dashboard Link (only for staff) */}
                {isStaff && (
                  <Link to={"/dashboard"} className={`${commonLinkClasses} text-yellow-300 hover:bg-gray-700`}>
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: User Info and Profile Dropdown */}
          <div className="flex items-center ml-auto">
            {isAuthenticated && user && (
              <span className={`py-2 font-medium text-white hidden md:inline mr-4 transition-colors`}>
                {user.first_name || user.email}
              </span>
            )}

            {/* Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative group ml-3">
                <Link to={"/profile"} className="block">
                  <img
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-transparent group-hover:border-white transition object-cover"
                    src={profilePictureUrl}
                    alt="User Profile"
                  />
                </Link>
                <ul className="absolute hidden right-0 text-gray-700 bg-white shadow-lg rounded-md border border-gray-200 w-48 group-hover:block pb-2 z-40">
                  {isStaff && (
                    <li>
                      <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="rounded-t-md block px-4 py-2 text-sm hover:bg-gray-100">
                        <FaUserShield className="inline-block mr-2" /> Django Admin
                      </a>
                    </li>
                  )}
                  <li>
                    <Link to={"/profile"} className={`block px-4 py-2 text-sm hover:bg-gray-100 ${!isStaff ? 'rounded-t-md' : ''}`}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="w-full text-left rounded-b-md block px-4 py-2 text-sm hover:bg-gray-100">
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Auth Links (Join/Sign In) for unauthenticated users
              <div className="flex items-center space-x-4">
                <Link to={"/login"} className={commonLinkClasses}>
                  Login
                </Link>
                {/* Fixed Register button color to match new color coding */}
                <Link to={"/register"} className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors`}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex pl-4 -mr-2 md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isOpen}>
                <span className="sr-only">Open main menu</span>
                {isOpen ? (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>)}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 w-full absolute left-0 top-16 shadow-lg z-30" id="mobile-menu">
          <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to={"/"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Home</Link>
            <Link to={"/about"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>About</Link>
            {isStaff && (<Link to={"/dashboard"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Dashboard</Link>)}

            <div className="border-t border-gray-700 pt-4 mt-3">
              {!isAuthenticated ? (
                <>
                  <Link to={"/login"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Login</Link>
                  {/* Fixed Register button color in mobile menu */}
                  <Link to={"/register"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} bg-green-600 hover:bg-green-700`}>Register</Link>
                </>
              ) : (
                <>
                  <Link to={"/profile"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Profile</Link>
                  {isStaff && (<a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Django Admin</a>)}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700 cursor-pointer">Sign Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;