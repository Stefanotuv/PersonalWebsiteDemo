import PageMeta from "./PageMeta.tsx";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUpNew() {
  return (
    <>
      <PageMeta
        title="React.js SignUpNew Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUpNew Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
