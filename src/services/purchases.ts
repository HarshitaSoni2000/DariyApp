import api from "./api";
import { ApiItemResponse, ApiListResponse, Purchase } from "../types";

export interface PurchasePayload {
  supplier_id: number;
  purchase_date: string;
  litres: number;
  fat: number;
  rate: number;
  cans?: number;
}

export const listPurchases = (params?: { supplier_id?: number | string; from?: string; to?: string }) =>
  api.get<ApiListResponse<Purchase>>("/purchases", { params });

export const getPurchase = (id: number | string) =>
  api.get<ApiItemResponse<Purchase>>(`/purchases/${id}`);

export const createPurchase = (data: PurchasePayload) =>
  api.post<ApiItemResponse<Purchase>>("/purchases", data);

export const updatePurchase = (id: number | string, data: Partial<PurchasePayload>) =>
  api.put<ApiItemResponse<Purchase>>(`/purchases/${id}`, data);

export const deletePurchase = (id: number | string) =>
  api.delete(`/purchases/${id}`);
