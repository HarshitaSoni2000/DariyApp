import api from "./api";

export const purchaseReport = (params?: { from?: string; to?: string; supplier_id?: string | number }) =>
  api.get("/reports/purchases", { params });

export const salesReport = (params?: { from?: string; to?: string; customer_id?: string | number }) =>
  api.get("/reports/sales", { params });

export const supplierOutstandingReport = () => api.get("/reports/supplier-outstanding");

export const customerOutstandingReport = () => api.get("/reports/customer-outstanding");

export const paymentsReport = (params?: { from?: string; to?: string }) =>
  api.get("/reports/payments", { params });
