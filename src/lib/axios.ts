import axios from "axios";
import * as jose from 'jose';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Get token from JWT in cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for refresh logic
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post("/auth/refresh");
        // Assuming the refresh endpoint returns a new token
        const newToken = response.data.token;
        
        // Verify and decode the token using jose
        const { payload } = await jose.jwtVerify(
          newToken,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')
        );
        
        // Set the token in cookie with expiry from JWT payload
        document.cookie = `token=${newToken}; expires=${new Date(payload.exp! * 1000).toUTCString()}; path=/`;
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // retry the failed request
      } catch (err) {
        console.error("Token refresh failed:", err);
        // Clear token on refresh failure
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        if (typeof window !== "undefined") {
          window.location.href = "/login"; // client-side redirect
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
