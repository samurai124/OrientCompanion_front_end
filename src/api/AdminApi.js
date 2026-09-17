import { apiClient } from "./apiClient";

export const AdminApi = {
  getStats: () => apiClient.get("/admin/stats").then((r) => r.data),

  getRecentAssessments: () =>
    apiClient.get("/admin/assessments", { params: { page: 0, size: 5 } }).then((r) => r.data),
  getAssessments: () => apiClient.get("/admin/assessments").then((r) => r.data),

  getUsers: () => apiClient.get("/admin/users").then((r) => r.data),
  createUser: (data) => apiClient.post("/admin/users", data).then((r) => r.data),
  toggleUserStatus: (id, status) =>
    apiClient.patch(`/admin/users/${id}/status`, { status }).then((r) => r.data),
  resetUserPassword: (id, newPassword) =>
    apiClient.patch(`/admin/users/${id}/password`, { newPassword }).then((r) => r.data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`).then((r) => r.data),

  getFields: (params) => apiClient.get("/fields", { params }).then((r) => r.data),
  createField: (data) => apiClient.post("/admin/fields", data).then((r) => r.data),
  updateField: (id, data) => apiClient.put(`/admin/fields/${id}`, data).then((r) => r.data),
  deleteField: (id) => apiClient.delete(`/admin/fields/${id}`).then((r) => r.data),

  getSchools: (params) => apiClient.get("/schools", { params }).then((r) => r.data),
  createSchool: (data) => apiClient.post("/admin/schools", data).then((r) => r.data),
  updateSchool: (id, data) => apiClient.put(`/admin/schools/${id}`, data).then((r) => r.data),
  deleteSchool: (id) => apiClient.delete(`/admin/schools/${id}`).then((r) => r.data),

  getMentorshipSessions: () => apiClient.get("/admin/mentorship/sessions").then((r) => r.data),
  updateMentorshipSessionStatus: (id, status) =>
    apiClient.patch(`/admin/mentorship/sessions/${id}/status`, { status }).then((r) => r.data),
  getAuditLogs: () => apiClient.get("/admin/audit-logs").then((r) => r.data),
};