import api from "./api";
import { ApiItemResponse, ApiListResponse, MarketRate } from "../types";

export const listMarketRates = () => api.get<ApiListResponse<MarketRate>>("/market-rates");

export const getActiveRate = () => api.get<ApiItemResponse<MarketRate>>("/market-rates/active");

export const createMarketRate = (data: { rate_per_litre: number; effective_from: string; notes?: string }) =>
  api.post<ApiItemResponse<MarketRate>>("/market-rates", data);

export const deleteMarketRate = (id: number | string) =>
  api.delete(`/market-rates/${id}`);
