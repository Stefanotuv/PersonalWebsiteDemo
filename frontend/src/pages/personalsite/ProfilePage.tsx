// // frontend/src/pages/ProfilePage.tsx
// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from '../../context/AuthContext'; // Path to AuthContext
// import * as api from '../../api';
// import {useNavigate} from "react-router-dom"; // Path to main API functions
// import { SITE_OWNER_FULL_NAME, CV_PAGE_DOWNLOAD_FILENAME, CV_PAGE_ASK_MORE_INFO_MESSAGE } from './components/siteConfig.ts';
//
// const ProfilePage: React.FC = () => {
//   const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth(); // login is needed to update context user
//   const navigate = useNavigate(); // For potential redirect after logout/error
//
//   const [firstName, setFirstName] = useState(user?.first_name || '');
//   const [lastName, setLastName] = useState(user?.last_name || '');
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//
//   const [nameUpdateMessage, setNameUpdateMessage] = useState<string | null>(null);
//   const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);
//   const [nameUpdateError, setNameUpdateError] = useState<string | null>(null);
//   const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
//
//   const [updatingName, setUpdatingName] = useState(false);
//   const [changingPassword, setChangingPassword] = useState(false);
//
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       navigate('/login'); // Redirect if not authenticated when trying to access profile
//     }
//     // Update local state if user object changes (e.g., initial load or login)
//     if (user) {
//         setFirstName(user.first_name || '');
//         setLastName(user.last_name || '');
//     }
//   }, [authLoading, isAuthenticated, user, navigate]);
//
//
//   const handleNameUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUpdatingName(true);
//     setNameUpdateMessage(null);
//     setNameUpdateError(null);
//
//     if (!user) {
//         setNameUpdateError("User not logged in.");
//         setUpdatingName(false);
//         return;
//     }
//
//     try {
//         const updatedUser = await api.updateUserProfile({
//             first_name: firstName,
//             last_name: lastName
//         });
//         // Update the user in AuthContext to reflect changes immediately
//         await login(localStorage.getItem('access') || '', localStorage.getItem('refresh') || '', updatedUser);
//         setNameUpdateMessage("Profile updated successfully!");
//     } catch (err: any) {
//         console.error("Name update error:", err.response?.data || err.message);
//         setNameUpdateError(err.response?.data?.detail || "Failed to update profile.");
//     } finally {
//         setUpdatingName(false);
//     }
//   };
//
//   const handleChangePassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setChangingPassword(true);
//     setPasswordChangeMessage(null);
//     setPasswordChangeError(null);
//
//     if (!user) {
//         setPasswordChangeError("User not logged in.");
//         setChangingPassword(false);
//         return;
//     }
//     if (newPassword !== confirmNewPassword) {
//         setPasswordChangeError("New passwords do not match.");
//         setChangingPassword(false);
//         return;
//     }
//     if (newPassword.length < 8) {
//         setPasswordChangeError("New password must be at least 8 characters long.");
//         setChangingPassword(false);
//         return;
//     }
//
//     try {
//         await api.changePassword(oldPassword, newPassword);
//         setPasswordChangeMessage("Password changed successfully!");
//         setOldPassword('');
//         setNewPassword('');
//         setConfirmNewPassword('');
//     } catch (err: any) {
//         console.error("Password change error:", err.response?.data || err.message);
//         setPasswordChangeError(err.response?.data?.detail || "Failed to change password. Check old password.");
//     } finally {
//         setChangingPassword(false);
//     }
//   };
//
//
//   if (authLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center text-blue-600">
//         <p className="animate-pulse">Loading profile...</p>
//       </div>
//     );
//   }
//
//   if (!isAuthenticated || !user) {
//     return null; // Redirect is handled by useEffect
//   }
//
//   return (
//     <>
//       <Helmet>
//         <title>{SITE_OWNER_FULL_NAME} - My Profile</title>
//         <meta name="description" content="Manage your personal profile and password." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
//
//         {/* Profile Details */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-lg">
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Status:</strong> {user.is_staff ? 'Admin' : 'Basic User'}</p> {/* Simple status display */}
//           </div>
//         </div>
//
//         {/* Update Name Form */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Personal Details</h2>
//           {nameUpdateMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{nameUpdateMessage}</div>}
//           {nameUpdateError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{nameUpdateError}</div>}
//           <form onSubmit={handleNameUpdate} className="space-y-4">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
//               <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
//               <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
//             </div>
//             <button
//               type="submit"
//               disabled={updatingName}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {updatingName ? 'Updating...' : 'Update Name'}
//             </button>
//           </form>
//         </div>
//
//         {/* Change Password Form */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
//           {passwordChangeMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{passwordChangeMessage}</div>}
//           {passwordChangeError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{passwordChangeError}</div>}
//           <form onSubmit={handleChangePassword} className="space-y-4">
//             <div>
//               <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
//               <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
//             </div>
//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
//               <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
//             </div>
//             <div>
//               <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
//               <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
//             </div>
//             <button
//               type="submit"
//               disabled={changingPassword}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {changingPassword ? 'Changing...' : 'Change Password'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default ProfilePage;

