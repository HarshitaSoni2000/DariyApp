import React, { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboard";
import { getErrorMessage } from "../../services/api";
import { DashboardData } from "../../types";
import { formatDate } from "../../utils/helpers";

type TableColumn = { label: string; key: string; align?: "right" };

const fmtMoney = (n: number | null | undefined) =>
  `₹${Number(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtLitres = (n: number | null | undefined) => `${Number(n ?? 0).toLocaleString("en-IN")} L`;

const DataTable = ({ columns, rows }: { columns: TableColumn[]; rows: (string | number)[][] }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>{columns.map(column => <th key={column.key} className={column.align}>{column.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length} className="text-faint">No records yet</td></tr>
        ) : rows.map((row, rowIndex) => (
          <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className={columns[cellIndex]?.align}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DataPanel = ({ title, children, action = "View all →" }: { title: string; children: React.ReactNode; action?: string }) => (
  <section className="data-panel"><div className="panel-heading"><h2>{title}</h2>{action && <button className="link-button">{action}</button>}</div>{children}</section>
);

const Home: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboard();
      setData(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="dashboard-page"><p className="text-faint">Loading dashboard…</p></div>;
  }

  if (error || !data) {
    return (
      <div className="dashboard-page">
        <p className="text-faint">{error || "Could not load dashboard."}</p>
        <button className="primary-button" onClick={load}>Retry</button>
      </div>
    );
  }

  const { snapshot, pending_bills, recent_purchases, recent_sales, recent_payments } = data;

  const snapshotCards: [string, string, string, string][] = [
    ["Today's Milk Purchased", fmtLitres(snapshot.todays_milk_purchased_litres), "Today's purchase entries", "green"],
    ["Today's Milk Sold", fmtLitres(snapshot.todays_milk_sold_litres), "Today's sale entries", "blue"],
    ["Current Market Rate", snapshot.current_market_rate ? `₹${Number(snapshot.current_market_rate).toFixed(2)}/L` : "Not set", snapshot.current_rate_effective_from ? `Effective from ${formatDate(snapshot.current_rate_effective_from)}` : "", "gold"],
    ["Today's Purchase Amount", fmtMoney(snapshot.todays_purchase_amount), "FAT-based, across all suppliers", "orange"],
    ["Today's Sales Amount", fmtMoney(snapshot.todays_sales_amount), "At the active market rate", "muted"],
    ["Supplier Outstanding", fmtMoney(snapshot.supplier_outstanding), "Total payable to all suppliers", "rose"],
    ["Customer Outstanding", fmtMoney(snapshot.customer_outstanding), "Total receivable from all customers", "purple"],
  ];

  const purchaseRows = recent_purchases.map(p => [formatDate(p.purchase_date), p.supplier_name || "—", fmtLitres(p.litres), String(p.fat), fmtMoney(p.amount)]);
  const saleRows = recent_sales.map(s => [formatDate(s.sale_date), s.customer_name || "—", fmtLitres(s.litres), `₹${Number(s.rate).toFixed(2)}`, fmtMoney(s.amount)]);
  const paymentRows = recent_payments.map(p => [formatDate(p.payment_date), p.party, p.type, fmtMoney(p.amount)]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-section-heading"><h1>Today's snapshot</h1><span>{formatDate(new Date())}</span></div>
      {showAll && <div className="quick-actions"><button onClick={() => setShowAll(false)}>Purchase milk</button><button onClick={() => setShowAll(false)}>Record sale</button><button onClick={() => setShowAll(false)}>Add payment</button></div>}
      <section className="snapshot-grid">
        {snapshotCards.map(([label, value, note, tone]) => <article className={`snapshot-card ${tone}`} key={label}><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}
      </section>
      <div className="section-title"><h2>Activity overview</h2><span>Last 30 days <b>⌄</b></span></div>
      <div className="panels-grid">
        <DataPanel title="Recent purchases"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Supplier", key: "supplier" }, { label: "Litres", key: "litres" }, { label: "FAT", key: "fat" }, { label: "Amount", key: "amount", align: "right" }]} rows={purchaseRows} /></DataPanel>
        <DataPanel title="Recent sales"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Customer", key: "customer" }, { label: "Litres", key: "litres" }, { label: "Rate", key: "rate" }, { label: "Amount", key: "amount", align: "right" }]} rows={saleRows} /></DataPanel>
        <DataPanel title="Recent payments"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Party", key: "party" }, { label: "Type", key: "type" }, { label: "Amount", key: "amount", align: "right" }]} rows={paymentRows} /></DataPanel>
        <DataPanel title="Pending bills" action=""><div className="pending-list"><div><span>Supplier bills awaiting settlement</span><strong>{pending_bills.supplier_bills}</strong></div><div><span>Customer bills with outstanding balance</span><strong>{pending_bills.customer_bills}</strong></div></div><div className="panel-actions"><a href="#/supplier-bills"><button>View supplier bills</button></a><a href="#/customer-bills"><button>View customer bills</button></a></div></DataPanel>
      </div>
      <div className="dashboard-note"><span>✦</span><p><b>Everything is in one place.</b> Your daily milk business snapshot updates as you add purchases, sales and payments.</p><button onClick={() => setShowAll(!showAll)}>New entry</button></div>
    </div>
  );
};

export default Home;
