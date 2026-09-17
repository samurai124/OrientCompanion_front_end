import { apiClient } from "./apiClient";

export const CounselorApi = {

  getProfile: () => apiClient.get("/counselor/profile").then((r) => r.data),

  getSessions: () => apiClient.get("/counselor/mentorship/sessions").then((r) => r.data),

  updateSession: (id, data) =>
    apiClient.patch(`/counselor/mentorship/sessions/${id}`, data).then((r) => r.data),

  getPendingAssessments: () =>
    apiClient.get("/counselor/assessments/pending").then((r) => r.data),

  submitReview: (id, data) =>
    apiClient.post(`/counselor/assessments/${id}/review`, data).then((r) => r.data),

  getStudents: () => apiClient.get("/counselor/students").then((r) => r.data),
};
