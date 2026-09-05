import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const primaryLinks = [["Dashboard", ROUTES.HOME], ["Suppliers / Dairies", ROUTES.SUPPLIERS], ["Milk Purchases", ROUTES.PURCHASES], ["Supplier Bills", ROUTES.SUPPLIER_BILLS], ["Customers", ROUTES.CUSTOMERS], ["Milk Sales", ROUTES.SALES], ["Customer Bills", ROUTES.CUSTOMER_BILLS], ["Payments / Ledger", ROUTES.PAYMENTS], ["Adjustments", ROUTES.ADJUSTMENTS]];
const secondaryLinks = [["Market Rates", ROUTES.MARKET_RATES], ["Reports", ROUTES.REPORTS], ["Settings", ROUTES.SETTINGS]];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 760);
  return (
    <>
      <header className="topbar"><button className="icon-button menu-button" aria-label={isOpen ? "Close navigation" : "Open navigation"} onClick={() => setIsOpen(!isOpen)}>☰</button><Link to={ROUTES.HOME} className="brand-lockup"><span className="brand-mark">✦</span><span><strong>Subhash Dairy</strong><small>Dairy Business Manager</small></span></Link><div className="topbar-actions"><span className="date-chip">05 Sep 2026</span><button className="icon-button" aria-label="Settings">⚙</button></div></header>
      {isOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setIsOpen(false)} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}><div className="sidebar-heading"><span className="brand-mark">✦</span><span><b>Subhash Dairy</b><small>Business Manager</small></span><button className="close-nav" onClick={() => setIsOpen(false)}>×</button></div><nav aria-label="Main navigation"><p className="nav-label">Workspace</p>{primaryLinks.map(([label, path], index) => <Link key={label} className="nav-link" to={path} onClick={() => setIsOpen(false)}><i>{["⌂", "♧", "↓", "▤", "♙", "↑", "▤", "₹", "↔"][index]}</i>{label}</Link>)}<p className="nav-label nav-label-spaced">Manage</p>{secondaryLinks.map(([label, path], index) => <Link key={label} className="nav-link" to={path} onClick={() => setIsOpen(false)}><i>{["◉", "▥", "⚙"][index]}</i>{label}</Link>)}</nav><div className="sidebar-footer"><span className="avatar">SK</span><span><b>Subhash Kumar</b><small>Administrator</small></span></div></aside>
    </>
  );
};

export default Header;
