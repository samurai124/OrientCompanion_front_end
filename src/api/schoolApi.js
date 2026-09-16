import { apiClient } from "./apiClient";

export const SchoolApi = {
  findAll: async (fieldId) => {
    const response = await apiClient.get("/schools", {
      params: { fieldId },
    });
    return response.data;
  },

  findById: async (id) => {
    const response = await apiClient.get(`/schools/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/admin/schools", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/admin/schools/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/admin/schools/${id}`);
    return response.data;
  },
};
