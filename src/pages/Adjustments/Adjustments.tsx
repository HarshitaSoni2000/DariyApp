import React, { useEffect, useState } from "react";
import { listAdjustments, createAdjustment, AdjustmentPayload } from "../../services/adjustments";
import { listSuppliers } from "../../services/suppliers";
import { listCustomers } from "../../services/customers";
import { getErrorMessage } from "../../services/api";
import { Adjustment, Supplier, Customer } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyForm = {
  adjustment_type: "khowa_yield" as "khowa_yield" | "carry_forward",
  party_type: "supplier" as "supplier" | "customer",
  party_id: "",
  adjustment_date: new Date().toISOString().slice(0, 10),
  entry_type: "debit" as "credit" | "debit",
  details: "",
  amount: "",
};

const Adjustments: React.FC = () => {
  const [rows, setRows] = useState<Adjustment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdjustments({ type: typeFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listSuppliers().then(res => setSuppliers(res.data.data)).catch(() => {});
    listCustomers().then(res => setCustomers(res.data.data)).catch(() => {});
  }, []);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [typeFilter]);

  const openForm = (type: "khowa_yield" | "carry_forward") => {
    setForm({ ...emptyForm, adjustment_type: type });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.party_id || !form.adjustment_date) return;
    setSaving(true);
    try {
      const payload: AdjustmentPayload = {
        adjustment_type: form.adjustment_type,
        party_type: form.party_type,
        party_id: Number(form.party_id),
        adjustment_date: form.adjustment_date,
        entry_type: form.entry_type,
        details: form.details || undefined,
        amount: form.amount ? Number(form.amount) : undefined,
      };
      await createAdjustment(payload);
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
        <div><p className="eyebrow">ADJUSTMENTS</p><h1>Adjustments</h1><p>Make controlled corrections for shortages, returns and other ledger changes.</p></div>
      </div>

      <div className="stack">
        <div className="reference-actions">
          <button className="primary-button" onClick={() => openForm("khowa_yield")}>+ Khowa / Yield Adjustment</button>
          <button className="ghost-button" onClick={() => openForm("carry_forward")}>+ Carry-Forward Adjustment</button>
          <span className="toolbar-spacer" />
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            <option value="khowa_yield">Khowa / Yield</option>
            <option value="carry_forward">Carry Forward</option>
          </select>
        </div>

        <div className="pending-panel">
          <div className="pending-panel__icon">⏳</div>
          <div><div className="pending-panel__title">Two adjustment types only</div><div className="pending-panel__text">Khowa shortfall amounts and carry-forward figures are entered manually. Leave amount blank to mark it "Business Rule Pending" until confirmed.</div></div>
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead><tr><th>Type</th><th>Date</th><th>Party</th><th>Details</th><th>Amount</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="text-faint">No adjustments recorded yet.</td></tr>
                ) : rows.map(a => (
                  <tr key={a.id}>
                    <td data-label="Type">{a.adjustment_type === "khowa_yield" ? "Khowa / Yield" : "Carry Forward"}</td>
                    <td data-label="Date">{formatDate(a.adjustment_date)}</td>
                    <td data-label="Party">{a.party_name}</td>
                    <td data-label="Details" className="text-faint">{a.details || "—"}</td>
                    <td data-label="Amount">
                      {a.status === "confirmed" ? (
                        <span>{a.entry_type === "credit" ? "+" : "-"}₹{Number(a.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="bill-status bill-status-warning">⏳ Business Rule Pending</span>
                      )}
                    </td>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>{form.adjustment_type === "khowa_yield" ? "Khowa / Yield" : "Carry-Forward"} Adjustment</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Party type
                  <select value={form.party_type} onChange={e => setForm({ ...form, party_type: e.target.value as "supplier" | "customer", party_id: "" })}>
                    <option value="supplier">Supplier</option>
                    <option value="customer">Customer</option>
                  </select>
                </label>
                <label>Party
                  <select value={form.party_id} onChange={e => setForm({ ...form, party_id: e.target.value })} required>
                    <option value="">Select {form.party_type}</option>
                    {(form.party_type === "supplier" ? suppliers : customers).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
                <label>Entry type
                  <select value={form.entry_type} onChange={e => setForm({ ...form, entry_type: e.target.value as "credit" | "debit" })}>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </label>
                <label>Adjustment date<input type="date" value={form.adjustment_date} onChange={e => setForm({ ...form, adjustment_date: e.target.value })} required /></label>
                <label>Details<input value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="e.g. 40 L · Expected 240g − Actual 220g" /></label>
                <label>Amount (leave blank if not yet confirmed)<input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Enter ₹ amount" /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save adjustment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adjustments;
