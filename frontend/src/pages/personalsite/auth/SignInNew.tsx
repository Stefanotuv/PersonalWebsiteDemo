// import React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import FadeIn from '../components/FadeIn.tsx';
// import api from "../../../api.ts";
// import WelcomePageBanner from "../../../images/new_set/banners/BeeBannerSignIn.png";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants.ts";
//
// import { Capacitor } from '@capacitor/core';
// import { Browser } from '@capacitor/browser';
//
// // --- NEW: Import the modal and terms data ---
// import TermsModal from "../components/TermsModal.tsx"; // Adjust path if needed
// import termsData from "../../../data/termsAndConditions.json";
// // --- END NEW ---
//
// // --- Logic for Web/System Browser Google Sign-In ---
// const baseURLForWebGoogle = import.meta.env.VITE_API_URL || '';
// const relativeURLForWebGoogle = 'accounts/google/login/';
// const resolvedBaseURLForWebGoogle = baseURLForWebGoogle.endsWith('/') ? baseURLForWebGoogle.slice(0, -1) : baseURLForWebGoogle;
// const resolvedRelativeURLForWebGoogle = relativeURLForWebGoogle.startsWith('/') ? relativeURLForWebGoogle.substring(1) : relativeURLForWebGoogle;
// const webGoogleSignInURL = `${resolvedBaseURLForWebGoogle}/${resolvedRelativeURLForWebGoogle}`;
//
// // SVG Icon Components (EyeIcon, EyeSlashIcon) remain the same...
// const EyeIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
// );
// const EyeSlashIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178V11.47c0-.126.016-.25.047-.373M7.696 7.696A10.453 10.453 0 0112 4.5c1.255 0 2.453.286 3.572.764M15 12a3 3 0 11-6 0 3 3 0 016 0Zm6 0a10.955 10.955 0 01-1.13 4.927L18.57 15.62A9.01 9.01 0 0021 12c0-1.82-.503-3.54-1.396-4.995L18.556 7.4A9.002 9.002 0 0121 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Zm0 0H12m0 0V12m0 3.75H12m0 0V12m0-3.75H12m0 0V12m0 0L12 6.25m-3.75 3.75H12m0 0L12 15.75M3 3l18 18" /></svg>
// );
//
//
// function SignInNew() {
//   const navigate = useNavigate();
//
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [ErrorMessage, setErrorMessage] = useState("");
//   const [loader, setLoader] = useState(false);
//
//   // --- NEW: State to control the modal visibility ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//
//   const handleEmailPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoader(true);
//     setErrorMessage("");
//
//     try {
//       const res = await api.post("/backend/api/token/", {
//         email,
//         password,
//       });
//       const { access, refresh } = res.data;
//       localStorage.setItem(ACCESS_TOKEN, access);
//       if (refresh) localStorage.setItem(REFRESH_TOKEN, refresh);
//       if (isChecked && refresh) {
//         document.cookie = `refreshToken=${refresh}; max-age=${60*60*24*30}; path=/; SameSite=Lax`;
//       }
//       api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
//       window.location.href = "/";
//     } catch (err: any) {
//       if (err.response && err.response.data) {
//         setErrorMessage(err.response.data.detail || "Sign-in failed. Please check credentials.");
//       } else {
//         setErrorMessage("Network error — please try again.");
//       }
//     } finally {
//       setLoader(false);
//     }
//   };
//
//   const handleGoogleSignIn = async () => {
//     setLoader(true);
//     setErrorMessage("");
//     if (Capacitor.isNativePlatform()) {
//       try {
//         await Browser.open({ url: webGoogleSignInURL });
//         setTimeout(() => setLoader(false), 7000);
//       } catch (error) {
//         console.error("Failed to open browser for Google Sign-In:", error);
//         setErrorMessage("Could not open browser for Google Sign-In.");
//         setLoader(false);
//       }
//     } else {
//       window.location.href = webGoogleSignInURL;
//       setTimeout(() => setLoader(false), 3000);
//     }
//   };
//
//   return (
//     <section
//       className="h-screen bg-gray-50 dark:bg-gray-900"
//       style={{
//         backgroundImage: `url(${WelcomePageBanner})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       <div className="h-full flex flex-col items-center justify-center px-6 py-8 mx-auto">
//         <div className="w-full bg-gray-50 bg-opacity-80 rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
//           <FadeIn>
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
//                 Sign in to your account
//               </h1>
//
//               {/* Email/Password form remains the same */}
//               <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 md:space-y-6">
//                  {/* ... form inputs for email, password ... */}
//                 <div>
//                   <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Your email</label>
//                   <input type="email" name="email" id="email" className={`bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ` + (ErrorMessage.includes("email") || (ErrorMessage && !ErrorMessage.includes("password") && !ErrorMessage.toLowerCase().includes("google")) ? "border-2 border-red-700" : "border-gray-300 dark:border-gray-600")} placeholder="name@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Password</label>
//                   <div className="relative">
//                     <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="••••••••" className={`bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 placeholder-white dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ` + (ErrorMessage.includes("password") && !ErrorMessage.toLowerCase().includes("google") ? "border-2 border-red-700" : "border-gray-300 dark:border-gray-600")} required value={password} onChange={(e) => setPassword(e.target.value)} />
//                     <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
//                   </div>
//                 </div>
//
//                 {ErrorMessage && (
//                   <div className="flex items-center text-white font-bold p-3 bg-red-700 rounded text-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
//                     <span>{ErrorMessage}</span>
//                   </div>
//                 )}
//
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-start">
//                     <div className="flex items-center h-5">
//                       <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
//                     </div>
//                     <div className="ml-3 text-sm"><label htmlFor="remember" className="text-gray-500 dark:text-gray-300 cursor-pointer">Remember me</label></div>
//                   </div>
//                   <Link to="/forgot-password" className="text-sm font-medium text-black hover:underline">Forgot password?</Link>
//                 </div>
//                 <button type="submit" disabled={loader} className={`w-full text-white ${loader && email && password ? `bg-stone-500 cursor-not-allowed` : `bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800`} transition ease-in-out font-medium rounded-sm text-sm px-5 py-2.5 text-center`}>{loader && email && password ? 'Signing in...' : 'Sign in with Email'}</button>
//               </form>
//
//               <div className="my-6 flex items-center">
//                   <div className="flex-grow border-t border-gray-400"></div>
//                   <span className="mx-4 text-xs text-gray-600 dark:text-gray-400">OR</span>
//                   <div className="flex-grow border-t border-gray-400"></div>
//               </div>
//
//               <button
//                 type="button"
//                 onClick={handleGoogleSignIn}
//                 disabled={loader}
//                 className={`w-full text-white ${loader && !(email && password) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'} font-medium rounded-sm text-sm px-5 py-2.5 text-center flex items-center justify-center transition ease-in-out`}
//               >
//                 <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
//                 {loader && !(email && password) ? 'Processing...' : 'Sign in with Google'}
//               </button>
//
//               {/* --- NEW: T&C Notice for Google Sign-In --- */}
//               <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
//                 By continuing with Google, you agree to our{' '}
//                 <span
//                   onClick={() => setIsModalOpen(true)}
//                   className="font-medium text-black hover:underline cursor-pointer"
//                 >
//                   Terms and Conditions
//                 </span>.
//               </p>
//               {/* --- END NEW --- */}
//
//               <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
//                 Don’t have an account yet?{" "}
//                 <Link className="font-medium text-black hover:underline dark:text-primary-500" to={"/signup"}>
//                   Sign up
//                 </Link>
//               </p>
//               <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                 <Link className="font-medium text-black hover:underline dark:text-primary-500" to={"/"}>
//                   {" <- Back "}
//                 </Link>
//               </p>
//             </div>
//           </FadeIn>
//         </div>
//       </div>
//
//       {/* --- NEW: Render the modal component --- */}
//       <TermsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         terms={termsData}
//       />
//     </section>
//   );
// }
//
// export default SignInNew;

