import apiClient from "./apiClient";

export const getSession = () => apiClient.get("/api/auth/session");
