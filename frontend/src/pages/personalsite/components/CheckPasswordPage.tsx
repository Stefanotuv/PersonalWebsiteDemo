// import React, { useState, useEffect } from 'react';
// import api from '../../api';
//
// function CheckPasswordPage() {
//   const [hasPassword, setHasPassword] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     const checkPassword = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await api.get('/backend/api/user/has-password-set/');
//         setHasPassword(response.data.has_password);
//       } catch (err) {
//         setError('Failed to check password status.');
//         console.error('Error checking password:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     checkPassword();
//   }, []);
//
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96 text-center">
//         <h1 className="text-2xl font-semibold mb-4">Check Password Status</h1>
//         {loading && <p>Checking...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {hasPassword !== null && (
//           <p className="text-lg">
//             {hasPassword ? (
//               'You have a password set.'
//             ) : (
//               'You do not have a password set.'
//             )}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default CheckPasswordPage;

import React, { useState } from 'react';
import api from '../../../api.ts';
import {Link} from "react-router-dom";

function CheckPasswordPage() {
  const [hasPassword, setHasPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/backend/api/user/has-password-set/');
      setHasPassword(response.data.has_password);
    } catch (err) {
      setError('Failed to check password status.');
      console.error('Error checking password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Check Password Status</h1>

        <button
          onClick={checkPassword}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          {loading ? 'Checking...' : 'Check Password'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {hasPassword !== null && (
          <p className="text-lg">
            {hasPassword ? (
              'You have a password set.'
            ) : (
              <>
                  You do not have a password set.
                  <br/>
                  <Link to="/setpassword" className="text-blue-500 hover:underline">
                    Click here to set it.
                  </Link>
                </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckPasswordPage;