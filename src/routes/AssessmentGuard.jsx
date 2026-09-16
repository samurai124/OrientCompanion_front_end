import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AssessmentContext } from "../context/AssessmentContext";

/**
 * AssessmentGuard
 *
 * Garde intermédiaire pour les routes qui nécessitent un bilan complété.
 * Si `hasCompletedAssessment` est faux, l'étudiant est redirigé vers /assessment
 * avec l'URL cible sauvegardée dans location.state pour un éventuel retour
 * automatique après complétion du bilan.
 *
 * Utilisation dans AppRoutes :
 *   <Route element={<AssessmentGuard />}>
 *     <Route path="/recommendations" element={<RecommendationsPage />} />
 *   </Route>
 */
export default function AssessmentGuard() {
  const { hasCompletedAssessment, loading } = useContext(AssessmentContext);
  const location = useLocation();

  // Pendant le chargement initial du profil, on ne redirige pas prématurément
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "1rem",
          color: "var(--text-muted, #888)",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>⏳</span>
        <p>Vérification du profil en cours…</p>
      </div>
    );
  }

  // Bilan non complété → redirection vers /assessment
  // On mémorise la destination initiale pour y revenir après complétion
  if (!hasCompletedAssessment) {
    return (
      <Navigate
        to="/assessment"
        state={{ redirectAfterAssessment: location.pathname }}
        replace
      />
    );
  }

  // Bilan complété → accès autorisé
  return <Outlet />;
}
