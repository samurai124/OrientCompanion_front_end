import { apiClient } from "./apiClient";
export const AssessmentApi = {

  submit: async (data) => {
    const response = await apiClient.post("/student/assessment", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/student/assessment");
    return response.data;
  },
};
