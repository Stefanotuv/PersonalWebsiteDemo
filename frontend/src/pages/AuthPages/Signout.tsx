// Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data (e.g., remove token from localStorage or sessionStorage)
        localStorage.removeItem("authToken"); // Example for localStorage

        // Redirect to the login page
        navigate("/signin");
    }, [navigate]);

    return null; // You can show a loading indicator or similar here if needed
};

export default Signout;
