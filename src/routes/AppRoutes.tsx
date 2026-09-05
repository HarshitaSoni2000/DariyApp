import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";
import Operations from "../pages/Operations/Operations";
import { ROUTES } from "../constants";

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path="/suppliers" element={<Operations />} />
        <Route path="/purchases" element={<Operations />} />
        <Route path="/supplier-bills" element={<Operations />} />
        <Route path="/customers" element={<Operations />} />
        <Route path="/sales" element={<Operations />} />
        <Route path="/customer-bills" element={<Operations />} />
        <Route path="/payments" element={<Operations />} />
        <Route path="/adjustments" element={<Operations />} />
        <Route path="/market-rates" element={<Operations />} />
        <Route path="/reports" element={<Operations />} />
        <Route path="/settings" element={<Operations />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
