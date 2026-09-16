import { createContext, useState, useCallback } from "react";
import { AssessmentApi } from "../api/assessmentApi";

export const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charge le profil d'évaluation depuis le backend.
   *
   * Gestion du 404 : si l'étudiant n'a pas encore passé son bilan,
   * le backend retourne 404 → on laisse profile = null sans afficher
   * d'erreur (c'est un état normal, pas une vraie erreur).
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AssessmentApi.getProfile();
      setProfile(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // Pas de bilan existant → état normal, profile reste null
        setProfile(null);
      } else {
        setError("Erreur lors du chargement du profil.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Soumet les scores du bilan au backend.
   * Retourne true si succès, false sinon.
   */
  const submitAssessment = async (assessmentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AssessmentApi.submit(assessmentData);
      setProfile(data);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la soumission du bilan.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
        submitAssessment,
        // true uniquement si le profil est chargé ET contient des données réelles
        hasCompletedAssessment: Boolean(profile),
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}