import api from "./api";
import { ApiItemResponse, Settings } from "../types";

export const getSettings = () => api.get<ApiItemResponse<Settings>>("/settings");

export const updateSettings = (data: Partial<Settings>) =>
  api.put<ApiItemResponse<Settings>>("/settings", data);
