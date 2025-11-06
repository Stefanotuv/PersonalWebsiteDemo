
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
            Create an Account on Mario's Website
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