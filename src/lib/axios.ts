import axios from "axios";
import * as jose from "jose";
import { accessSecret, baseUrl } from "./config";

const baseURL = baseUrl;

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
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for refresh logic
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 1️⃣ Skip token refresh for login/register requests
    if (
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/register")
    ) {
      return Promise.reject(error);
    }

    // 2️⃣ Handle 401 errors for protected routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 3️⃣ Call refresh token endpoint
        const response = await apiClient.post("/user/refresh-token");

        // 4️⃣ Extract access token from cookie
        const cookieHeader = response.headers["set-cookie"] || "";
        const accessTokenMatch = cookieHeader
          .toString()
          .match(/accessToken=([^;]+)/);
        if (!accessTokenMatch) throw new Error("No access token found");

        const newAccessToken = accessTokenMatch[1];

        // 5️⃣ Optionally decode JWT if needed (for expiry, etc.)
        await jose.jwtVerify(
          newAccessToken,
          new TextEncoder().encode(accessSecret || ""),
        );

        // 6️⃣ Set Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        // Clear cookie or token here if needed
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        if (typeof window !== "undefined") {
          window.location.href = "/login"; // only redirect if refresh fails
        }
      }
    }

    // 7️⃣ Forward all other errors to React Query
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      status: error?.response?.status,
      data: error?.response?.data,
    });
  },
);

export default apiClient;
