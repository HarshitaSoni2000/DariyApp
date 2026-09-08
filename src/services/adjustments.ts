import api from "./api";
import { Adjustment, ApiItemResponse, ApiListResponse } from "../types";

export interface AdjustmentPayload {
  adjustment_type: "khowa_yield" | "carry_forward";
  party_type: "supplier" | "customer";
  party_id: number;
  adjustment_date: string;
  entry_type: "credit" | "debit";
  details?: string;
  amount?: number;
}

export const listAdjustments = (params?: { type?: string; party_type?: string; party_id?: number | string }) =>
  api.get<ApiListResponse<Adjustment>>("/adjustments", { params });

export const createAdjustment = (data: AdjustmentPayload) =>
  api.post<ApiItemResponse<Adjustment>>("/adjustments", data);

export const updateAdjustment = (id: number | string, data: Partial<AdjustmentPayload>) =>
  api.put<ApiItemResponse<Adjustment>>(`/adjustments/${id}`, data);

export const deleteAdjustment = (id: number | string) =>
  api.delete(`/adjustments/${id}`);