// frontend/src/components/auth/SignInNew.tsx (Login Component)
// This file is adapted from your provided code.

import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Adjusted path for api.ts - assuming it's now at frontend/src/api/api.ts
import api from "../../../api.ts"; // Corrected path
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants.ts";
// --- SVG Icon Components (EyeIcon, EyeSlashIcon) remain the same ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178V11.47c0-.126.016-.25.047-.373M7.696 7.696A10.453 10.453 0 0112 4.5c1.255 0 2.453.286 3.572.764M15 12a3 3 0 11-6 0 3 3 0 016 0Zm6 0a10.955 10.955 0 01-1.13 4.927L18.57 15.62A9.01 9.01 0 0021 12c0-1.82-.503-3.54-1.396-4.995L18.556 7.4A9.002 9.002 0 0121 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Zm0 0H12m0 0V12m0 3.75H12m0 0V12m0-3.75H12m0 0V12m0 0L12 6.25m-3.75 3.75H12m0 0L12 15.75M3 3l18 18" /></svg>
);


function SignInNew() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // "Remember me" checkbox
  const [ErrorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  // Removed: isModalOpen, TermsModal, termsData, handleGoogleSignIn, webGoogleSignInURL, Capacitor, Browser imports

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    setErrorMessage("");

    try {
      // Use loginUser from api/api.ts for clarity if it's there, or directly call api.post
      // Assuming your api.ts has a loginUser wrapper:
      // const res = await loginUser({ email, password });
      // Or directly:
      const res = await api.post("/api/users/login/", { // Corrected URL: /api/users/login/
        email,
        password,
      });

      const { access, refresh } = res.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      if (refresh) localStorage.setItem(REFRESH_TOKEN, refresh);
      if (isChecked && refresh) {
        // This cookie logic assumes Django is set up to read this cookie for refresh.
        // For JWT only, localStorage is usually sufficient.
        document.cookie = `refreshToken=${refresh}; max-age=${60*60*24*30}; path=/; SameSite=Lax`;
      }
      // Assuming you have a login function in AuthContext to update the user state:
      // const { login } = useAuth(); // You'd need to import useAuth and destructure login
      // await login(access, refresh, res.data.user); // Pass user data from backend if available
      window.location.href = "/"; // Redirect to dashboard
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.detail || "Sign-in failed. Please check credentials.");
      } else {
        setErrorMessage("Network error — please try again.");
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4" // Removed background image, added centering
      // style={{ removed backgroundImage here }}
    >
      <div className="w-full bg-white bg-opacity-90 rounded-lg shadow-xl sm:max-w-lg border border-gray-200"> {/* Adjusted container styles */}
        {/* Removed FadeIn component as its dependency is also removed. Can add later if desired. */}
        <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Sign in on Stefano's Website {/* Changed text */}
          </h1>

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
              <input
                type="email"
                name="email"
                id="email"
                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${ErrorMessage.includes("email") || (ErrorMessage && !ErrorMessage.includes("password") && !ErrorMessage.toLowerCase().includes("google")) ? "border-red-500" : ""}`}
                placeholder="name@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 pr-10 ${ErrorMessage.includes("password") && !ErrorMessage.toLowerCase().includes("google") ? "border-red-500" : ""}`}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {ErrorMessage && (
              <div className="flex items-center text-white font-bold p-3 bg-red-600 rounded text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                <span>{ErrorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                </div>
                <div className="ml-3 text-sm"><label htmlFor="remember" className="text-gray-500 cursor-pointer">Remember me</label></div>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={loader}
              className={`w-full text-white ${loader && email && password ? `bg-gray-400 cursor-not-allowed` : `bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300`} font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ease-in-out`}
            >
              {loader && email && password ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>

          {/* Removed OR divider and Google Sign-in button */}

          <p className="text-sm font-light text-gray-500 mt-4 text-center">
            Don’t have an account yet?{" "}
            <Link className="font-medium text-blue-600 hover:underline" to={"/register"}> {/* Changed /signup to /register */}
              Sign up
            </Link>
          </p>
          <p className="text-sm font-light text-gray-500 text-center">
            <Link className="font-medium text-blue-600 hover:underline" to={"/"}>
              {" <- Back to Home "}
            </Link>
          </p>
        </div>
        {/* Removed TermsModal */}
      </div>
    </section>
  );
}

export default SignInNew;