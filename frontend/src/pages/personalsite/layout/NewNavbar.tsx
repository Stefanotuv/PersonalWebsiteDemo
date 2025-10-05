import React, { useState, useEffect } from "react";
import FadeIn from "../components/FadeIn.tsx"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext.tsx'; // Verify path
import api from '../../../api.ts'; // Import API

import BeeIcon from "../../../images/BeeIcon.png"; // Verify path
import BeeIconInverted from "../../../images/BeeIconInverted.png"; // Verify path
import default_avatar from "../../../images/default_avatar.png";

// Import React Icons
import { FaBookmark,FaShoppingCart, FaEdit, FaPlus, FaHome, FaHandsHelping, FaHands, FaAmbulance, FaBookOpen, FaClipboardList, FaPaperPlane, FaUserShield, FaChevronDown, FaCog } from 'react-icons/fa'; // Added FaCog for admin settings

// Define expected User structure from AuthContext (adjust if needed)
interface AuthUser {
  id?: number; // Or string?
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  profile?: {
    profile_picture?: string | null; // Crucial field
  } | null;
}

// Modal component (no changes needed - good as is)
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" onClick={onClose}>
            <div className="relative p-4 bg-white rounded shadow-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 m-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

function NewNavbar(props: { playPage?: boolean }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [show, handleShow] = useState(false); // Scroll-triggered navbar style
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // NEW STATE FOR MAGIC LINK
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [fetchingMagicLink, setFetchingMagicLink] = useState(false); // To indicate loading

  // Use a more specific type for the user from context
  const { isAuthenticated, user, isLoading, logout } = useAuth() as {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    logout: () => void;
  };

  // Existing useEffect for password status
  useEffect(() => {
    const checkPasswordStatus = async () => {
        setCheckingPassword(true);
        try {
            const response = await api.get('/backend/api/user/has-password-set/');
            setHasPassword(response.data.has_password);
        } catch (err) {
            console.error("Error checking password status:", err);
            setHasPassword(false); // Fallback solution
        } finally {
            setCheckingPassword(false);
        }
    };

    if (isAuthenticated) { // Only check if authenticated
        checkPasswordStatus();
    } else {
        setHasPassword(null); // Reset if not authenticated
    }
  }, [isAuthenticated]); // Dependency on isAuthenticated

  useEffect(() => {
    // Only show modal if authenticated, password not set, and checking is done
    if (isAuthenticated && hasPassword === false && !checkingPassword) {
        setShowPasswordModal(true);
    } else {
        setShowPasswordModal(false);
    }
  }, [isAuthenticated, hasPassword, checkingPassword]); // Added checkingPassword to dependencies

  // NEW useEffect for fetching the magic link
  useEffect(() => {
    const fetchAndSetMagicLink = async () => {
      if (!isAuthenticated) {
        setMagicLink(null);
        setFetchingMagicLink(false);
        return;
      }

      setFetchingMagicLink(true); // Indicate that we are fetching
      try {
        const response = await api.post("/generate-magic-link/");
        if (response.data && response.data.link) {
          setMagicLink(response.data.link);
        } else {
          console.warn("Magic link API response did not contain a 'link' field:", response.data);
          setMagicLink(null); // Ensure link is null if not provided
        }
      } catch (err) {
        console.error("Failed to generate magic link:", err);
        setMagicLink(null); // Clear link on error
      } finally {
        setFetchingMagicLink(false); // Done fetching
      }
    };

    fetchAndSetMagicLink();
  }, [isAuthenticated]); // Re-run when authentication status changes

  useEffect(() => {
    const transitionNavBar = () => handleShow(window.scrollY > 80);
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  // --- Profile Picture URL Calculation ---
  let profilePictureUrl = default_avatar; // Your default avatar path

  const cleanedBackendBaseUrl = (import.meta.env.VITE_API_URL || '')
                              .replace(/\/api\/?$/, '')
                              .replace(/\/$/, '');

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

  // --- End Profile Picture URL Calculation ---

  // Enhanced loading check to include magic link fetching
  if (isAuthenticated && (isLoading || checkingPassword || fetchingMagicLink)) {
    return (
        <nav className="fixed top-0 z-30 w-full bg-gray-800 p-4 text-white dark:bg-black text-center font-semibold text-lg flex items-center justify-center h-16">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        </nav>
    );
  }

  const isStaff = user?.is_staff === true;

  // Conditionally set the notification icon color
  const notificationIconColorClass = hasPassword === false // Explicitly checking for false
      ? 'text-red-500 hover:text-red-400 animate-pulse' // Pulsing if password needs setting
      : `${show ? "text-gray-200 hover:text-white" : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"}`;

  // Common link styles for smooth transitions
  const commonLinkClasses = `block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ease-in-out`;
  const desktopLinkClasses = `py-2 font-medium rounded-md px-3 text-m relative group transition-all duration-300 ease-in-out hover:scale-105 active:scale-95`;

  return (
      <FadeIn>
          <header className={`fixed top-0 z-30 w-full`}>
              <nav className={`transition-all duration-500 ease-in-out ${show ? "bg-black shadow-lg backdrop-blur-md text-white" : "bg-white/90 shadow-md dark:bg-gray-900/80 backdrop-blur-sm"} dark:text-white`}>
                  <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                          {/* Left Section */}
                          <div className="flex items-center">
                              <div className="flex-shrink-0">
                                  <Link to="/Welcome" className="transform hover:scale-110 transition-transform duration-300 ease-in-out">
                                      <img className="h-10 w-auto cursor-pointer" src={show ? BeeIconInverted : BeeIcon} alt="Logo" />
                                  </Link>
                              </div>
                              {/* Desktop Nav Links */}
                              <div className="hidden md:block">
                                  <div className="flex items-baseline ml-10 space-x-4">
                                      <Link to={"/"} className={`${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}>
                                           <FaHome className="inline-block ml-1 mr-2" /> Home
                                      </Link>
                                      <Link to={"/causes"} className={`${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}>
                                           <FaHands className="inline-block ml-1 mr-2" /> Causes
                                      </Link>
                                      <Link
                                          to={"/palestineheart"}
                                          className={`palestine-hover-flag ${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}
                                      >
                                          Palestine
                                      </Link>
                                      {/* Shop Dropdown */}
                                      <div className="relative group">
                                          <button type="button" className={`${desktopLinkClasses} flex items-center ${show ? "text-blue-300" : "text-blue-600 dark:text-blue-400"} focus:outline-none`} aria-haspopup="true">
                                              Shop
                                              <FaChevronDown className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                                          </button>
                                          <ul className="absolute right-0 pt-2 pb-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40
                                                     opacity-0 invisible group-hover:visible group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-top transition-all duration-300 ease-out">
                                                <li><Link to="/new-shop" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">Main Shop</Link></li>
                                                <li><Link to="/shop" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">Social Shop</Link></li>
                                          </ul>
                                      </div>

                                      <Link to={"/blog"} className={`${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}>
                                           <FaBookmark className="inline-block ml-1 mr-2" /> Blogs
                                      </Link>
                                    <Link
                                      to="/blog/create"
                                      className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                                    >
                                      <FaPaperPlane className="mb-2 mt-1 text-lg" /> Post
                                    </Link>
                                      <Link to={"/engage_backend"} className={`${desktopLinkClasses} ${show ? "text-purple-300" : "text-purple-600 dark:text-purple-400"} hover:text-purple-400`}>Engage</Link>

                                      <Link to={"/about"} className={`${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}>About Us</Link>

                                      {/* Friends Dropdown */}
                                      {isAuthenticated && (
                                          <div className="relative group">
                                              <button type="button" className={`${desktopLinkClasses} flex items-center ${show ? "text-blue-300" : "text-blue-600 dark:text-blue-400"} focus:outline-none`} aria-haspopup="true">
                                                  Friends
                                                  <FaChevronDown className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                                              </button>
                                              <ul className="absolute right-0 pt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40
                                                         opacity-0 invisible group-hover:visible group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-top transition-all duration-300 ease-out">
                                                    <li><Link to="/myfriendships" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">Friends</Link></li>
                                                    <li><Link to="/my-public-profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">Public Profile</Link></li>
                                              </ul>
                                          </div>
                                      )}
                                      {/* Join Link */}
                                      {!isAuthenticated && (
                                          <Link to={"/signin"} className={`${desktopLinkClasses} ${show ? "text-white" : "text-black dark:text-gray-200"} hover:text-red-600`}>Join</Link>
                                      )}
                                  </div>
                              </div>
                          </div>

                          {/* Right Section */}
                          <div className="flex items-center ml-auto">

                              {/* User Name Display */}
                              {isAuthenticated && user && (<span className={`py-2 font-medium lg:px-3 text-m ${show ? "text-white" : "text-black dark:text-gray-200"} hidden md:inline mr-4 transition-colors`} > {user.first_name || user.email} </span>)}

                              {/* Notification Icon */}
                              {isAuthenticated && (
                                  <button
                                      onClick={() => setShowPasswordModal(hasPassword === false)}
                                      className={`hidden md:flex items-center p-1 rounded-full ${notificationIconColorClass} focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 mr-3 transition-all duration-300 hover:scale-110 active:scale-95`}
                                      aria-label="Notifications"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                      </svg>
                                  </button>
                              )}

                              {/* Profile Dropdown */}
                              {isAuthenticated && user ? (
                                  <div className="relative group ml-3">
                                      <Link to={"/profile"} className="block" aria-label="Profile">
                                          <img
                                              className="h-10 w-10 md:h-12 md:w-12 rounded-full cursor-pointer border-2 border-transparent group-hover:border-white transition-all duration-300 object-cover hover:scale-105 active:scale-95"
                                              src={profilePictureUrl}
                                              alt="User Profile"
                                          />
                                      </Link>
                                      <ul className="absolute right-0 text-gray-700 dark:text-gray-200 pt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-40
                                                 opacity-0 invisible group-hover:visible group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-top transition-all duration-300 ease-out">
                                          <li><Link to={"/profile"} className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-t-md`}>Profile</Link></li>
                                          <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                                          <li><Link to={"/my-main-shop-orders"} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"><FaShoppingCart className="inline-block mr-2 text-blue-300" /> My Orders </Link></li>
                                          <li><Link to={"/orders"} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"><FaShoppingCart className="inline-block mr-2 text-blue-600" /> My Social Orders </Link></li>

                                          {isStaff && (
                                              <>
                                                  <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                                                  <li><Link to={"/dashboard"} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"><FaCog className="inline-block mr-2 text-yellow-500" /> Admin Dashboard</Link></li>

                                                  <li><a href="/admin/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"><FaUserShield className="inline-block mr-2 text-green-500" /> Django Admin</a></li>
                                              </>
                                          )}
                                          <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                                          <li><button onClick={logout} className="w-full text-left rounded-b-md block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">Sign Out</button></li>
                                      </ul>
                                  </div>
                              ) : (
                                  // If not authenticated, still show a default avatar or login icon
                                  !isLoading && ( // Only show if not authenticated AND not loading
                                    <Link to={"/signin"} className="hidden md:flex items-center p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Sign In">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </Link>
                                  )
                              )}

                              {/* Mobile Menu Button */}
                              <div className="flex pl-4 -mr-2 md:hidden">
                                  <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300" aria-controls="mobile-menu" aria-expanded={isOpen}>
                                      <span className="sr-only">Open main menu</span>
                                      {isOpen ? (
                                          <svg className="block h-6 w-6 transform rotate-90 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                      ) : (
                                          <svg className="block h-6 w-6 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                      )}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Mobile Menu Content */}
                  <div className={`md:hidden absolute left-0 top-16 w-full shadow-lg z-30 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} id="mobile-menu">
                      <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black dark:bg-gray-800">
                          <Link to={"/"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Home</Link>
                          <Link to={"/causes"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Causes</Link>
                          <Link to={"/palestineheart"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Palestine</Link>
                          <Link to={"/new-shop/"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Main Shop</Link> {/* Specific shop links for mobile */}
                          <Link to={"/shop/"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Social Shop</Link>
                          <Link to={"/blog"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Blog</Link>
                          <Link to={"/blog/create"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Create a Blog </Link>
                          <Link to={"/engage_backend"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-purple-300 hover:bg-gray-700 dark:hover:bg-gray-600`}>Engage</Link>
                          <Link to={"/about"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>About Us</Link>

                          {/* Friends Links (Mobile) */}
                          {isAuthenticated && (
                              <>
                                  <Link to={"/myfriendships"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Friends</Link>
                                  <Link to={"/my-public-profile/"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Public Profile</Link>
                              </>
                          )}

                          {/* Auth Links (Mobile) */}
                          <div className="border-t border-gray-700 pt-4 mt-3">
                              {!isAuthenticated ? (
                                  <Link to={"/signin"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white hover:bg-gray-700 dark:hover:bg-gray-600`}>Join / Sign In</Link>
                              ) : (
                                  <>
                                      <Link to={"/profile"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600`}>Profile</Link>
                                      {isStaff && (
                                          <>
                                            <li className="border-t border-gray-700 my-1"></li>
                                            <Link to={"/dashboard"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300 hover:bg-gray-700 dark:hover:bg-gray-600`}><FaCog className="inline-block mr-2" /> Admin Dashboard</Link>
                                            <a href="/admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-green-300 hover:bg-gray-700 dark:hover:bg-gray-600`}><FaUserShield className="inline-block mr-2" /> Django Admin</a>
                                          </>
                                      )}
                                      <button onClick={() => { logout(); setIsOpen(false); }} className={`w-full text-left ${commonLinkClasses} text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer`} > Sign Out </button>
                                  </>
                              )}
                              {isAuthenticated && magicLink && ( // Only show if authenticated AND magicLink is available
                                              <a
                                                href={magicLink} // Directly use the fetched magic link
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    // Optionally add a subtle feedback, though opening app might hijack browser
                                                    // alert("Attempting to open the app...");
                                                }}
                                                className={`${commonLinkClasses} text-green-400 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer`}
                                              >
                                                Open in App
                                              </a>
                                            )}
                          </div>
                      </div>
                  </div>
              </nav>

          </header>
          {/* Password Modal */}
              <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
                  <div className="p-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">Important: Set Your Password!</h2>
                      <p className="mt-2 text-gray-600 text-lg">
                          You've logged in using a social account or magic link. To fully secure your account and enable email/password login, please set your password now.
                      </p>
                      <Link
                            to="/setpassword"
                            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                            onClick={() => setShowPasswordModal(false)} // Close modal on link click
                        >
                            Set Password Now
                        </Link>
                  </div>
              </Modal>
      </FadeIn>
  );
}

export default NewNavbar;