import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const navGroups = [
  { label: "Purchase side", links: [["Suppliers / Dairies", ROUTES.SUPPLIERS, "🚚"], ["Milk Purchases", ROUTES.PURCHASES, "🥛"], ["Supplier Bills", ROUTES.SUPPLIER_BILLS, "🧾"]] },
  { label: "Sales side", links: [["Customers", ROUTES.CUSTOMERS, "👥"], ["Milk Sales", ROUTES.SALES, "🏪"], ["Customer Bills", ROUTES.CUSTOMER_BILLS, "🧾"]] },
  { label: "Money & adjustments", links: [["Payments / Ledger", ROUTES.PAYMENTS, "💵"], ["Adjustments", ROUTES.ADJUSTMENTS, "⚖️"], ["Market Rates", ROUTES.MARKET_RATES, "📈"]] },
  { label: "Insight", links: [["Reports", ROUTES.REPORTS, "📊"], ["Settings", ROUTES.SETTINGS, "⚙️"]] },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 760);
  return (
    <>
      <header className="topbar"><button className="icon-button menu-button" aria-label={isOpen ? "Close navigation" : "Open navigation"} onClick={() => setIsOpen(!isOpen)}>☰</button><Link to={ROUTES.HOME} className="brand-lockup"><span className="brand-mark">✦</span><span><strong>Subhash Dairy</strong><small>Dairy Business Manager</small></span></Link><div className="topbar-actions"><span className="date-chip">05 Sep 2026</span><button className="icon-button" aria-label="Settings">⚙</button></div></header>
      {isOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setIsOpen(false)} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}><div className="sidebar-heading"><span className="brand-mark">✦</span><span><b>Subhash Dairy</b><small>Dairy Business Manager</small></span><button className="close-nav" aria-label="Close menu" onClick={() => setIsOpen(false)}>×</button></div><nav aria-label="Main navigation"><NavLink end to={ROUTES.HOME} className="nav-link" onClick={() => setIsOpen(false)}><i>▦</i>Dashboard</NavLink>{navGroups.map(group => <React.Fragment key={group.label}><p className="nav-label nav-label-spaced">{group.label}</p>{group.links.map(([label, path, icon]) => <NavLink key={label} to={path} className="nav-link" onClick={() => setIsOpen(false)}><i>{icon}</i>{label}</NavLink>)}</React.Fragment>)}</nav><div className="sidebar-footer"><span>1 can = 40 L</span><span>Rate = 9 × FAT</span></div></aside>
    </>
  );
};

export default Header;
