import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NotFound from "./pages/personalsite/components/NotFound.tsx";
import { ScrollToTop } from "./pages/personalsite/layout/ScrollToTop.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import ProtectedRouteSuperuser from "./components/auth/ProtectedRouteSuperuser.tsx";
import 'flowbite';
import "simple-datatables/dist/style.css";
import AppLayoutNewLoggedIn from "./pages/personalsite/layout/AppLayoutNewLoggedIn.tsx";
import Welcome from "./pages/personalsite/Welcome.tsx";
import SignInNew from "./pages/personalsite/auth/SignInNew.tsx";
import SignUpNew from "./pages/personalsite/auth/SignUpNew.tsx";
import DashboardPage from "./pages/personalsite/DashboardPage.tsx";
import ResetPassword from "./pages/AuthPages/ResetPassword.tsx";
import ForgotPassword from "./pages/AuthPages/ForgotPassword.tsx";
import CVPage from "./pages/personalsite/CVPage.tsx";
import OnlinePresencePage from "./pages/personalsite/OnlinePresencePage.tsx";
import AboutPage from "./pages/personalsite/AboutPage.tsx";
import DocumentManagementPage from "./pages/personalsite/document_store/DocumentManagementPage.tsx";
import PhotoManagementPage from "./pages/personalsite/photo_store/PhotoManagementPage.tsx";
import GalleryManagementPage from "./pages/personalsite/photo_store/GalleryManagementPage.tsx";
import ProfilePage from "./pages/personalsite/ProfilePage.tsx";


export default function App() {


    return (
    <>
        <>
          <ScrollToTop />
          <Routes>
              {/* Public routes - UNCHANGED */}
              <Route path="/login" element={<SignInNew />} />
              <Route path="/signin" element={<SignInNew />} />
              <Route path="/register" element={<SignUpNew />} />
              <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
              <Route element={<AppLayoutNewLoggedIn />}>
                {/* Your existing logged-in routes - UNCHANGED */}
                {/*<Route path="/welcome" element={<NewWelcome />} />*/}
                <Route path="/" element={<Welcome />} /> {/* Note: Duplicate path '/' */}

                {/*<Route path="/contact-us" element={<ContactUsPage />} />*/}

                <Route path="/cv" element={<CVPage />} /> {/* CV Page */}
                <Route path="/on-the-web" element={<OnlinePresencePage />} /> {/* Online Presence Page */}
                <Route path="/about" element={<AboutPage />} /> {/* About This Website Page */}

                <Route element={<ProtectedRoute />}>
                {/*<Route path="/profile" element={<UserProfiles />} />*/}

                  {/* Routes requiring superuser status (ProtectedRouteSuperuser) */}
                  <Route element={<ProtectedRouteSuperuser />}>
                    <Route path="/documents" element={<DocumentManagementPage />} />
                    <Route path="/photos" element={<PhotoManagementPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/galleries" element={<GalleryManagementPage />} />
                    <Route path="/profile" element={<ProfilePage />} />


                  </Route>
                </Route>
              </Route>
            </Routes>
        </>
    </>
  );
}

