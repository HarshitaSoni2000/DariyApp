import React, { useEffect, useState } from "react";
import { purchaseReport, salesReport, supplierOutstandingReport, customerOutstandingReport, paymentsReport } from "../../services/reports";
import { getErrorMessage } from "../../services/api";
import { formatDate } from "../../utils/helpers";

type Tab = "purchase" | "sales" | "supplier-outstanding" | "customer-outstanding" | "payments";

const tabs: { key: Tab; label: string }[] = [
  { key: "purchase", label: "purchases" },
  { key: "sales", label: "sales" },
  { key: "supplier-outstanding", label: "supplier outstanding" },
  { key: "customer-outstanding", label: "customer outstanding" },
  { key: "payments", label: "payments" },
];

const money = (n: number) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const Reports: React.FC = () => {
  const [tab, setTab] = useState<Tab>("purchase");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState<{ litres: number; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    setTotals(null);
    try {
      let res;
      switch (tab) {
        case "purchase":
          res = await purchaseReport({ from: from || undefined, to: to || undefined });
          setTotals(res.data.totals);
          break;
        case "sales":
          res = await salesReport({ from: from || undefined, to: to || undefined });
          setTotals(res.data.totals);
          break;
        case "supplier-outstanding":
          res = await supplierOutstandingReport();
          break;
        case "customer-outstanding":
          res = await customerOutstandingReport();
          break;
        case "payments":
          res = await paymentsReport({ from: from || undefined, to: to || undefined });
          break;
      }
      setRows(res?.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tab, from, to]);

  const renderTable = () => {
    if (tab === "purchase") {
      return (
        <table className="supplier-table data-table data-table--cards">
          <thead><tr><th>Date</th><th>Supplier</th><th>Litres</th><th>Cans</th><th>FAT</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{formatDate(r.purchase_date)}</td><td>{r.supplier_name}</td><td>{r.litres}</td><td>{r.cans}</td><td>{r.fat}</td><td>₹{Number(r.rate).toFixed(2)}</td><td>{money(r.amount)}</td></tr>
            ))}
          </tbody>
          {totals && <tfoot><tr><td colSpan={2}>Totals</td><td>{totals.litres}</td><td></td><td></td><td></td><td>{money(totals.amount)}</td></tr></tfoot>}
        </table>
      );
    }
    if (tab === "sales") {
      return (
        <table className="supplier-table data-table data-table--cards">
          <thead><tr><th>Date</th><th>Customer</th><th>Litres</th><th>Cans</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{formatDate(r.sale_date)}</td><td>{r.customer_name}</td><td>{r.litres}</td><td>{r.cans}</td><td>₹{Number(r.rate).toFixed(2)}</td><td>{money(r.amount)}</td></tr>
            ))}
          </tbody>
          {totals && <tfoot><tr><td colSpan={2}>Totals</td><td>{totals.litres}</td><td></td><td></td><td>{money(totals.amount)}</td></tr></tfoot>}
        </table>
      );
    }
    if (tab === "supplier-outstanding" || tab === "customer-outstanding") {
      return (
        <table className="supplier-table data-table data-table--cards">
          <thead><tr><th>{tab === "supplier-outstanding" ? "Supplier" : "Customer"}</th><th className="right">Outstanding</th></tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={i}><td>{r.name}</td><td className="right table-emphasis">{money(r.outstanding)}</td></tr>)}
          </tbody>
        </table>
      );
    }
    // payments
    return (
      <table className="supplier-table data-table data-table--cards">
        <thead><tr><th>Date</th><th>Party</th><th>Type</th><th>Amount</th></tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}><td>{formatDate(r.payment_date)}</td><td>{r.party} ({r.party_type})</td><td>{r.type}</td><td>{money(r.amount)}</td></tr>)}
        </tbody>
      </table>
    );
  };

  const showDateFilters = tab !== "supplier-outstanding" && tab !== "customer-outstanding";

  return (
    <div className="operations-page reference-module">
      <div className="page-heading">
        <div><p className="eyebrow">REPORTS</p><h1>Reports</h1><p>Understand your milk volume, cash flow and party balances at a glance.</p></div>
      </div>

      <div className="stack">
        <div className="tabs report-tabs">
          {tabs.map(t => <button key={t.key} className={`tab-btn ${tab === t.key ? "is-active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>)}
        </div>

        {showDateFilters && (
          <div className="table-toolbar">
            <input type="date" className="filter-select" value={from} onChange={e => setFrom(e.target.value)} />
            <input type="date" className="filter-select" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        )}

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush">
          <div className="table-wrap">
            {loading ? <p className="text-faint" style={{ padding: 20 }}>Loading…</p> : rows.length === 0 ? <p className="text-faint" style={{ padding: 20 }}>No data for this report yet.</p> : renderTable()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
