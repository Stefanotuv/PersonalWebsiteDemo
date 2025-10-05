// src/components/ProtectedRoute.tsx (or wherever it lives)
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx"; // Adjust path as needed

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth(); // Get state from context

    if (isLoading) {
        // Show a loading indicator while the AuthProvider is initializing
        return <div>Loading Authentication...</div>;
    }

    // If loading is finished, check if authenticated
    // If yes, render the child route components via <Outlet />
    // If no, redirect the user to the sign-in page
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />; // Use replace to prevent history buildup
};

export default ProtectedRoute;


