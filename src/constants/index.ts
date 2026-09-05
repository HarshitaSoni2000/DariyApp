export const APP_NAME = import.meta.env.VITE_APP_NAME || "Subhash Dairy";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const ROUTES = {
  HOME: "/dashboard",
  SUPPLIERS: "/suppliers",
  PURCHASES: "/purchases",
  SUPPLIER_BILLS: "/supplier-bills",
  CUSTOMERS: "/customers",
  SALES: "/sales",
  CUSTOMER_BILLS: "/customer-bills",
  PAYMENTS: "/payments",
  ADJUSTMENTS: "/adjustments",
  MARKET_RATES: "/market-rates",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  ABOUT: "/about",
  NOT_FOUND: "*",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user_data",
} as const;
