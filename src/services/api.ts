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
      // token invalid/expired - clear it so the next request doesn't retry with a bad token
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/** Extracts a readable message from an Axios/API error for display in the UI. */
export function getErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.message ||
    "Something went wrong. Please try again."
  );
}
