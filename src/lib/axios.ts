import axios from "axios";
import { baseUrl } from "./config";

const baseURL = baseUrl;

// Maximum number of retry attempts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Extend Axios config to include custom retry properties
declare module "axios" {
  export interface AxiosRequestConfig {
    _retryCount?: number;
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL,
  timeout: 60000, // Increased to 60 seconds for production
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Initialize retry count in config metadata, not headers
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor with retry logic and token refresh
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors with retry logic (timeout, connection refused, etc.)
    // Only retry idempotent methods to avoid duplicate side effects
    if (!error.response && originalRequest) {
      const method = originalRequest.method?.toUpperCase();
      const isIdempotent = ["GET", "HEAD", "OPTIONS"].includes(method || "");

      if (isIdempotent) {
        const retryCount = originalRequest._retryCount || 0;

        if (retryCount < MAX_RETRIES) {
          originalRequest._retryCount = retryCount + 1;

          // Exponential backoff: 1s, 2s, 4s
          const delay = RETRY_DELAY * Math.pow(2, retryCount);

          console.log(
            `Retrying request (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms...`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return apiClient(originalRequest);
        }
      }
    }

    // Skip token refresh for login/register requests
    if (
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/register")
    ) {
      return Promise.reject({
        status: error?.response?.status,
        data: error?.response?.data || {
          success: false,
          message: error?.message || "Request failed",
        },
        message: error?.message || "Request failed",
      });
    }

    // Handle 401 errors for protected routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject({
          status: error?.response?.status,
          data: error?.response?.data || {
            success: false,
            message: error?.message || "Unauthorized",
          },
          message: error?.message || "Unauthorized",
        });
      }
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await apiClient.post("/user/refresh-token");

        // Extract access token from response
        const newAccessToken = response.data.data.accessToken;
        if (!newAccessToken) throw new Error("No access token found");

        // Store new tokens (removed JWT verification for better performance)
        localStorage.setItem("accessToken", newAccessToken);
        if (response.data.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }

        // Set Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err: any) {
        console.error("Token refresh failed:", err);
        // Clear tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        
        // Return consistent error shape
        return Promise.reject({
          status: err?.response?.status,
          data: err?.response?.data || {
            success: false,
            message: err?.message || "Token refresh failed",
          },
          message: err?.message || "Token refresh failed",
        });
      }
    }

    // Return consistent error format for all cases
    return Promise.reject({
      status: error?.response?.status,
      data: error?.response?.data || {
        success: false,
        message: error?.message || "Request failed",
      },
      message: error?.message || "Request failed",
    });
  },
);

export default apiClient;
