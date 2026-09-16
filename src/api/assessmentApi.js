import { apiClient } from "./apiClient";
export const AssessmentApi = {
  // Submit the orientation assessment (RIASEC scores, academic grades, interests)
  submit: async (data) => {
    const response = await apiClient.post("/student/assessment", data);
    return response.data;
  },

  // Get the assessment profile for the currently logged-in student
  getProfile: async () => {
    const response = await apiClient.get("/student/assessment");
    return response.data;
  },
};
