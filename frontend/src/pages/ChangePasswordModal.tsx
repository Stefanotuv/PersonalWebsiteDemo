
// src/components/UserProfile/ChangePasswordModal.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import api from '../api'; // Adjust path as needed
import {
    ExclamationCircleIcon,
    CheckCircleIcon,
    EyeIcon,        // Import Eye icon
    EyeSlashIcon    // Import EyeSlash icon
} from '@heroicons/react/24/solid';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // State for password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset form state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(null);
            setSuccessMessage(null);
            setIsLoading(false);
            // Reset visibility states too
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // --- handleSubmit logic remains the same ---
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Basic frontend validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All password fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) { // Example minimum length
             setError("New password must be at least 8 characters long.");
             return;
        }
         if (newPassword === currentPassword) {
             setError("New password cannot be the same as the current password.");
             return;
         }


        setIsLoading(true);

        //  // --- THIS IS THE CRITICAL PART ---
        // const payload = {
        //     current_password: currentPassword, // Use backend expected key (likely snake_case)
        //     new_password: newPassword,       // Use backend expected key (likely snake_case)
        //     // confirm_new_password: confirmPassword, // Backend might require confirmation too, check API docs
        // };
        // // --- END CRITICAL PART ---

        try {
            const response = await api.post('/backend/api/user/change-password/', {
                old_password: currentPassword,
                new_password: newPassword,
                new_password2: confirmPassword,
            });

            console.log("Change password response:", response);
            setSuccessMessage("Password changed successfully!");
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err: any) {
            console.error("Change password error:", err.response?.data || err.message);
            let errorMessage = "Failed to change password.";
            if (err.response?.data) {
                 // Handle common DRF error structures
                if (typeof err.response.data === 'string') {
                     errorMessage = err.response.data;
                } else if (err.response.data.detail) {
                     errorMessage = err.response.data.detail;
                } else if (err.response.data.old_password) {
                     errorMessage = `Current Password: ${err.response.data.old_password[0]}`;
                } else if (err.response.data.new_password1) {
                     errorMessage = `New Password: ${err.response.data.new_password1[0]}`;
                } else if (err.response.data.new_password2) {
                     errorMessage = `New Password Confirmation: ${err.response.data.new_password2[0]}`;
                } else if (err.response.data.non_field_errors) {
                    errorMessage = err.response.data.non_field_errors[0];
                } else {
                     try { errorMessage = JSON.stringify(err.response.data); } catch (e) {}
                }
            } else if (err.message) {
                 errorMessage = err.message;
            }
             setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
        // --- End handleSubmit logic ---
    };

    if (!isOpen) {
        return null;
    }

    // Helper function to toggle visibility state
    const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    };



    return (
        // Modal Overlay (removed extra wrapping div)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                {/* ... close button code ... */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Header */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">Change Password</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Current Password
                        </label>
                        {/* Add relative positioning to the wrapper div */}
                        <div className="relative">
                            <input
                                // Change type dynamically
                                type={showCurrentPassword ? 'text' : 'password'}
                                id="currentPassword"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                // Add padding-right to prevent text overlapping icon
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                            {/* Position the icon absolutely */}
                            <button
                                type="button" // Important: prevent form submission
                                onClick={() => toggleVisibility(setShowCurrentPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            New Password
                        </label>
                         <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                             <button
                                type="button"
                                onClick={() => toggleVisibility(setShowNewPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                         </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Confirm New Password
                        </label>
                         <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                             <button
                                type="button"
                                onClick={() => toggleVisibility(setShowConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                         </div>
                    </div>

                    {/* --- Feedback Messages --- */}
                    {/* ... error/success message code ... */}
                     {error && (
                        <div className="mt-3 flex items-center rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
                             <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-300" aria-hidden="true" />
                            {error}
                        </div>
                    )}
                    {successMessage && (
                         <div className="mt-3 flex items-center rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                              <CheckCircleIcon className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-300" aria-hidden="true" />
                             {successMessage}
                         </div>
                    )}

                    {/* Submit Button */}
                    {/* ... submit button code ... */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;