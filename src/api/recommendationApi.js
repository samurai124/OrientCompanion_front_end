import { apiClient } from "./apiClient";

export const RecommendationApi = {
  getMyRecommendations: async () => {
    const response = await apiClient.get("/student/recommendations");
    return response.data;
  },

  regenerate: async () => {
    const response = await apiClient.post("/student/recommendations/regenerate");
    return response.data;
  },
};
