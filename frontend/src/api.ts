
// api.ts
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"; // Ensure path is correct


// Ensure this is correctly set, e.g., VITE_API_URL=http://localhost:8000
const apiUrl = import.meta.env.VITE_API_URL;


console.log("VITE_API_URL from env:", apiUrl); // GENERAL LOG

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true, // ESSENTIAL for sending cookies (like csrftoken) cross-origin
});

api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken'; // Django expects this header

// --- REQUEST INTERCEPTOR WITH MORE LOGGING ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(`[Request Interceptor] URL: ${config.url}, Method: ${config.method?.toUpperCase()}`); // LOG
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[Request Interceptor] Token found and attached for ${config.url}`); // LOG
    } else {
      console.log(`[Request Interceptor] No token found in localStorage for ${config.url}`); // LOG
    }

    if (!config.headers['Content-Type']) {
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    // console.log('[Request Interceptor] Final Config Headers:', config.headers); // Optional verbose log
    return config;
  },
  (error) => {
    console.error("[Request Interceptor] Error:", error); // LOG
    return Promise.reject(error);
  }
);


// --- RESPONSE INTERCEPTOR WITH MORE LOGGING ---
api.interceptors.response.use(
    (response) => {
        console.log(`[Response Interceptor] Successful Response for URL: ${response.config.url}, Status: ${response.status}`); // LOG
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log(`[Response Interceptor] Error for URL: ${originalRequest.url}, Status: ${error.response?.status}`); // LOG

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            console.log(`[Response Interceptor] 401 on ${originalRequest.url}, attempting token refresh.`); // LOG
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                let refreshUrl = '';
                try {
                    console.log("[Response Interceptor] Attempting token refresh with refresh token from localStorage."); // LOG
                    const base = (apiUrl || '').replace(/\/$/, '');
                    const path = '/api/token/refresh/';
                    refreshUrl = `${base}${path}`;
                    console.log("[Response Interceptor] Constructed refresh URL:", refreshUrl); // LOG

                    const res = await axios.post(refreshUrl, { refresh: refreshToken });

                    if (res.status === 200 && res.data.access) {
                        console.log("[Response Interceptor] Token refreshed successfully."); // LOG
                        localStorage.setItem(ACCESS_TOKEN, res.data.access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                        console.log("[Response Interceptor] Retrying original request to:", originalRequest.url); // LOG
                        return api(originalRequest);
                    } else {
                         console.error("[Response Interceptor] Refresh endpoint succeeded but response invalid. Status:", res.status, "Data:", res.data); // LOG
                         localStorage.removeItem(ACCESS_TOKEN);
                         localStorage.removeItem(REFRESH_TOKEN);
                         delete api.defaults.headers.common['Authorization'];
                         console.log("[Response Interceptor] Redirecting to /signin due to invalid refresh response."); // LOG
                         window.location.href = '/signin';
                         return Promise.reject(error);
                    }
                } catch (refreshError: any) {
                    console.error("[Response Interceptor] Unable to refresh token. URL attempted:", refreshUrl, "Error:", refreshError?.response?.data || refreshError.message, "Status:", refreshError?.response?.status); // LOG
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    delete api.defaults.headers.common['Authorization'];
                    console.log("[Response Interceptor] Redirecting to /signin due to refresh error."); // LOG
                    window.location.href = '/signin';
                    return Promise.reject(refreshError);
                }
            } else {
                 console.log("[Response Interceptor] No refresh token available for refresh attempt."); // LOG
                 localStorage.removeItem(ACCESS_TOKEN);
                 localStorage.removeItem(REFRESH_TOKEN);
                 delete api.defaults.headers.common['Authorization'];
                 console.log("[Response Interceptor] Redirecting to /signin due to no refresh token."); // LOG
                 window.location.href = '/signin';
                 return Promise.reject(error);
            }
        }
        console.error(`[Response Interceptor] Non-401/retry error for ${originalRequest.url}:`, error.response?.data || error.message); // LOG
        return Promise.reject(error);
    }
);

// --- Existing API Functions ---
export const getUserProfile = async () => { try { const res = await api.get("/api/users/profile/"); return res.data; } catch (error) { console.error("Error fetching profile:", error); throw error; } };
export async function updateUserProfile(updatedData: any) { const res = await api.patch("/api/users/update/", updatedData); return res.data; }
export const updateUserProfilePicture = async (formData: FormData) => { try { const res = await api.patch("/api/users/profile/picture/", formData); return res.data; } catch (error) { console.error("Error updating profile picture:", error); throw error; } };
// --- ADDED API FUNCTION: Change Password ---
export const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const res = await api.patch("/api/users/change-password/", {
            old_password: oldPassword,
            new_password: newPassword
        });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};
export default api;