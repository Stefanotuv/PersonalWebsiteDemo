// src/components/Auth/ResetPassword.js

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api'; // Your API instance
import FadeIn from '../personalsite/components/FadeIn.tsx'; // Your FadeIn component

// You can reuse these icons from your SignIn component if they are in a shared file
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const EyeSlashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178V11.47c0-.126.016-.25.047-.373M7.696 7.696A10.453 10.453 0 0112 4.5c1.255 0 2.453.286 3.572.764M15 12a3 3 0 11-6 0 3 3 0 016 0Zm6 0a10.955 10.955 0 01-1.13 4.927L18.57 15.62A9.01 9.01 0 0021 12c0-1.82-.503-3.54-1.396-4.995L18.556 7.4A9.002 9.002 0 0121 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Zm0 0H12m0 0V12m0 3.75H12m0 0V12m0-3.75H12m0 0V12m0 0L12 6.25m-3.75 3.75H12m0 0L12 15.75M3 3l18 18" /></svg>);

function ResetPassword() {
  const { uidb64, token } = useParams(); // Gets the tokens from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    try {
        // 5. THIS CALLS YOUR EXISTING, WORKING RESET ENDPOINT
        const response = await api.post(
            `/backend/password-reset-confirm/${uidb64}/${token}/`,
            {
                new_password: password,
                new_password2: password2,
            }
        );

        setMessage(response.data.detail + ' Redirecting to sign in...');
        setTimeout(() => {
            navigate('/signin');
        }, 3000);

    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data[0] || 'The reset link is invalid or has expired. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="h-screen bg-gray-50 dark:bg-gray-900"
      style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="h-full flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-gray-50 bg-opacity-80 rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
          <FadeIn>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
                Set a New Password
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" id="password" placeholder="••••••••"
                      className="bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 placeholder-white"
                      required value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white">
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password2" className="block mb-2 text-sm font-medium text-black">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password2" id="password2" placeholder="••••••••"
                    className="bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-white"
                    required value={password2} onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>

                {message && <div className="text-white font-bold p-3 bg-green-600 rounded text-sm"><span>{message}</span></div>}
                {error && <div className="text-white font-bold p-3 bg-red-700 rounded text-sm"><span>{error}</span></div>}

                <button
                  type="submit" disabled={loading || message}
                  className={`w-full text-white ${loading || message ? 'bg-stone-500 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'} transition ease-in-out font-medium rounded-sm text-sm px-5 py-2.5 text-center`}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;