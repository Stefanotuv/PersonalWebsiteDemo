import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import PageMeta from "./PageMeta.tsx";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignInNew() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            navigate("/"); // Redirect to home if already logged in
        }
    }, []);

    return (
        <>
            <PageMeta
                title="React.js SignInNew Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js SignInNew Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </>
    );
}
