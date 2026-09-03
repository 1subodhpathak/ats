import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/careersense/ats",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const clerkId = window.clerkUserId || window.Clerk?.user?.id || "";
  if (clerkId) {
    config.headers["x-clerk-user-id"] = clerkId;
    config.params = { ...config.params, clerkId };
  }

  if (window.clerkGetToken) {
    try {
      const token = await window.clerkGetToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching Clerk token in interceptor:", error);
    }
  }
  return config;
});

export default apiClient;
