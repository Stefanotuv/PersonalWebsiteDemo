import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import { FaHome, FaUserShield } from 'react-icons/fa';
import { SITE_OWNER_FULL_NAME } from '../components/siteConfig.ts';
interface AuthUser {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, handleShow] = useState(false);

  const { isAuthenticated, user, isLoading, logout } = useAuth() as {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    logout: () => void;
  };

  useEffect(() => {
    const transitionNavBar = () => handleShow(window.scrollY > 80);
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  if (isLoading) {
    return (
      <nav className="fixed top-0 z-50 w-full bg-gray-900 p-4 text-white flex items-center justify-center h-16">
        Loading...
      </nav>
    );
  }

  const isStaff = user?.is_staff === true;
  const commonLinkClasses = `block px-3 py-2 font-medium rounded-md hover:bg-gray-700 transition-colors text-white`;

  return (
    <header className={`fixed top-0 z-50 w-full transition duration-500 ease-in-out ${show ? "bg-gray-900 shadow-md" : "bg-gray-900"}`}>
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Desktop Nav Links */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-white hover:text-gray-200">
                {SITE_OWNER_FULL_NAME}
              </Link>
            </div>
            {/* Desktop Nav Links */}
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                <Link to={"/"} className={commonLinkClasses}>
                  <FaHome className="inline-block mr-2" /> Home
                </Link>
                <Link to={"/cv"} className={commonLinkClasses}>
                  CV
                </Link>
                <Link to={"/on-the-web"} className={commonLinkClasses}>
                  On the Web
                </Link>
                <Link to={"/about"} className={commonLinkClasses}>
                  About
                </Link>
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
            {isAuthenticated && user ? (
              // Display email and dropdown for authenticated users
              <div className="relative group flex items-center space-x-3">
                <span className={`py-2 font-medium text-white hidden md:inline transition-colors`}>
                  {user.first_name || user.email}
                </span>
                <div className="relative">
                    <button type="button" className="flex items-center text-white focus:outline-none py-2 px-3 rounded-md hover:bg-gray-700 transition-colors" aria-haspopup="true">
                        <span className="sr-only">Open user menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <ul className="absolute hidden right-0 text-gray-700 bg-white shadow-lg rounded-md border border-gray-200 w-48 group-hover:block pb-2 z-40">
                        {isStaff && (
                        <li>
                            <a href="https://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="rounded-t-md block px-4 py-2 text-sm hover:bg-gray-100">
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
              </div>
            ) : (
              // --- THIS IS THE CHANGE ---
              // Auth Links (Login/Register) for unauthenticated users.
              // 'hidden' makes it invisible on mobile. 'md:flex' makes it visible on medium screens and up.
              <div className="hidden md:flex items-center space-x-4">
                <Link to={"/login"} className={commonLinkClasses}>
                  Login
                </Link>
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
            <Link to={"/cv"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>CV</Link>
            <Link to={"/on-the-web"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>On the Web</Link>
            <Link to={"/about"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>About</Link>
            {isStaff && (<Link to={"/dashboard"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Dashboard</Link>)}
            {isStaff && (<Link to={"/admin/documents"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-orange-300`}>Docs Admin</Link>)}
            {isStaff && (<Link to={"/admin/photos"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-pink-300`}>Photos Admin</Link>)}

            <div className="border-t border-gray-700 pt-4 mt-3">
              {!isAuthenticated ? (
                <>
                  <Link to={"/login"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Login</Link>
                  <Link to={"/register"} onClick={() => setIsOpen(false)} className={`${commonLinkClasses} bg-green-600 hover:bg-green-700`}>Register</Link>
                </>
              ) : (
                <>
                  <Link to={"/profile"} onClick={() => setIsOpen(false)} className={commonLinkClasses}>Profile</Link>
                  {isStaff && (<a href="https://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={`${commonLinkClasses} text-yellow-300`}>Django Admin</a>)}
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