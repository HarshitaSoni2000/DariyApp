import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";
import Suppliers from "../pages/Suppliers/Suppliers";
import Customers from "../pages/Customers/Customers";
import Purchases from "../pages/Purchases/Purchases";
import Sales from "../pages/Sales/Sales";
import SupplierBills from "../pages/SupplierBills/SupplierBills";
import CustomerBills from "../pages/CustomerBills/CustomerBills";
import Payments from "../pages/Payments/Payments";
import Adjustments from "../pages/Adjustments/Adjustments";
import MarketRates from "../pages/MarketRates/MarketRates";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import { ROUTES } from "../constants";

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/supplier-bills" element={<SupplierBills />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/customer-bills" element={<CustomerBills />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/adjustments" element={<Adjustments />} />
        <Route path="/market-rates" element={<MarketRates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
