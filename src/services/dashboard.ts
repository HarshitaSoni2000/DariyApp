import api from "./api";
import { ApiItemResponse, DashboardData } from "../types";

export const getDashboard = () => api.get<ApiItemResponse<DashboardData>>("/dashboard");
