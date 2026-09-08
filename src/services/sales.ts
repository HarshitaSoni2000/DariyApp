import api from "./api";
import { ApiItemResponse, ApiListResponse, Sale } from "../types";

export interface SalePayload {
  customer_id: number;
  sale_date: string;
  litres: number;
  rate?: number;
  cans?: number;
}

export const listSales = (params?: { customer_id?: number | string; from?: string; to?: string }) =>
  api.get<ApiListResponse<Sale>>("/sales", { params });

export const getSale = (id: number | string) =>
  api.get<ApiItemResponse<Sale>>(`/sales/${id}`);

export const createSale = (data: SalePayload) =>
  api.post<ApiItemResponse<Sale>>("/sales", data);

export const updateSale = (id: number | string, data: Partial<SalePayload>) =>
  api.put<ApiItemResponse<Sale>>(`/sales/${id}`, data);

export const deleteSale = (id: number | string) =>
  api.delete(`/sales/${id}`);
