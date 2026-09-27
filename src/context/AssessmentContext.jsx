import { createContext, useState } from "react";
import { AssessmentApi } from "../api/assessmentApi";

export const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AssessmentApi.getProfile();
      setProfile(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setProfile(null);
      } else {
        setError("Erreur lors du chargement du profil.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        hasCompletedAssessment: Boolean(profile),
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}