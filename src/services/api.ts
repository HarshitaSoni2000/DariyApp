import axios, { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../constants";
import { getStorageItem } from "../utils/helpers";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token automatically
api.interceptors.request.use((config) => {
  const token = getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // handle unauthorized (e.g. redirect to login)
    }
    return Promise.reject(error);
  }
);

export default api;

// Example resource-based service functions
export const getUsers = () => api.get("/users");
export const getUserById = (id: string | number) => api.get(`/users/${id}`);
export const createUser = (data: Record<string, unknown>) =>
  api.post("/users", data);
