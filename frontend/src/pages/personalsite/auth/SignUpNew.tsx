//
// import React from "react";
// import { useState } from "react";
//
// import { Link, useNavigate } from "react-router-dom";
// import WelcomePageBanner from "../../../images/new_set/banners/BeeBannerSignIn.png";
// import api from "../../../api.ts";
// import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../../constants.ts";
// import FadeIn from "../components/FadeIn.tsx";
//
// // NEW: Import the modal component and the JSON data
// import TermsModal from "../components/TermsModal.tsx"; // Adjust path if needed
// import termsData from "../../../data/termsAndConditions.json";
//
//
// // SVG Icon Components (can be moved to a separate file if used elsewhere)
// const EyeIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );
//
// const EyeSlashIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.638 0-8.573-3.007-9.963-7.178V11.47c0-.126.016-.25.047-.373M7.696 7.696A10.453 10.453 0 0112 4.5c1.255 0 2.453.286 3.572.764M15 12a3 3 0 11-6 0 3 3 0 016 0Zm6 0a10.955 10.955 0 01-1.13 4.927L18.57 15.62A9.01 9.01 0 0021 12c0-1.82-.503-3.54-1.396-4.995L18.556 7.4A9.002 9.002 0 0121 12Z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Zm0 0H12m0 0V12m0 3.75H12m0 0V12m0-3.75H12m0 0V12m0 0L12 6.25m-3.75 3.75H12m0 0L12 15.75M3 3l18 18" />
//   </svg>
// );
//
// function SignUpNew() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [ErrorMessage, setErrorMessage] = useState("");
//   const [loader, setLoader] = useState(false);
//
//   // NEW: State to control the modal's visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);
//
//   const navigate = useNavigate();
//
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoader(true);
//     setErrorMessage("");
//
//     if (password !== password2) {
//       setErrorMessage("Passwords do not match.");
//       setLoader(false);
//       return;
//     }
//
//     // The `required` attribute on the checkbox handles the check automatically,
//     // but you can add an extra JS check if you want.
//     if (!isChecked) {
//         setErrorMessage("You must agree to the terms and conditions to register.");
//         setLoader(false);
//         return;
//     }
//
//     try {
//       const res = await api.post("/backend/api/user/register/", {
//         email,
//         password,
//         password2,
//       });
//
//       if (res.data.access && res.data.refresh) {
//         const { access, refresh } = res.data;
//         localStorage.setItem(ACCESS_TOKEN, access);
//         localStorage.setItem(REFRESH_TOKEN, refresh);
//         api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
//         window.location.href = "/";
//       } else {
//         setErrorMessage(res.data.message || "Registration successful. Please sign in.");
//         setTimeout(() => navigate("/signin"), 3000);
//       }
//     } catch (err) {
//       if (err.response) {
//         let errorMsg = "Sign-up failed. Please check your input.";
//         if (err.response.data) {
//             if (typeof err.response.data === 'string') {
//                 errorMsg = err.response.data;
//             } else if (err.response.data.detail) {
//                 errorMsg = err.response.data.detail;
//             } else if (err.response.data.email) {
//                 errorMsg = err.response.data.email[0];
//             } else if (err.response.data.password) {
//                 errorMsg = err.response.data.password[0];
//             } else {
//                 const messages = Object.values(err.response.data).flat();
//                 if (messages.length > 0) {
//                     errorMsg = messages.join(" ");
//                 }
//             }
//         }
//         setErrorMessage(errorMsg);
//       } else {
//         setErrorMessage("Network error — please try again.");
//       }
//     } finally {
//       setLoader(false);
//     }
//   };
//
//   return (
//     <section
//       className="h-[100vh] bg-gray-500"
//       style={{
//         background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%),url(${WelcomePageBanner})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       <div className="h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//         <div className="w-full bg-[#000000a2] rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
//           <FadeIn>
//             <div>
//               <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
//                 <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
//                   Create a new account
//                 </h1>
//
//                 <form
//                     onSubmit={handleSubmit}
//                     className="space-y-4 md:space-y-6"
//                 >
//                   {/* Email, Password, and Confirm Password inputs remain the same */}
//                   <div>
//                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-white dark:text-white">Your email</label>
//                     <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" className={(ErrorMessage.toLowerCase().includes("email") || (ErrorMessage && !ErrorMessage.toLowerCase().includes("password"))) ? "bg-stone-700 text-white sm:text-sm rounded-sm border-2 border-red-700 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:text-white placeholder:text-gray-400" : "bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:text-white placeholder:text-gray-400"} placeholder="name@example.com" required />
//                   </div>
//                   <div>
//                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-white dark:text-white">Password</label>
//                     <div className="relative">
//                       <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} name="password" id="password" placeholder="••••••••" className={(ErrorMessage.toLowerCase().includes("password") && !ErrorMessage.toLowerCase().includes("match")) ? "bg-stone-700 text-white sm:text-sm rounded-sm border-2 border-red-700 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:text-white placeholder:text-gray-400" : "bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:text-white placeholder:text-gray-400"} required />
//                       <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white" aria-label={showPassword ? "Hide passwords" : "Show passwords"}>{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="password2" className="block mb-2 text-sm font-medium text-white dark:text-white">Confirm Password</label>
//                      <div className="relative">
//                       <input onChange={(e) => setPassword2(e.target.value)} value={password2} type={showPassword ? "text" : "password"} name="password2" id="password2" placeholder="••••••••" className={(ErrorMessage.toLowerCase().includes("password") || ErrorMessage.toLowerCase().includes("match")) ? "bg-stone-700 text-white sm:text-sm rounded-sm border-2 border-red-700 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:text-white placeholder:text-gray-400" : "bg-stone-700 text-white sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:text-white placeholder:text-gray-400"} required />
//                     </div>
//                   </div>
//
//                   {ErrorMessage && (
//                       <div className="flex items-center text-white font-bold p-3 bg-red-700 rounded text-sm">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
//                         <span>{ErrorMessage}</span>
//                       </div>
//                   )}
//
//                   {/* NEW: Updated Terms & Conditions Checkbox */}
//                   <div className="flex items-start">
//                     <div className="flex items-center h-5">
//                       <input
//                           id="terms"
//                           aria-describedby="terms"
//                           type="checkbox"
//                           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
//                           required // This makes the checkbox mandatory for form submission
//                           checked={isChecked}
//                           onChange={(e) => setIsChecked(e.target.checked)}
//                       />
//                     </div>
//                     <div className="ml-3 text-sm">
//                       <label htmlFor="terms" className="text-gray-300 dark:text-gray-400">
//                         I agree to the{' '}
//                         {/* This span acts as the button to open the modal */}
//                         <span
//                             onClick={() => setIsModalOpen(true)}
//                             className="font-medium text-white hover:underline cursor-pointer"
//                         >
//                             terms and conditions
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//
//                   <button
//                       type="submit"
//                       disabled={loader}
//                       className={`w-full text-white ${
//                           loader
//                               ? `bg-stone-600 cursor-not-allowed`
//                               : `bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300`
//                       } font-medium rounded-sm text-sm px-5 py-2.5 text-center transition ease-in-out`}
//                   >
//                     {loader ? 'Creating...' : 'Create account'}
//                   </button>
//                   <p className="text-sm font-light text-gray-300 dark:text-gray-400">
//                     Already have an account?{" "}
//                     <Link className="font-medium text-white hover:underline dark:text-primary-500" to={"/signin"}>
//                       Sign in
//                     </Link>
//                   </p>
//                    <p className="text-sm font-light text-gray-300 dark:text-gray-400">
//                       <Link className="font-medium text-gray-100 hover:underline dark:text-white" to={"/"}>
//                         {" <- Back "}
//                       </Link>
//                     </p>
//                 </form>
//               </div>
//             </div>
//           </FadeIn>
//         </div>
//       </div>
//
//       {/* NEW: Render the modal component here */}
//       <TermsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         terms={termsData}
//       />
//     </section>
//   );
// }
//
// export default SignUpNew;

