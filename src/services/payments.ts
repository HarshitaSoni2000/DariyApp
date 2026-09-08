import api from "./api";
import { ApiListResponse } from "../types";

export interface CombinedPayment {
  id: number;
  payment_date: string;
  party: string;
  party_type: "supplier" | "customer";
  type: string;
  reference: string | null;
  amount: number;
  notes: string | null;
}

export const listAllPayments = () => api.get<ApiListResponse<CombinedPayment>>("/payments");

export const createSupplierPayment = (data: {
  supplier_id: number;
  amount: number;
  payment_date: string;
  type?: string;
  reference?: string;
  notes?: string;
}) => api.post("/payments/supplier", data);

export const createCustomerPayment = (data: {
  customer_id: number;
  amount: number;
  payment_date: string;
  reference?: string;
  notes?: string;
}) => api.post("/payments/customer", data);

export const deleteSupplierPayment = (id: number | string) =>
  api.delete(`/payments/supplier/${id}`);

export const deleteCustomerPayment = (id: number | string) =>
  api.delete(`/payments/customer/${id}`);
