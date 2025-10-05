// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// import api, { getUserProfile } from '../api'; // Adjust path if necessary
// import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Adjust path if necessary
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios'; // Import axios for potential raw refresh call
//
// // Define the shape of your User object (use your existing Author interface if it matches)
// // Ensure this matches the data structure returned by getUserProfile
// interface User {
//     id: number;
//     username: string; // Or email, depending on your backend user model
//     email: string;
//     first_name?: string;
//     last_name?: string;
//     get_full_name?: string;
//     profile_picture?: string; // Add other relevant fields
//     // is_superuser?: boolean // Example if you need this globally
// }
//
// // Define the shape of the context data
// interface AuthContextType {
//     isAuthenticated: boolean;
//     user: User | null;
//     isLoading: boolean;
//     logout: () => void; // Add a logout function
// }
//
// // Create the context with a default undefined value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// // Define the AuthProvider component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading
//
//     const logout = useCallback(() => {
//         console.log("AuthProvider: Logging out...");
//         setIsAuthenticated(false);
//         setUser(null);
//         localStorage.removeItem(ACCESS_TOKEN);
//         localStorage.removeItem(REFRESH_TOKEN);
//         // Clear Axios default headers if set
//         delete api.defaults.headers.common['Authorization'];
//         // Optionally: Redirect here using useNavigate if called from a component,
//         // or rely on ProtectedRoute to redirect on next render.
//         // navigate('/signin');
//         console.log("AuthProvider: Logout complete.");
//     }, []);
//
//     useEffect(() => {
//         const checkAuthStatus = async () => {
//             console.log("AuthProvider: Checking auth status...");
//             setIsLoading(true);
//             const accessToken = localStorage.getItem(ACCESS_TOKEN);
//
//             if (!accessToken) {
//                 console.log("AuthProvider: No access token found.");
//                 logout(); // Use logout function to clear state and tokens
//                 setIsLoading(false);
//                 return;
//             }
//
//             try {
//                 const decoded = jwtDecode(accessToken);
//                 const tokenExpiration = decoded.exp;
//                 const now = Date.now() / 1000;
//                 let needsRefresh = tokenExpiration < now;
//                 let currentTokenIsValid = !needsRefresh;
//
//                 if (needsRefresh) {
//                     console.log("AuthProvider: Access token expired, attempting refresh...");
//                     const refreshTokenVal = localStorage.getItem(REFRESH_TOKEN);
//                     if (refreshTokenVal) {
//                         try {
//                             // Use a raw axios call OR ensure interceptor handles this scenario
//                             // Using raw axios avoids potential interceptor loops during initial load refresh
//                             const apiUrl = import.meta.env.VITE_API_URL; // Get base URL safely
//                             const response = await axios.post(`${apiUrl}/backend/api/token/refresh/`, {
//                                 refresh: refreshTokenVal
//                             });
//
//                             if (response.status === 200 && response.data.access) {
//                                 console.log("AuthProvider: Refresh successful.");
//                                 localStorage.setItem(ACCESS_TOKEN, response.data.access);
//                                 // Set the default header for subsequent api calls *within this session*
//                                 api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
//                                 currentTokenIsValid = true; // Now we have a valid token
//                             } else {
//                                 console.log("AuthProvider: Refresh failed (non-200 status or no access token).");
//                                 logout(); // Logout if refresh fails
//                             }
//                         } catch (refreshError: any) {
//                              console.error("AuthProvider: Refresh token exception:", refreshError?.response?.data || refreshError.message);
//                              logout(); // Logout if refresh fails
//                         }
//                     } else {
//                         console.log("AuthProvider: Access token expired, no refresh token found.");
//                         logout(); // Logout if no refresh token
//                     }
//                 }
//
//                 // If we have (or just got) a valid token, fetch the user profile
//                 if (currentTokenIsValid) {
//                     console.log("AuthProvider: Token valid, fetching user profile...");
//                     try {
//                         // Ensure the token is set for the upcoming getUserProfile call
//                         // This is redundant if the request interceptor is active, but safe.
//                         const currentAccessToken = localStorage.getItem(ACCESS_TOKEN);
//                         if (currentAccessToken) {
//                            api.defaults.headers.common['Authorization'] = `Bearer ${currentAccessToken}`;
//                         } else {
//                            // Should not happen if currentTokenIsValid is true, but safety check
//                            throw new Error("No access token available despite authorization flag.");
//                         }
//
//                         const profile = await getUserProfile(); // Use your existing function
//                         if (profile) {
//                             console.log("AuthProvider: Profile fetched successfully:", profile);
//                             setUser(profile);
//                             setIsAuthenticated(true);
//                         } else {
//                              console.error("AuthProvider: getUserProfile returned null/undefined.");
//                              logout(); // Treat missing profile as logout
//                         }
//                     } catch (profileError: any) {
//                         console.error("AuthProvider: Failed to fetch profile:", profileError?.response?.data || profileError.message);
//                         // If profile fetch fails (e.g., 401 even with seemingly valid token, maybe revoked server-side), logout.
//                         logout();
//                     }
//                 }
//                 // If !currentTokenIsValid, logout() was already called if necessary.
//
//             } catch (error) {
//                 // Catch decoding errors or other unexpected issues
//                 console.error("AuthProvider: Error during auth check:", error);
//                 logout();
//             } finally {
//                  console.log("AuthProvider: Auth check finished.");
//                  setIsLoading(false); // Stop loading once check is complete
//             }
//         };
//
//         checkAuthStatus();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []); // Run only once on initial mount
//
//     // Provide the state and logout function to children
//     return (
//         <AuthContext.Provider value={{ isAuthenticated, user, isLoading, logout }}>
//             {!isLoading ? children : <div>Loading Application...</div>} {/* Optionally show loading screen */}
//             {/* Or just: {children} and let ProtectedRoute handle its own loading */}
//         </AuthContext.Provider>
//     );
// };
//
// // Custom hook for easy consumption by components
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api, { getUserProfile } from '../api'; // Adjust path if necessary
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Adjust path if necessary
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    get_full_name?: string;
    profile_picture?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (accessToken: string, refreshToken?: string, userData?: User) => Promise<void>; // <<< ADDED login function
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const logout = useCallback(() => {
        console.log("AuthProvider: Logging out...");
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        delete api.defaults.headers.common['Authorization'];
        console.log("AuthProvider: Logout complete.");
    }, []);

    // <<< --- ADD THE LOGIN FUNCTION --- >>>
    const login = useCallback(async (accessToken: string, refreshToken?: string, userData?: User) => {
        console.log("AuthProvider: Logging in...");
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            console.log("AuthProvider: Login with provided user data successful.");
        } else {
            // If userData is not provided, fetch it
            console.log("AuthProvider: Fetching user profile after login...");
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setUser(profile);
                    setIsAuthenticated(true);
                    console.log("AuthProvider: Login and profile fetch successful.");
                } else {
                    console.error("AuthProvider: Profile fetch failed after login, logging out.");
                    logout(); // Fallback to logout if profile can't be fetched
                }
            } catch (error) {
                console.error("AuthProvider: Error fetching profile after login:", error);
                logout(); // Fallback to logout
            }
        }
    }, [logout]); // Include logout in dependencies as it's used

    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log("AuthProvider: Checking auth status...");
            setIsLoading(true);
            const accessToken = localStorage.getItem(ACCESS_TOKEN);

            if (!accessToken) {
                console.log("AuthProvider: No access token found.");
                // logout(); // logout() will be called by the end of the function if needed
                setIsAuthenticated(false); // Explicitly set to false
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(accessToken);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;
                let currentTokenIsValid = tokenExpiration > now;
                let tokenToUse = accessToken; // Use existing token by default

                if (!currentTokenIsValid) {
                    console.log("AuthProvider: Access token expired, attempting refresh...");
                    const refreshTokenVal = localStorage.getItem(REFRESH_TOKEN);
                    if (refreshTokenVal) {
                        try {
                            const apiUrl = import.meta.env.VITE_API_URL;
                            const response = await axios.post(`${apiUrl}/backend/api/token/refresh/`, {
                                refresh: refreshTokenVal
                            }, { headers: { 'Content-Type': 'application/json' } }); // Ensure content type for raw axios

                            if (response.status === 200 && response.data.access) {
                                console.log("AuthProvider: Refresh successful during auth check.");
                                tokenToUse = response.data.access; // Use the new token
                                // Login function will handle setting localStorage and api defaults
                                // await login(response.data.access, response.data.refresh); // Potentially also update refresh token if returned
                                // For now, just update access token and proceed to fetch profile
                                localStorage.setItem(ACCESS_TOKEN, tokenToUse);
                                if (response.data.refresh) { // If backend sends back a new refresh token
                                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                                }
                                api.defaults.headers.common['Authorization'] = `Bearer ${tokenToUse}`;
                                currentTokenIsValid = true;
                            } else {
                                console.log("AuthProvider: Refresh failed (non-200 or no new access token).");
                                logout();
                                currentTokenIsValid = false;
                            }
                        } catch (refreshError: any) {
                             console.error("AuthProvider: Refresh token exception during auth check:", refreshError?.response?.data || refreshError.message);
                             logout();
                             currentTokenIsValid = false;
                        }
                    } else {
                        console.log("AuthProvider: Access token expired, no refresh token found for auth check.");
                        logout();
                        currentTokenIsValid = false;
                    }
                }

                if (currentTokenIsValid) {
                    console.log("AuthProvider: Token valid, fetching user profile for auth check...");
                    // Ensure the potentially new token is used by the api instance
                    if (api.defaults.headers.common['Authorization'] !== `Bearer ${tokenToUse}`) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${tokenToUse}`;
                    }
                    try {
                        const profile = await getUserProfile();
                        if (profile) {
                            console.log("AuthProvider: Profile fetched successfully during auth check:", profile);
                            setUser(profile);
                            setIsAuthenticated(true);
                        } else {
                             console.error("AuthProvider: getUserProfile returned null/undefined during auth check.");
                             logout();
                        }
                    } catch (profileError: any) {
                        console.error("AuthProvider: Failed to fetch profile during auth check:", profileError?.response?.data || profileError.message);
                        logout();
                    }
                }
                // If !currentTokenIsValid by this point, logout() was already called.
            } catch (error) {
                console.error("AuthProvider: Error during JWT decoding or other auth check issue:", error);
                logout();
            } finally {
                 console.log("AuthProvider: Auth check finished.");
                 setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, [logout]); // Removed 'login' from deps of this useEffect to avoid re-running on login itself.

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
            {!isLoading ? children : <div>Loading Application...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};