// // frontend/src/components/auth/SignUpNew.tsx (Register Component)
// // This is a new component based on the styling principles of SignInNew.tsx
// // frontend/src/components/auth/SignUpNew.tsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../../../api.ts";
//
// import TermsModal from "../components/TermsModal.tsx"; // Adjust path if needed
// import termsData from "../../../data/termsAndConditions.json";
//
// function SignUpNew() {
//   const navigate = useNavigate();
//
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [ErrorMessage, setErrorMessage] = useState("");
//   const [loader, setLoader] = useState(false);
//
//   // --- NEW: State to control the modal visibility and checkbox status ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
//   // --- END NEW ---
//
//   const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoader(true);
//     setErrorMessage("");
//
//     if (password !== password2) {
//       setErrorMessage("Passwords do not match.");
//       setLoader(false);
//       return;
//     }
//     // --- NEW: Check for terms agreement ---
//     if (!hasAgreedToTerms) {
//       setErrorMessage("You must agree to the Terms and Conditions to register.");
//       setLoader(false);
//       return;
//     }
//     // --- END NEW ---
//
//     try {
//       await api.post("/api/users/register/", {
//         email,
//         password,
//         password2,
//         first_name: firstName,
//         last_name: lastName,
//       });
//
//       navigate("/login?registrationSuccess=true");
//
//     } catch (err: any) {
//       if (err.response && err.response.data) {
//         const errorData = err.response.data;
//         if (errorData.email) setErrorMessage(`Email: ${errorData.email.join(', ')}`);
//         else if (errorData.password) setErrorMessage(`Password: ${errorData.password.join(', ')}`);
//         else if (errorData.non_field_errors) setErrorMessage(errorData.non_field_errors.join(', '));
//         else setErrorMessage(errorData.detail || "Registration failed. Please check your input.");
//       } else {
//         setErrorMessage("Network error — please try again.");
//       }
//     } finally {
//       setLoader(false);
//     }
//   };
//
//   return (
//     <section
//       className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
//     >
//       <div className="w-full bg-white bg-opacity-90 rounded-lg shadow-xl sm:max-w-lg border border-gray-200">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
//           <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
//             Create an Account on Stefano's Website
//           </h1>
//
//           <form onSubmit={handleRegisterSubmit} className="space-y-4 md:space-y-6">
//             <div>
//               <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
//               <input type="email" name="email" id="email" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${ErrorMessage.includes("Email") ? "border-red-500" : ""}`} placeholder="name@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div>
//               <label htmlFor="first-name" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
//               <input type="text" name="first-name" id="first-name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//             </div>
//             <div>
//               <label htmlFor="last-name" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
//               <input type="text" name="last-name" id="last-name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//             </div>
//             <div>
//               <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
//               <input type="password" name="password" id="password" placeholder="••••••••" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${ErrorMessage.includes("password") && !ErrorMessage.includes("match") ? "border-red-500" : ""}`} required value={password} onChange={(e) => setPassword(e.target.value)} />
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
//               <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${ErrorMessage.includes("match") ? "border-red-500" : ""}`} required value={password2} onChange={(e) => setPassword2(e.target.value)} />
//             </div>
//
//             {/* --- NEW: Terms and Conditions Checkbox --- */}
//             <div className="flex items-center">
//                 <input
//                     id="terms"
//                     aria-describedby="terms"
//                     type="checkbox"
//                     className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
//                     checked={hasAgreedToTerms}
//                     onChange={(e) => setHasAgreedToTerms(e.target.checked)}
//                 />
//                 <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="text-gray-500 cursor-pointer">
//                         I agree to the{' '}
//                         <span
//                             onClick={() => setIsModalOpen(true)}
//                             className="font-medium text-blue-600 hover:underline cursor-pointer"
//                         >
//                             Terms and Conditions
//                         </span>
//                     </label>
//                 </div>
//             </div>
//             {/* --- END NEW --- */}
//
//             {ErrorMessage && (
//               <div className="flex items-center text-white font-bold p-3 bg-red-600 rounded text-sm">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
//                 <span>{ErrorMessage}</span>
//               </div>
//             )}
//
//             <button type="submit" disabled={loader} className={`w-full text-white ${loader ? `bg-gray-400 cursor-not-allowed` : `bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300`} font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ease-in-out`}>
//               {loader ? 'Registering...' : 'Create an account'}
//             </button>
//           </form>
//
//           <p className="text-sm font-light text-gray-500 mt-4 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="font-medium text-blue-600 hover:underline">
//               Login here
//             </Link>
//           </p>
//           <p className="text-sm font-light text-gray-500 text-center">
//             <Link to="/" className="font-medium text-blue-600 hover:underline">
//               {" <- Back to Home "}
//             </Link>
//           </p>
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
// export default SignUpNew;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from "../../../api.ts";
//
// import TermsModal from "../components/TermsModal.tsx"; // Adjust path if needed
// import termsData from "../../../data/termsAndConditions.json";
//
//
// function SignUpNew() {
//   const navigate = useNavigate();
//
//   // --- REFACTOR 1: Consolidated form state into a single object ---
//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     password: "",
//     password2: "",
//     interestNotes: "", // The new field is now part of the state
//   });
//
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loader, setLoader] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
//
//   // Destructure for easier use in the JSX
//   const { email, firstName, lastName, password, password2, interestNotes } = formData;
//
//   // --- REFACTOR 2: Generic change handler for all form inputs ---
//   const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoader(true);
//     setErrorMessage("");
//
//     if (password !== password2) {
//       setErrorMessage("Passwords do not match.");
//       setLoader(false);
//       return;
//     }
//
//     if (!hasAgreedToTerms) {
//       setErrorMessage("You must agree to the Terms and Conditions to register.");
//       setLoader(false);
//       return;
//     }
//
//     try {
//       // The payload now correctly pulls all data from the formData state
//       await api.post("/api/users/register/", {
//         email,
//         password,
//         password2,
//         first_name: firstName,
//         last_name: lastName,
//         interest_notes: interestNotes, // Correctly sent to backend
//       });
//
//       navigate("/login?registrationSuccess=true");
//
//     } catch (err: any) {
//       if (err.response && err.response.data) {
//         const errorData = err.response.data;
//         if (errorData.email) setErrorMessage(`Email: ${errorData.email.join(', ')}`);
//         else if (errorData.password) setErrorMessage(`Password: ${errorData.password.join(', ')}`);
//         else if (errorData.non_field_errors) setErrorMessage(errorData.non_field_errors.join(', '));
//         else setErrorMessage(errorData.detail || "Registration failed. Please check your input.");
//       } else {
//         setErrorMessage("Network error — please try again.");
//       }
//     } finally {
//       setLoader(false);
//     }
//   };
//
//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full bg-white bg-opacity-90 rounded-lg shadow-xl sm:max-w-lg border border-gray-200">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
//           <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
//             Create an Account on Stefano's Website
//           </h1>
//
//           <form onSubmit={handleRegisterSubmit} className="space-y-4 md:space-y-6">
//             {/* --- REFACTOR 3: All inputs now use the generic `onChange` handler and pull value from `formData` --- */}
//             <div>
//               <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
//               <input type="email" name="email" id="email" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errorMessage.includes("Email") ? "border-red-500" : ""}`} placeholder="name@email.com" required value={email} onChange={onChange} />
//             </div>
//             <div>
//               <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
//               <input type="text" name="firstName" id="firstName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="John" required value={firstName} onChange={onChange} />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
//               <input type="text" name="lastName" id="lastName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="Doe" required value={lastName} onChange={onChange} />
//             </div>
//             <div>
//               <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
//               <input type="password" name="password" id="password" placeholder="••••••••" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errorMessage.includes("Password") && !errorMessage.includes("match") ? "border-red-500" : ""}`} required value={password} onChange={onChange} />
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
//               <input type="password" name="password2" id="confirm-password" placeholder="••••••••" className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errorMessage.includes("match") ? "border-red-500" : ""}`} required value={password2} onChange={onChange} />
//             </div>
//
//             {/* --- FIX: The textarea now correctly uses state and the onChange handler --- */}
//             <div className="mb-6">
//                 <label htmlFor="interestNotes" className="block mb-2 text-sm font-medium text-gray-900">
//                     Please, share your interest about my profile/activities (Optional)
//                 </label>
//                 <textarea
//                     id="interestNotes"
//                     name="interestNotes"
//                     value={interestNotes}
//                     onChange={onChange}
//                     rows={4}
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                     placeholder="e.g., Interested in collaborating on a tech project, learning more about your work in social impact, etc."
//                 ></textarea>
//             </div>
//
//             <div className="flex items-center">
//                 <input
//                     id="terms"
//                     aria-describedby="terms"
//                     type="checkbox"
//                     className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
//                     checked={hasAgreedToTerms}
//                     onChange={(e) => setHasAgreedToTerms(e.target.checked)}
//                 />
//                 <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="text-gray-500 cursor-pointer">
//                         I agree to the{' '}
//                         <span
//                             onClick={() => setIsModalOpen(true)}
//                             className="font-medium text-blue-600 hover:underline cursor-pointer"
//                         >
//                             Terms and Conditions
//                         </span>
//                     </label>
//                 </div>
//             </div>
//
//             {/* --- REFACTOR 4: Renamed ErrorMessage to errorMessage for consistency --- */}
//             {errorMessage && (
//               <div className="flex items-center text-white font-bold p-3 bg-red-600 rounded text-sm">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
//                 <span>{errorMessage}</span>
//               </div>
//             )}
//
//             <button type="submit" disabled={loader} className={`w-full text-white ${loader ? `bg-gray-400 cursor-not-allowed` : `bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300`} font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ease-in-out`}>
//               {loader ? 'Registering...' : 'Create an account'}
//             </button>
//           </form>
//
//           <p className="text-sm font-light text-gray-500 mt-4 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="font-medium text-blue-600 hover:underline">
//               Login here
//             </Link>
//           </p>
//           <p className="text-sm font-light text-gray-500 text-center">
//             <Link to="/" className="font-medium text-blue-600 hover:underline">
//               {" <- Back to Home "}
//             </Link>
//           </p>
//         </div>
//       </div>
//
//       <TermsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         terms={termsData}
//       />
//     </section>
//   );
// }
//
// export default SignUpNew;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../../api.ts";

