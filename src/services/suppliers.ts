import api from "./api";
import { ApiItemResponse, ApiListResponse, Supplier } from "../types";

export interface SupplierPayload {
  name: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
}

export const listSuppliers = (params?: { search?: string; status?: string }) =>
  api.get<ApiListResponse<Supplier>>("/suppliers", { params });

export const getSupplier = (id: number | string) =>
  api.get<ApiItemResponse<Supplier>>(`/suppliers/${id}`);

export const getSupplierLedger = (id: number | string) =>
  api.get(`/suppliers/${id}/ledger`);

export const createSupplier = (data: SupplierPayload) =>
  api.post<ApiItemResponse<Supplier>>("/suppliers", data);

export const updateSupplier = (id: number | string, data: Partial<SupplierPayload>) =>
  api.put<ApiItemResponse<Supplier>>(`/suppliers/${id}`, data);

export const deleteSupplier = (id: number | string) =>
  api.delete(`/suppliers/${id}`);
