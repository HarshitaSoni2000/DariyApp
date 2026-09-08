import api from "./api";
import { STORAGE_KEYS } from "../constants";
import { setStorageItem, getStorageItem } from "../utils/helpers";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "owner" | "staff";
}

export const login = async (email: string, password: string) => {
  const res = await api.post<{ success: boolean; data: { user: AuthUser; token: string } }>(
    "/auth/login",
    { email, password }
  );
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, res.data.data.token);
  setStorageItem(STORAGE_KEYS.USER, res.data.data.user);
  return res.data.data;
};

export const register = async (data: { name: string; email: string; phone?: string; password: string; role?: string }) => {
  const res = await api.post<{ success: boolean; data: { user: AuthUser; token: string } }>(
    "/auth/register",
    data
  );
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, res.data.data.token);
  setStorageItem(STORAGE_KEYS.USER, res.data.data.user);
  return res.data.data;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = () => getStorageItem<AuthUser>(STORAGE_KEYS.USER);

export const isAuthenticated = () => !!getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
