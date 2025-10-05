// src/components/Auth/ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api'; // Your API instance
import FadeIn from '../personalsite/components/FadeIn.tsx'; // Your FadeIn component
import WelcomePageBanner from "../../images/new_set/banners/BeeBannerSignIn.png";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // 4. THIS CALLS YOUR NEW BACKEND URL
      const response = await api.post('/backend/forgotpasswordreset/', { email });
      setMessage(response.data.detail); // Show the success message from the backend
    } catch (err) {
      // In a well-configured system, this will rarely be hit, as the backend always returns success.
      // This would catch network errors or 500 server errors.
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="h-screen bg-gray-50 dark:bg-gray-900"
      style={{
        backgroundImage: `url(${WelcomePageBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="h-full flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-gray-50 bg-opacity-80 rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
          <FadeIn>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
                Forgot Your Password?
              </h1>
              <p className="text-sm font-light text-gray-700">
                No problem. Enter your email address below and we will send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-white"
                    placeholder="name@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {message && (
                  <div className="flex items-center text-white font-bold p-3 bg-green-600 rounded text-sm">
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center text-white font-bold p-3 bg-red-700 rounded text-sm">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || message} // Disable button after success
                  className={`w-full text-white ${
                    loading || message
                      ? `bg-stone-500 cursor-not-allowed`
                      : `bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300`
                  } transition ease-in-out font-medium rounded-sm text-sm px-5 py-2.5 text-center`}
                >
                  {loading ? 'Sending Link...' : 'Send Password Reset Link'}
                </button>
              </form>

              <p className="text-sm font-light text-gray-500">
                <Link
                  className="font-medium text-black hover:underline"
                  to={"/signin"}
                >
                  {"<- Back to Sign In"}
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;