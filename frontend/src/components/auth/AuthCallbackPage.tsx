// src/pages/auth/AuthCallbackPage.js
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN /*, REFRESH_TOKEN */ } from '../../constants'; // Your token constants

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get location object which contains URL query params

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    // const refreshToken = params.get('refresh_token'); // If you decide to send and use it


    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      // if (refreshToken) {
      //   localStorage.setItem(REFRESH_TOKEN, refreshToken);
      // }

      // Successfully stored token, now redirect to the main part of your app
      // You might want to fetch user profile here before navigating,
      // or let the destination page handle that.
      // navigate('/'); // Or your desired route like '/dashboard'
      console.log("AuthCallbackPage: Token stored. Attempting window location change to /");
      window.location.href = '/'; // Try this instead of navigate('/')
    } else {
      // Handle error: No token found, or an error parameter from backend
      const error = params.get('error');
      console.error("Authentication callback error:", error || "No token received.");
      // Redirect to login page with an error message if possible
      navigate(`/signin?error=${error || 'auth_failed'}`);
    }
    // 'location' should be in dependency array as params are derived from it
  }, [navigate, location]);



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Processing authentication, please wait...</p>
      {/* You can add a nice loading spinner here */}
    </div>
  );
};

export default AuthCallbackPage;