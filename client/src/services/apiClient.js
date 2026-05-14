import axios from "axios";
import { API_BASE } from "../api";

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  } catch {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
});

apiClient.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default apiClient;

