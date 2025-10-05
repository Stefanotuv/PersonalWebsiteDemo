//main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./pages/AuthPages/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "jquery";
import { BrowserRouter as Router } from "react-router-dom";
import {AuthProvider} from "./context/AuthContext.tsx"; // <-- ADD THIS


createRoot(document.getElementById("root")!).render(
  <StrictMode>
       <Router> {/* <-- MOVE Router TO HERE */}
    <ThemeProvider>
        <AuthProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
            </AuthProvider>
    </ThemeProvider>

       </Router>
  </StrictMode>
);
