import api from "./api";
import { ApiItemResponse, ApiListResponse, SupplierBill, SupplierPayment } from "../types";

export const listSupplierBills = (params?: { supplier_id?: number | string; status?: string }) =>
  api.get<ApiListResponse<SupplierBill>>("/supplier-bills", { params });

export const getSupplierBill = (id: number | string) =>
  api.get<ApiItemResponse<SupplierBill & { payments: SupplierPayment[] }>>(`/supplier-bills/${id}`);

export const generateSupplierBill = (data: {
  supplier_id: number;
  period_start: string;
  period_end: string;
  settlement_date?: string;
}) => api.post<ApiItemResponse<SupplierBill>>("/supplier-bills/generate", data);

export const paySupplierBill = (
  id: number | string,
  data: { amount: number; payment_date: string; type?: string; reference?: string; notes?: string }
) => api.post<ApiItemResponse<SupplierBill>>(`/supplier-bills/${id}/payments`, data);

export const deleteSupplierBill = (id: number | string) =>
  api.delete(`/supplier-bills/${id}`);
