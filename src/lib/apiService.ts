import apiClient from "./axios";

export const apiService = {
  get: async (url: string, params?: object) => {
    const res = await apiClient.get(url, { params });
    return res.data;
  },

  post: async (url: string, data?: object) => {
    const res = await apiClient.post(url, data);
    return res.data;
  },

  put: async (url: string, data?: object) => {
    const res = await apiClient.put(url, data);
    return res.data;
  },

  patch: async (url: string, data?: object) => {
    const res = await apiClient.patch(url, data);
    return res.data;
  },

  delete: async (url: string) => {
    const res = await apiClient.delete(url);
    return res.data;
  },
};
