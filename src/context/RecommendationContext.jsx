import { createContext, useState, useCallback } from "react";
import { RecommendationApi } from "../api/recommendationApi";

export const RecommendationContext = createContext();

export function RecommendationProvider({ children }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = async (apiCall, defaultErrorMessage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall();
      setRecommendations(data || []);
    } catch (err) {
      setError(err.response?.data?.message || defaultErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRecommendations = useCallback(() => {
    return executeRequest(
      () => RecommendationApi.getMyRecommendations(),
      "Erreur lors du chargement des recommandations."
    );
  }, []);

  const regenerateRecommendations = () => {
    return executeRequest(
      () => RecommendationApi.regenerate(),
      "Erreur lors de la régénération des recommandations."
    );
  };

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        loading,
        error,
        fetchMyRecommendations,
        regenerateRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}