import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

// ── Providers de contextes ─────────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { RecommendationProvider } from "./context/RecommendationContext";
import { FieldProvider } from "./context/FieldContext";
import { SchoolProvider } from "./context/SchoolContext";
import { MentorshipProvider } from "./context/MentorshipContext";

// ── Arborescence des routes ────────────────────────────────────────────────
import AppRoutes from "./routes/AppRoutes";

/**
 * App — Composant racine de OrientCompanion.
 *
 * Architecture des providers (du plus externe au plus interne) :
 *
 *   BrowserRouter           → Contexte de navigation React Router
 *   └─ SchoolProvider       → Données des établissements (CRUD admin)
 *      └─ FieldProvider     → Données des filières (CRUD admin)
 *         └─ MentorshipProvider  → Sessions conseiller / étudiant
 *            └─ RecommendationProvider  → Recommandations post-bilan
 *               └─ AssessmentProvider  → Profil RIASEC et état du bilan
 *                  └─ AuthProvider     → JWT, user, isAuthenticated
 *                     └─ AppRoutes     → Toutes les routes de l'app
 *
 * Note : AuthProvider est le plus interne car toutes les couches métier
 * peuvent dépendre du token, mais AuthProvider ne doit pas dépendre d'elles.
 */
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

/**
 * ThemeInitializer — Applique le thème persisté au <html> au plus tôt,
 * avant le premier rendu visible, pour éviter le flash de thème.
 */
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
