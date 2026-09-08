import React, { useEffect, useState } from "react";
import { listAllPayments, createSupplierPayment, createCustomerPayment } from "../../services/payments";
import { listSuppliers } from "../../services/suppliers";
import { listCustomers } from "../../services/customers";
import { getErrorMessage } from "../../services/api";
import { CombinedPayment, Supplier, Customer } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyForm = { party_id: "", amount: "", payment_date: new Date().toISOString().slice(0, 10), notes: "" };

const Payments: React.FC = () => {
  const [rows, setRows] = useState<CombinedPayment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"supplier" | "customer">("supplier");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAllPayments();
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    listSuppliers().then(res => setSuppliers(res.data.data)).catch(() => {});
    listCustomers().then(res => setCustomers(res.data.data)).catch(() => {});
  }, []);

  const filteredRows = rows.filter(r => r.party_type === tab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.party_id || !form.amount || !form.payment_date) return;
    setSaving(true);
    try {
      if (tab === "supplier") {
        await createSupplierPayment({ supplier_id: Number(form.party_id), amount: Number(form.amount), payment_date: form.payment_date, notes: form.notes || undefined });
      } else {
        await createCustomerPayment({ customer_id: Number(form.party_id), amount: Number(form.amount), payment_date: form.payment_date, notes: form.notes || undefined });
      }
      setIsFormOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="operations-page reference-module">
      <div className="page-heading">
        <div><p className="eyebrow">PAYMENTS</p><h1>Payments / Ledger</h1><p>See every payment in one place and keep your cash ledger balanced.</p></div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>+ Record {tab === "supplier" ? "Supplier" : "Customer"} Payment</button>
      </div>

      <div className="stack">
        <div className="tabs">
          <button className={`tab-btn ${tab === "supplier" ? "is-active" : ""}`} onClick={() => setTab("supplier")}>Supplier Payments</button>
          <button className={`tab-btn ${tab === "customer" ? "is-active" : ""}`} onClick={() => setTab("customer")}>Customer Payments</button>
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead><tr><th>Date</th><th>{tab === "supplier" ? "Supplier" : "Customer"}</th><th>Type</th><th className="right">Amount</th><th>Notes</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Loading…</td></tr>
                ) : filteredRows.length === 0 ? (
                  <tr><td colSpan={5} className="text-faint">No {tab} payments recorded yet.</td></tr>
                ) : filteredRows.map(p => (
                  <tr key={`${p.party_type}-${p.id}`}>
                    <td data-label="Date">{formatDate(p.payment_date)}</td>
                    <td data-label="Party">{p.party}</td>
                    <td data-label="Type">{p.type}</td>
                    <td data-label="Amount" className="right table-emphasis">₹{Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Notes" className="text-faint">{p.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormOpen(false)}>
          <div className="entry-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><h2>Record {tab} payment</h2><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>{tab === "supplier" ? "Supplier" : "Customer"}
                  <select value={form.party_id} onChange={e => setForm({ ...form, party_id: e.target.value })} required>
                    <option value="">Select {tab}</option>
                    {(tab === "supplier" ? suppliers : customers).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
                <label>Amount<input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" required /></label>
                <label>Payment date<input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} required /></label>
                <label>Notes<input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Enter notes" /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save payment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
