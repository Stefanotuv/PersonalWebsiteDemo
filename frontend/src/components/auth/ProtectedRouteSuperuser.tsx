// import { Navigate, Outlet } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api, { getUserProfile } from "../api";
// import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
// import { useState, useEffect } from "react";
//
// const ProtectedRouteSuperuser = () => {
//     const [isAuthorized, setIsAuthorized] = useState(null);
//     const [user, setUser] = useState(null);
//
//     useEffect(() => {
//         let isMounted = true;
//         auth(isMounted).catch(() => setIsAuthorized(false));
//         return () => { isMounted = false; };
//     }, []);
//
//     const refreshToken = async () => {
//         const refreshToken = localStorage.getItem(REFRESH_TOKEN);
//         if (!refreshToken) {
//             setIsAuthorized(false);
//             return;
//         }
//
//         try {
//             const res = await api.post("/backend/api/token/refresh/", { refresh: refreshToken });
//             if (res.status === 200) {
//                 localStorage.setItem(ACCESS_TOKEN, res.data.access);
//                 setIsAuthorized(true);
//             } else {
//                 setIsAuthorized(false);
//             }
//         } catch (error) {
//             console.error("Error refreshing token:", error);
//             setIsAuthorized(false);
//         }
//     };
//
//     const auth = async (isMounted) => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             setIsAuthorized(false);
//             return;
//         }
//
//         try {
//             const decoded = jwtDecode(token);
//             const tokenExpiration = decoded.exp;
//             const now = Date.now() / 1000;
//
//             if (tokenExpiration < now) {
//                 await refreshToken();
//             } else {
//                 setIsAuthorized(true);
//             }
//
//             const profile = await getUserProfile();
//             debugger
//             if (isMounted && profile) {
//                 setUser(profile);
//                 if (!profile.is_staff) {
//                     setIsAuthorized(false); // Block non-superusers
//                 }
//             }
//         } catch (error) {
//             console.error("Error decoding token or fetching profile:", error);
//             setIsAuthorized(false);
//         }
//     };
//
//     if (isAuthorized === null) {
//         return <div>Loading...</div>;
//     }
//
//     return isAuthorized ? (
//         <Outlet context={{ user }} />
//     ) : (
//         <Navigate to="/signin" />
//     );
// };
//
// export default ProtectedRouteSuperuser;

// src/components/ProtectedRouteSuperuser.tsx (Example)
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

const ProtectedRouteSuperuser = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading Authentication...</div>;
    }

    // Must be authenticated AND be a superuser
    // Add 'is_superuser' to your User interface in AuthContext.tsx
    // and ensure your backend API returns it in the user profile.
    const isSuperuser = user?.is_staff === true;

    if (!isAuthenticated) {
         // Redirect to signin if not authenticated at all
        return <Navigate to="/signin" replace />;
    }

    if (!isSuperuser) {
        // Redirect to a safe page (like home or profile) if authenticated but NOT a superuser
        // Or show an "Unauthorized" component
        console.warn("Access Denied: User is not a superuser.");
        return <Navigate to="/" replace />; // Or <Navigate to="/unauthorized" />
    }

    // If authenticated and is a superuser, render the child routes
    return <Outlet />;
};

export default ProtectedRouteSuperuser;
