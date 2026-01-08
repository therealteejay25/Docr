import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

// Log the API configuration for debugging
if (typeof window !== "undefined") {
  console.log("API Configuration:", {
    baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
    API_BASE_URL,
    API_VERSION,
  });
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/${API_VERSION}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", response.data.accessToken);
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/auth";
        }
      } else {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

