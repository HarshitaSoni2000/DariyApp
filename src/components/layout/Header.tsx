import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";

const navGroups = [
  { label: "Purchase side", links: [["Suppliers / Dairies", ROUTES.SUPPLIERS, "🚚"], ["Milk Purchases", ROUTES.PURCHASES, "🥛"], ["Supplier Bills", ROUTES.SUPPLIER_BILLS, "🧾"]] },
  { label: "Sales side", links: [["Customers", ROUTES.CUSTOMERS, "👥"], ["Milk Sales", ROUTES.SALES, "🏪"], ["Customer Bills", ROUTES.CUSTOMER_BILLS, "🧾"]] },
  { label: "Money & adjustments", links: [["Payments / Ledger", ROUTES.PAYMENTS, "💵"], ["Adjustments", ROUTES.ADJUSTMENTS, "⚖️"], ["Market Rates", ROUTES.MARKET_RATES, "📈"]] },
  { label: "Insight", links: [["Reports", ROUTES.REPORTS, "📊"], ["Settings", ROUTES.SETTINGS, "⚙️"]] },
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return <aside id="sidebar" className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}><div className="sidebar-heading"><span className="brand-mark">✦</span><span><b>Subhash Dairy</b><small>Dairy Business Manager</small></span><button className="close-nav" aria-label="Close menu" onClick={onClose}>×</button></div><nav aria-label="Main navigation"><NavLink end to={ROUTES.HOME} className="nav-link" onClick={onClose}><i>▦</i>Dashboard</NavLink>{navGroups.map(group => <React.Fragment key={group.label}><p className="nav-label nav-label-spaced">{group.label}</p>{group.links.map(([label, path, icon]) => <NavLink key={label} to={path} className="nav-link" onClick={onClose}><i>{icon}</i>{label}</NavLink>)}</React.Fragment>)}</nav><div className="sidebar-footer"><span>1 can = 40 L</span><span>Rate = 9 × FAT</span></div></aside>;
};

const Header: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const { pathname } = useLocation();
  const currentTitle = pathname === ROUTES.HOME || pathname === "/" ? "Dashboard" : navGroups.flatMap(group => group.links).find(([, path]) => path === pathname)?.[0] || "Dashboard";
  const currentSubtitle = currentTitle === "Dashboard" ? "Today at a glance" : "Dairy business workspace";
  return <header className="topbar"><button className="icon-button menu-button" aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} aria-controls="sidebar" onClick={onToggle}><span></span><span></span><span></span></button><Link to={ROUTES.HOME} className="topbar-title"><strong>{currentTitle}</strong><span>{currentSubtitle}</span></Link><div className="topbar-actions"><span className="rate-chip">Market rate: ₹71.00/L</span><button className="icon-button" aria-label="Settings">⚙</button></div></header>;
};

export default Header;
