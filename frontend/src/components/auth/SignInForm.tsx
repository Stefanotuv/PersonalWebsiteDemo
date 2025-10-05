// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import Button from "../ui/button/Button";
//
// export default function SignInForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//
//   const navigate = useNavigate(); // Now inside the component function
//
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     const payload = {
//       email,
//       password,
//       rememberMe: isChecked,
//     };
//
//     // Example: Sending the request to the backend (replace with your API endpoint)
//     try {
//       const response = await fetch('http://localhost:8000/backend/api/token/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
//
//       if (response.ok) {
//         // Handle successful response (e.g., redirect to another page)
//         const data = await response.json();
//         const token = data.access;  // Assuming the token is in `access` field
//         console.log(token);
//         // Store token (localStorage or sessionStorage)
//         localStorage.setItem('authToken', token);
//
//         // Redirect to home or dashboard page
//         navigate("/");  // Use navigate to redirect
//         console.log("Sign-in successful!");
//       } else {
//         // Handle error (e.g., show error message)
//         console.error("Sign-in failed.");
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//     }
//   };
//
//   return (
//       <div className="flex flex-col flex-1">
//         <div className="w-full max-w-md pt-10 mx-auto">
//           <Link
//               to="/"
//               className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//           >
//             <ChevronLeftIcon className="size-5" />
//             Back to dashboard
//           </Link>
//         </div>
//         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//           <div>
//             <div className="mb-5 sm:mb-8">
//               <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//                 Sign In
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Enter your email and password to sign in!
//               </p>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="space-y-6">
//                 <div>
//                   <Label>
//                     Email <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <Input
//                       placeholder="info@gmail.com"
//                       name='email'
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label>
//                     Password <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <div className="relative">
//                     <Input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         name='password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                     >
//                     {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     )}
//                   </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Checkbox checked={isChecked} onChange={setIsChecked} />
//                     <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
//                     Keep me logged in
//                   </span>
//                   </div>
//                   <Link
//                       to="/reset-password"
//                       className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div>
//                   <Button className="w-full" size="sm" type="submit">
//                     Sign in
//                   </Button>
//                 </div>
//               </div>
//             </form>
//
//             <div className="mt-5">
//               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//                 Don&apos;t have an account? {""}
//                 <Link
//                     to="/signup"
//                     className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                 >
//                   Sign Up
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }





// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // Changed from "react-router"
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import Button from "../ui/button/Button";
// import { ACCESS_TOKEN } from "../../constants"; // Import your constant
//
// export default function SignInForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false); // For "Keep me logged in"
//   const [error, setError] = useState(""); // For displaying login errors
//
//   const navigate = useNavigate();
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors
//     const payload = {
//       email,
//       password,
//       // 'rememberMe: isChecked' - your backend token endpoint might not use this directly.
//       // JWT lifetimes are set in Django settings. "Keep me logged in" is usually
//       // handled by using longer-lived refresh tokens or session settings.
//     };
//
//     try {
//       const response = await fetch('http://localhost:8000/backend/api/token/', { // Ensure this is your correct DRF Simple JWT token endpoint
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
//
//       if (response.ok) {
//         const data = await response.json();
//         const token = data.access;
//         if (token) {
//           localStorage.setItem(ACCESS_TOKEN, token); // Use ACCESS_TOKEN constant
//           // If you also get a refresh token and want to store it:
//           // if (data.refresh) { localStorage.setItem(REFRESH_TOKEN, data.refresh); }
//           navigate("/");
//           console.log("Sign-in successful!");
//         } else {
//           setError("Login successful, but no token received.");
//           console.error("Sign-in successful but no token received.");
//         }
//       } else {
//         const errorData = await response.json();
//         setError(errorData.detail || "Sign-in failed. Please check your credentials.");
//         console.error("Sign-in failed:", errorData);
//       }
//     } catch (err) {
//       setError("An error occurred during sign-in. Please try again.");
//       console.error("Error occurred:", err);
//     }
//   };
//
//   const handleGoogleSignIn = () => {
//     // This is not an API call. It's a full browser redirect.
//     // Django Allauth will handle the OAuth2 flow with Google.
//     // After success, your CustomAccountAdapter will redirect back to
//     // your React app's /auth/callback route with tokens in the URL.
//     window.location.href = 'http://localhost:8000/accounts/google/login/';
//   };
//
//   return (
//       <div className="flex flex-col flex-1">
//         <div className="w-full max-w-md pt-10 mx-auto">
//           <Link
//               to="/"
//               className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//           >
//             <ChevronLeftIcon className="size-5" />
//             Back to dashboard
//           </Link>
//         </div>
//         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//           <div>
//             <div className="mb-5 sm:mb-8">
//               <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//                 Sign In
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Enter your email and password to sign in!
//               </p>
//             </div>
//             {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
//             <form onSubmit={handleSubmit}>
//               <div className="space-y-6">
//                 <div>
//                   <Label>
//                     Email <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <Input
//                       placeholder="info@gmail.com"
//                       type="email" // Good practice to set input type
//                       name='email'
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required // Good practice
//                   />
//                 </div>
//                 <div>
//                   <Label>
//                     Password <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <div className="relative">
//                     <Input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         name='password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required // Good practice
//                     />
//                     <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                     >
//                     {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     )}
//                   </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Checkbox id="keepLoggedIn" checked={isChecked} onChange={(val) => setIsChecked(val)} />
//                     <label htmlFor="keepLoggedIn" className="block font-normal text-gray-700 cursor-pointer text-theme-sm dark:text-gray-400">
//                       Keep me logged in
//                     </label>
//                   </div>
//                   <Link
//                       to="/reset-password" // Ensure this route exists in your React router
//                       className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div>
//                   <Button className="w-full" size="sm" type="submit">
//                     Sign in with Email
//                   </Button>
//                 </div>
//               </div>
//             </form>
//
//             {/* Divider (optional) */}
//             <div className="my-6 flex items-center justify-center">
//                 <span className="px-2 text-xs text-gray-500 bg-white dark:bg-boxdark dark:text-gray-400">OR</span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//             </div>
//
//
//             {/* Google Sign-In Button */}
//             <div className="mt-0"> {/* Adjusted margin if divider is used */}
//               <Button
//                 className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center" // Example styling for Google
//                 size="sm"
//                 onClick={handleGoogleSignIn}
//                 type="button" // VERY IMPORTANT: type="button" so it doesn't submit the email/password form
//               >
//                 {/* You can add a Google icon here */}
//                 <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
//                 Sign in with Google
//               </Button>
//             </div>
//
//             <div className="mt-5">
//               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//                 Don't have an account? {""}
//                 <Link
//                     to="/signup"
//                     className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                 >
//                   Sign Up
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }



// latest to be tested on the email existing already

import { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../../.bin/form/Label";
import Input from "../../../.bin/form/input/InputField";
import Checkbox from "../../../.bin/form/input/Checkbox";
import Button from "../ui/button/Button";
import { ACCESS_TOKEN } from "../../constants"; // Import your constant

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [apiError, setApiError] = useState(""); // For errors from API calls during email/password login
  const [infoMessage, setInfoMessage] = useState(""); // For specific informational messages

  const navigate = useNavigate();
  const location = useLocation(); // Hook to get URL information

  // Check for error parameters in URL on component mount or when URL changes
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const errorCode = params.get('error');
  //   const errorEmail = params.get('email'); // Get the email if passed
  //
  //   if (errorCode === 'social_account_email_exists') {
  //     setInfoMessage(
  //       `The email address ${errorEmail ? `(${errorEmail}) ` : ''}is already associated with a local account. Please sign in below using your email and password. You can connect your Google account later in your profile settings.`
  //     );
  //     // Optional: Clear the error code from URL to prevent it from showing again on refresh
  //     // navigate('/signin', { replace: true }); // This would remove query params from URL bar
  //   } else if (errorCode) {
  //     // Handle other potential error codes passed in URL (e.g., from failed login attempts)
  //     setApiError(`An authentication error occurred (${errorCode}). Please try again.`);
  //   }
  //   // Clear any pre-existing API errors when an info message is shown or if no error code
  //   if (errorCode === 'social_account_email_exists' || !errorCode) {
  //       setApiError("");
  //   }
  //
  // }, [location.search, navigate]); // Re-run if URL search params change

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');
    const errorEmail = params.get('email');
    const provider = params.get('provider'); // You can also get the provider

    if (errorCode === 'social_account_email_exists') {
      setInfoMessage(
        `The email address ${errorEmail ? `(${errorEmail}) ` : ''}is already associated with a local account. ` +
        `Please sign in below using your email and password. If you wish to link your ${provider || 'social'} account, ` +
        `you can do so in your profile settings after signing in.`
      );
      // Clear query params from URL to avoid re-showing message on refresh
      // navigate('/signin', { replace: true }); // Optional, consider user experience
    } else if (errorCode) {
      setApiError(`An authentication error occurred (${errorCode}). Please try again.`);
    }

    if (errorCode === 'social_account_email_exists' || !errorCode) {
        setApiError(""); // Clear other API errors if this specific info is shown
    }

  }, [location.search, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); // Clear previous API errors
    setInfoMessage(""); // Clear previous info messages (in case user tries email/pass after seeing it)
    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/backend/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access;
        if (token) {
          localStorage.setItem(ACCESS_TOKEN, token);
          // Using window.location.href for a full refresh which seems to work for you
          window.location.href = '/';
          console.log("Sign-in successful!");
        } else {
          setApiError("Login successful, but no token received.");
          console.error("Sign-in successful but no token received.");
        }
      } else {
        const errorData = await response.json();
        setApiError(errorData.detail || "Sign-in failed. Please check your credentials.");
        console.error("Sign-in failed:", errorData);
      }
    } catch (err) {
      setApiError("An error occurred during sign-in. Please try again.");
      console.error("Error occurred:", err);
    }
  };

  const handleGoogleSignIn = () => {
    // Clear any messages before initiating Google Sign-In
    setApiError("");
    setInfoMessage("");
    // const googleSignInURL = `${import.meta.env.VITE_API_URL}/accounts/google/login/`;
    // console.log(`Initiating Google Sign-In redirect to: ${googleSignInURL}`); // Log the URL

    const baseURL = import.meta.env.VITE_API_URL;
    const relativeURL = 'accounts/google/login/'; // remove the first '/' as it duplicates
    // const googleSignInURL = new URL(relativeURL, baseURL).href; # Not always working on all env
    const googleSignInURL = baseURL + relativeURL


    window.location.href = googleSignInURL;
  };

  return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
          <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Back to dashboard
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>

            {/* Display Info Message */}
            {infoMessage && (
              <div className="mb-4 p-3 text-sm text-blue-700 bg-blue-100 border border-blue-300 rounded dark:bg-blue-700 dark:text-blue-200 dark:border-blue-600">
                {infoMessage}
              </div>
            )}

            {/* Display API Error Message (for email/password login attempts) */}
            {apiError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded dark:bg-red-700 dark:text-red-200 dark:border-red-600">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                      placeholder="info@gmail.com"
                      type="email"
                      name='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                    {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox id="keepLoggedIn" checked={isChecked} onChange={(val) => setIsChecked(val)} />
                    <label htmlFor="keepLoggedIn" className="block font-normal text-gray-700 cursor-pointer text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </label>
                  </div>
                  <Link
                      to="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Sign in with Email
                  </Button>
                </div>
              </div>
            </form>

            <div className="my-6 flex items-center justify-center">
                <span className="px-2 text-xs text-gray-500 bg-white dark:bg-boxdark dark:text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <div className="mt-0">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                size="sm"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </Button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don't have an account? {""}
                <Link
                    to="/signup"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
