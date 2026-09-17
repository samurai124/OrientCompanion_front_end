import { apiClient } from "./apiClient";

export const MentorshipApi = {

  getAvailableCounselors: async (fieldId) => {
    const response = await apiClient.get("/student/mentorship/counselors", {
      params: { fieldId },
    });
    return response.data;
  },

  requestSession: async (counselorId) => {
    const response = await apiClient.post("/student/mentorship/sessions", {
      counselorId,
    });
    return response.data;
  },

  getMySessionsAsStudent: async () => {
    const response = await apiClient.get("/student/mentorship/sessions");
    return response.data;
  },

  getMySessionsAsCounselor: async () => {
    const response = await apiClient.get("/counselor/mentorship/sessions");
    return response.data;
  },

  updateSession: async (sessionId, updateData) => {
    const response = await apiClient.patch(
      `/counselor/mentorship/sessions/${sessionId}`,
      updateData
    );
    return response.data;
  },
};