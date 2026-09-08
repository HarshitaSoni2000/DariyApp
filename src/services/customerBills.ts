import api from "./api";
import { ApiItemResponse, ApiListResponse, CustomerBill, CustomerPayment } from "../types";

export const listCustomerBills = (params?: { customer_id?: number | string; status?: string }) =>
  api.get<ApiListResponse<CustomerBill>>("/customer-bills", { params });

export const getCustomerBill = (id: number | string) =>
  api.get<ApiItemResponse<CustomerBill & { payments: CustomerPayment[] }>>(`/customer-bills/${id}`);

export const generateCustomerBill = (data: {
  customer_id: number;
  period_start: string;
  period_end: string;
}) => api.post<ApiItemResponse<CustomerBill>>("/customer-bills/generate", data);

export const payCustomerBill = (
  id: number | string,
  data: { amount: number; payment_date: string; reference?: string; notes?: string }
) => api.post<ApiItemResponse<CustomerBill>>(`/customer-bills/${id}/payments`, data);

export const deleteCustomerBill = (id: number | string) =>
  api.delete(`/customer-bills/${id}`);
