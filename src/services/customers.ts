import api from "./api";
import { ApiItemResponse, ApiListResponse, Customer } from "../types";

export interface CustomerPayload {
  name: string;
  phone?: string;
  address?: string;
  payment_cycle?: "7day" | "10day" | "daily";
  status?: "active" | "inactive";
}

export const listCustomers = (params?: { search?: string; cycle?: string; status?: string }) =>
  api.get<ApiListResponse<Customer>>("/customers", { params });

export const getCustomer = (id: number | string) =>
  api.get<ApiItemResponse<Customer>>(`/customers/${id}`);

export const getCustomerLedger = (id: number | string) =>
  api.get(`/customers/${id}/ledger`);

export const createCustomer = (data: CustomerPayload) =>
  api.post<ApiItemResponse<Customer>>("/customers", data);

export const updateCustomer = (id: number | string, data: Partial<CustomerPayload>) =>
  api.put<ApiItemResponse<Customer>>(`/customers/${id}`, data);

export const deleteCustomer = (id: number | string) =>
  api.delete(`/customers/${id}`);
