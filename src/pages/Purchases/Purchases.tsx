import React, { useEffect, useState } from "react";
import { listPurchases, createPurchase, deletePurchase, PurchasePayload } from "../../services/purchases";
import { listSuppliers } from "../../services/suppliers";
import { getErrorMessage } from "../../services/api";
import { Purchase, Supplier } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyForm = { supplier_id: "", purchase_date: new Date().toISOString().slice(0, 10), litres: "", fat: "", rate: "", cans: "" };

const Purchases: React.FC = () => {
  const [rows, setRows] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listPurchases({ supplier_id: supplierFilter || undefined, from: dateFilter || undefined, to: dateFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { listSuppliers().then(res => setSuppliers(res.data.data)).catch(() => {}); }, []);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [supplierFilter, dateFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier_id || !form.litres || !form.fat || !form.rate) return;
    setSaving(true);
    try {
      const payload: PurchasePayload = {
        supplier_id: Number(form.supplier_id),
        purchase_date: form.purchase_date,
        litres: Number(form.litres),
        fat: Number(form.fat),
        rate: Number(form.rate),
        cans: form.cans ? Number(form.cans) : 0,
      };
      await createPurchase(payload);
      setIsFormOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this purchase entry?")) return;
    try { await deletePurchase(id); load(); } catch (err) { alert(getErrorMessage(err)); }
  };

  return (
    <div className="operations-page supplier-page purchase-page">
      <div className="page-heading">
        <div><p className="eyebrow">PURCHASES</p><h1>Milk Purchases</h1><p>Record incoming milk and track FAT-based purchase amounts.</p></div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>+ New Purchase</button>
      </div>

      <div className="stack">
        <div className="table-toolbar">
          <select className="filter-select" value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
            <option value="">All suppliers</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="date" className="filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush supplier-table-card">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead><tr><th>Date</th><th>Supplier</th><th>Cans</th><th>Litres</th><th>FAT</th><th>Rate</th><th className="right">Amount</th><th></th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={8} className="text-faint">No purchases recorded yet.</td></tr>
                ) : rows.map(p => (
                  <tr key={p.id}>
                    <td data-label="Date">{formatDate(p.purchase_date)}</td>
                    <td data-label="Supplier">{p.supplier_name}</td>
                    <td data-label="Cans">{p.cans}</td>
                    <td data-label="Litres">{p.litres} L</td>
                    <td data-label="FAT">{p.fat}</td>
                    <td data-label="Rate">₹{Number(p.rate).toFixed(2)}</td>
                    <td data-label="Amount" className="right table-emphasis">₹{Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Actions" className="supplier-actions actions-cell">
                      <button className="table-action danger-action btn btn--danger btn--sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Record milk purchase</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Supplier
                  <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} required>
                    <option value="">Select supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </label>
                <label>Purchase date<input type="date" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} required /></label>
                <label>Cans<input type="number" value={form.cans} onChange={e => setForm({ ...form, cans: e.target.value })} placeholder="Enter number of cans" /></label>
                <label>Quantity in litres<input type="number" step="0.01" value={form.litres} onChange={e => setForm({ ...form, litres: e.target.value })} placeholder="Enter quantity" required /></label>
                <label>FAT percentage<input type="number" step="0.01" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} placeholder="Enter FAT percentage" required /></label>
                <label>Rate per litre<input type="number" step="0.01" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="Enter rate per litre" required /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save purchase"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
