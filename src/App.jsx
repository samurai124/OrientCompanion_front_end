import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { RecommendationProvider } from "./context/RecommendationContext";
import { FieldProvider } from "./context/FieldContext";
import { SchoolProvider } from "./context/SchoolContext";
import { MentorshipProvider } from "./context/MentorshipContext";
import AppRoutes from "./routes/AppRoutes";

function AppProviders({ children }) {
  return (
    <SchoolProvider>
      <FieldProvider>
        <MentorshipProvider>
          <RecommendationProvider>
            <AssessmentProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </AssessmentProvider>
          </RecommendationProvider>
        </MentorshipProvider>
      </FieldProvider>
    </SchoolProvider>
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
