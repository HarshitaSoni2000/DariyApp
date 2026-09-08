export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive";
  total_litres_purchased?: number;
  outstanding_amount?: number;
  created_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  payment_cycle: "7day" | "10day" | "daily";
  status: "active" | "inactive";
  total_litres_sold?: number;
  outstanding_amount?: number;
  created_at?: string;
}

export interface Purchase {
  id: number;
  supplier_id: number;
  supplier_name?: string;
  purchase_date: string;
  cans: number;
  litres: number;
  fat: number;
  rate: number;
  amount: number;
}

export interface Sale {
  id: number;
  customer_id: number;
  customer_name?: string;
  sale_date: string;
  cans: number;
  litres: number;
  rate: number;
  amount: number;
}

export interface SupplierBill {
  id: number;
  bill_number: string;
  supplier_id: number;
  supplier_name?: string;
  period_start: string;
  period_end: string;
  total_litres: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  settlement_date: string | null;
  status: "open" | "partially_paid" | "settled" | "business_rule_pending";
}

export interface CustomerBill {
  id: number;
  bill_number: string;
  customer_id: number;
  customer_name?: string;
  period_start: string;
  period_end: string;
  total_qty: number;
  total_amount: number;
  paid_amount: number;
  adjustment_amount: number;
  balance_amount: number;
  status: "open" | "partially_paid" | "settled";
}

export interface SupplierPayment {
  id: number;
  supplier_id: number;
  payment_date: string;
  type: "advance" | "settlement" | "partial";
  reference: string | null;
  amount: number;
  notes: string | null;
}

export interface CustomerPayment {
  id: number;
  customer_id: number;
  payment_date: string;
  reference: string | null;
  amount: number;
  notes: string | null;
}

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

export interface Adjustment {
  id: number;
  adjustment_type: "khowa_yield" | "carry_forward";
  party_type: "supplier" | "customer";
  party_id: number;
  party_name?: string;
  adjustment_date: string;
  entry_type: "credit" | "debit";
  details: string | null;
  amount: number | null;
  status: "confirmed" | "business_rule_pending";
}

export interface MarketRate {
  id: number;
  rate_per_litre: number;
  effective_from: string;
  effective_to: string | null;
  notes: string | null;
}

export interface Settings {
  id: number;
  business_name: string;
  owner_name: string | null;
  phone: string | null;
  default_unit: string;
  currency: string;
}

export interface DashboardData {
  snapshot: {
    todays_milk_purchased_litres: number;
    todays_milk_sold_litres: number;
    current_market_rate: number | null;
    current_rate_effective_from: string | null;
    todays_purchase_amount: number;
    todays_sales_amount: number;
    supplier_outstanding: number;
    customer_outstanding: number;
  };
  pending_bills: {
    supplier_bills: number;
    customer_bills: number;
  };
  recent_purchases: Purchase[];
  recent_sales: Sale[];
  recent_payments: { payment_date: string; party: string; type: string; amount: number }[];
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