import TermsModal from "../components/TermsModal.tsx"; // Adjust path if needed
import termsData from "../../../data/termsAndConditions.json";

// --- NEW: Import icons for password visibility toggle ---
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUpNew() {
  const navigate = useNavigate();

  // Consolidated form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
    interestNotes: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  // --- NEW: State for password visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);


  const { email, firstName, lastName, password, password2, interestNotes } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    setErrorMessage("");

    if (password !== password2) {
      setErrorMessage("Passwords do not match.");
      setLoader(false);
      return;
    }

    if (!hasAgreedToTerms) {
      setErrorMessage("You must agree to the Terms and Conditions to register.");
      setLoader(false);
      return;
    }

    try {
      await api.post("/api/users/register/", {
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
        interest_notes: interestNotes,
      });

      navigate("/login?registrationSuccess=true");

    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.email) setErrorMessage(`Email: ${errorData.email.join(', ')}`);
        else if (errorData.password) setErrorMessage(`Password: ${errorData.password.join(', ')}`);
        else if (errorData.non_field_errors) setErrorMessage(errorData.non_field_errors.join(', '));
        else setErrorMessage(errorData.detail || "Registration failed. Please check your input.");
      } else {
        setErrorMessage("Network error — please try again.");
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    // --- MODIFIED: Added dark background to the page ---
    <section className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {/* --- MODIFIED: Changed card background and border for dark mode --- */}
      <div className="w-full bg-gray-800 rounded-lg shadow-xl sm:max-w-lg border border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
          {/* --- MODIFIED: Changed text color for dark mode --- */}
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl text-center">
            Create an Account on Stefano's Website
          </h1>

          <form onSubmit={handleRegisterSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
              <input type="email" name="email" id="email" className={`bg-gray-700 border border-gray-600 text-white placeholder-gray-400 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errorMessage.includes("Email") ? "border-red-500" : ""}`} placeholder="name@email.com" required value={email} onChange={onChange} />
            </div>
            <div>
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-white">First Name</label>
              <input type="text" name="firstName" id="firstName" className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John" required value={firstName} onChange={onChange} />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-white">Last Name</label>
              <input type="text" name="lastName" id="lastName" className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Doe" required value={lastName} onChange={onChange} />
            </div>

            {/* --- MODIFIED: Password field with visibility toggle --- */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`bg-gray-700 border border-gray-600 text-white placeholder-gray-400 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 ${errorMessage.includes("Password") && !errorMessage.includes("match") ? "border-red-500" : ""}`}
                  required
                  value={password}
                  onChange={onChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
            </div>

            {/* --- MODIFIED: Confirm Password field with visibility toggle --- */}
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  id="confirm-password"
                  placeholder="••••••••"
                  className={`bg-gray-700 border border-gray-600 text-white placeholder-gray-400 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 ${errorMessage.includes("match") ? "border-red-500" : ""}`}
                  required
                  value={password2}
                  onChange={onChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}>
                  {showPassword2 ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
            </div>

            <div className="mb-6">
                <label htmlFor="interestNotes" className="block mb-2 text-sm font-medium text-white">
                    Please, share your interest about my profile/activities (Optional)
                </label>
                <textarea
                    id="interestNotes"
                    name="interestNotes"
                    value={interestNotes}
                    onChange={onChange}
                    rows={4}
                    className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="e.g., Interested in collaborating on a tech project, learning more about your work in social impact, etc."
                ></textarea>
            </div>

            <div className="flex items-center">
                <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border-gray-600 rounded bg-gray-700 focus:ring-3 focus:ring-blue-600"
                    checked={hasAgreedToTerms}
                    onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                />
                <div className="ml-3 text-sm">
                    {/* --- MODIFIED: Changed text color for dark mode --- */}
                    <label htmlFor="terms" className="text-gray-400">
                        I agree to the{' '}
                        <span
                            onClick={() => setIsModalOpen(true)}
                            className="font-medium text-blue-500 hover:underline cursor-pointer"
                        >
                            Terms and Conditions
                        </span>
                    </label>
                </div>
            </div>

            {errorMessage && (
              <div className="flex items-center text-white font-bold p-3 bg-red-600 rounded text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" disabled={loader} className={`w-full text-white ${loader ? `bg-gray-500 cursor-not-allowed` : `bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300`} font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ease-in-out`}>
              {loader ? 'Registering...' : 'Create an account'}
            </button>
          </form>

          {/* --- MODIFIED: Changed text color for dark mode --- */}
          <p className="text-sm font-light text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
          <p className="text-sm font-light text-gray-400 text-center">
            <Link to="/" className="font-medium text-blue-500 hover:underline">
              {" <- Back to Home "}
            </Link>
          </p>
        </div>
      </div>

      <TermsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        terms={termsData}
      />
    </section>
  );
}

export default SignUpNew;