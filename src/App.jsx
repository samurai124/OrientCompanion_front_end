import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { RecommendationProvider } from "./context/RecommendationContext";
import { FieldProvider } from "./context/FieldContext";
import { SchoolProvider } from "./context/SchoolContext";
import { MentorshipProvider } from "./context/MentorshipContext";
import { AdminProvider } from "./context/AdminContext";
import { CounselorProvider } from "./context/CounselorContext";
import AppRoutes from "./routes/AppRoutes";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <RecommendationProvider>
          <MentorshipProvider>
            <FieldProvider>
              <SchoolProvider>
                <AdminProvider>
                  <CounselorProvider>
                    {children}
                  </CounselorProvider>
                </AdminProvider>
              </SchoolProvider>
            </FieldProvider>
          </MentorshipProvider>
        </RecommendationProvider>
      </AssessmentProvider>
    </AuthProvider>
  );
}


function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("orient_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <ThemeInitializer />
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
