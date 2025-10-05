// frontend/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext'; // Path to AuthContext
import * as api from '../../api';
import {useNavigate} from "react-router-dom"; // Path to main API functions

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth(); // login is needed to update context user
  const navigate = useNavigate(); // For potential redirect after logout/error

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [nameUpdateMessage, setNameUpdateMessage] = useState<string | null>(null);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);
  const [nameUpdateError, setNameUpdateError] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  const [updatingName, setUpdatingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login'); // Redirect if not authenticated when trying to access profile
    }
    // Update local state if user object changes (e.g., initial load or login)
    if (user) {
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
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

  const handleChangePassword = async (e: React.FormEvent) => {
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

  return (
    <>
      <Helmet>
        <title>Stefano Tuveri - My Profile</title>
        <meta name="description" content="Manage your personal profile and password." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

        {/* Profile Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-lg">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> {user.is_staff ? 'Admin' : 'Basic User'}</p> {/* Simple status display */}
          </div>
        </div>

        {/* Update Name Form */}
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

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
          {passwordChangeMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{passwordChangeMessage}</div>}
          {passwordChangeError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{passwordChangeError}</div>}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
              <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
              <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
              <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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