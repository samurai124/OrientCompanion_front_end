import { apiClient } from "./apiClient";

export const FieldApi = {
  findAll: async (category, search) => {
    const response = await apiClient.get("/fields", {
      params: { category, search },
    });
    return response.data;
  },

  findById: async (id) => {
    const response = await apiClient.get(`/fields/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/admin/fields", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/admin/fields/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/admin/fields/${id}`);
    return response.data;
  },
};