// frontend/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext'; // Path to AuthContext
import * as api from '../../api';
import {useNavigate} from "react-router-dom"; // Path to main API functions
import { SITE_OWNER_FULL_NAME, CV_PAGE_DOWNLOAD_FILENAME, CV_PAGE_ASK_MORE_INFO_MESSAGE } from './components/siteConfig.ts';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth(); // login is needed to update context user
  const navigate = useNavigate(); // For potential redirect after logout/error

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // --- NEW STATE FOR PROFILE PICTURE ---
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  // Assume user.profile is available from the updated UserSerializer
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(user?.profile?.profile_picture || null);
  const [pictureUpdateMessage, setPictureUpdateMessage] = useState<string | null>(null);
  const [pictureUpdateError, setPictureUpdateError] = useState<string | null>(null);
  const [updatingPicture, setUpdatingPicture] = useState(false);
  // --- END NEW STATE ---

  const [nameUpdateMessage, setNameUpdateMessage] = useState<string | null>(null);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);
  const [nameUpdateError, setNameUpdateError] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  const [updatingName, setUpdatingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // --- NEW STATE FOR PASSWORD TOGGLE ---
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login'); // Redirect if not authenticated when trying to access profile
    }
    // Update local state if user object changes (e.g., initial load or login)
    if (user) {
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        // --- UPDATE PICTURE URL STATE ON USER CHANGE ---
        setProfilePictureUrl(user.profile?.profile_picture || null);
        // --- END UPDATE ---
    }
  }, [authLoading, isAuthenticated, user, navigate]);


  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingName(true);
    setNameUpdateMessage(null);
    setNameUpdateError(null);

    if (!user) {
        setNameUpdateError("User not logged in.");
        setUpdatingName(false);
        return;
    }

    try {
        const updatedUser = await api.updateUserProfile({
            first_name: firstName,
            last_name: lastName
        });
        // Update the user in AuthContext to reflect changes immediately
        await login(localStorage.getItem('access') || '', localStorage.getItem('refresh') || '', updatedUser);
        setNameUpdateMessage("Profile updated successfully!");
    } catch (err: any) {
        console.error("Name update error:", err.response?.data || err.message);
        setNameUpdateError(err.response?.data?.detail || "Failed to update profile.");
    } finally {
        setUpdatingName(false);
    }
  };

  // --- NEW FUNCTION: HANDLE PICTURE UPDATE ---
  const handlePictureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setProfilePictureFile(e.target.files[0]);
        setPictureUpdateMessage(null);
        setPictureUpdateError(null);
    }
  }

  const handlePictureUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPicture(true);
    setPictureUpdateMessage(null);
    setPictureUpdateError(null);

    if (!user) {
        setPictureUpdateError("User not logged in.");
        setUpdatingPicture(false);
        return;
    }
    if (!profilePictureFile) {
        setPictureUpdateError("Please select a file to upload.");
        setUpdatingPicture(false);
        return;
    }

    const formData = new FormData();
    formData.append('profile_picture', profilePictureFile);

    try {
        const res = await api.updateUserProfilePicture(formData);

        // Update local picture URL state
        setProfilePictureUrl(res.profile_picture);
        setProfilePictureFile(null); // Clear file input state

        // Re-fetch user profile to update AuthContext and re-render component properly
        // This is necessary because the picture update is on a nested model (UserProfile)
        // and AuthContext only holds the top-level user object.
        const updatedUser = await api.getUserProfile();
        await login(localStorage.getItem('access') || '', localStorage.getItem('refresh') || '', updatedUser);

        setPictureUpdateMessage("Profile picture updated successfully!");

    } catch (err: any) {
        console.error("Picture update error:", err.response?.data || err.message);
        setPictureUpdateError(err.response?.data?.profile_picture || err.response?.data?.detail || "Failed to update profile picture.");
    } finally {
        setUpdatingPicture(false);
    }
  }
  // --- END NEW FUNCTION ---


  const handleChangePassword = async (e: React.FormEvent) => {
// ... (handleChangePassword remains unchanged) ...
// ... (Original handleChangePassword code) ...
    e.preventDefault();
    setChangingPassword(true);
    setPasswordChangeMessage(null);
    setPasswordChangeError(null);

    if (!user) {
        setPasswordChangeError("User not logged in.");
        setChangingPassword(false);
        return;
    }
    if (newPassword !== confirmNewPassword) {
        setPasswordChangeError("New passwords do not match.");
        setChangingPassword(false);
        return;
    }
    if (newPassword.length < 8) {
        setPasswordChangeError("New password must be at least 8 characters long.");
        setChangingPassword(false);
        return;
    }

    try {
        await api.changePassword(oldPassword, newPassword);
        setPasswordChangeMessage("Password changed successfully!");
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    } catch (err: any) {
        console.error("Password change error:", err.response?.data || err.message);
        setPasswordChangeError(err.response?.data?.detail || "Failed to change password. Check old password.");
    } finally {
        setChangingPassword(false);
    }
  };


  if (authLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-blue-600">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect is handled by useEffect
  }

  // Use a default avatar if no profile picture is set
  const defaultAvatar = 'https://via.placeholder.com/150?text=No+Avatar';
  const avatarUrl = profilePictureUrl ? profilePictureUrl : defaultAvatar;

  return (
    <>
      <Helmet>
        <title>{SITE_OWNER_FULL_NAME} - My Profile</title>
        <meta name="description" content="Manage your personal profile and password." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

        {/* Profile Details (MODIFIED TO SHOW AVATAR) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
                <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-blue-200 shadow-md"
                    src={avatarUrl}
                    alt={`${user.first_name}'s Profile`}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 text-gray-700 text-lg">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Status:</strong> {user.is_staff ? 'Admin' : 'Basic User'}</p> {/* Simple status display */}
            </div>
          </div>
        </div>

        {/* Update Profile Picture Form (NEW SECTION) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile Picture</h2>
          {pictureUpdateMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{pictureUpdateMessage}</div>}
          {pictureUpdateError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{pictureUpdateError}</div>}
          <form onSubmit={handlePictureUpdate} className="space-y-4">
            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Choose Picture:</label>
              <input
                type="file"
                id="profilePicture"
                onChange={handlePictureFileChange}
                accept="image/*"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPicture || !profilePictureFile}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {updatingPicture ? 'Uploading...' : 'Upload Picture'}
            </button>
          </form>
        </div>


        {/* Update Name Form (remains unchanged) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Personal Details</h2>
          {nameUpdateMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{nameUpdateMessage}</div>}
          {nameUpdateError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{nameUpdateError}</div>}
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
              <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button
              type="submit"
              disabled={updatingName}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {updatingName ? 'Updating...' : 'Update Name'}
            </button>
          </form>
        </div>

        {/* Change Password Form (remains unchanged) */}
        {/*<div className="bg-white p-6 rounded-lg shadow-md mb-8">*/}
        {/*  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>*/}
        {/*  {passwordChangeMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{passwordChangeMessage}</div>}*/}
        {/*  {passwordChangeError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{passwordChangeError}</div>}*/}
        {/*  <form onSubmit={handleChangePassword} className="space-y-4">*/}
        {/*    <div>*/}
        {/*      <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>*/}
        {/*      <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>*/}
        {/*      <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>*/}
        {/*      <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />*/}
        {/*    </div>*/}
        {/*    <button*/}
        {/*      type="submit"*/}
        {/*      disabled={changingPassword}*/}
        {/*      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
        {/*    >*/}
        {/*      {changingPassword ? 'Changing...' : 'Change Password'}*/}
        {/*    </button>*/}
        {/*  </form>*/}
        {/*</div>*/}

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
          {passwordChangeMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{passwordChangeMessage}</div>}
          {passwordChangeError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{passwordChangeError}</div>}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {showOldPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.05m8.885 8.885h1.125a1.125 1.125 0 001.125-1.125V12.75M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 14.25h-1.125M5.625 14.25H4.5M10.875 10.875l-1.125-1.125" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {showNewPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.05m8.885 8.885h1.125a1.125 1.125 0 001.125-1.125V12.75M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 14.25h-1.125M5.625 14.25H4.5M10.875 10.875l-1.125-1.125" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {showConfirmNewPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.05m8.885 8.885h1.125a1.125 1.125 0 001.125-1.125V12.75M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 14.25h-1.125M5.625 14.25H4.5M10.875 10.875l-1.125-1.125" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </>
  );
};

export default ProfilePage;