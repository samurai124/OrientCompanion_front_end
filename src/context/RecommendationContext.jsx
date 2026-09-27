import { createContext, useState } from "react";
import { RecommendationApi } from "../api/recommendationApi";

export const RecommendationContext = createContext();

export function RecommendationProvider({ children }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RecommendationApi.getMyRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des recommandations.");
    } finally {
      setLoading(false);
    }
  };

  const regenerateRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RecommendationApi.regenerate();
      setRecommendations(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la régénération des recommandations.");
    } finally {
      setLoading(false);
    }
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