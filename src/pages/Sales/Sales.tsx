import React, { useEffect, useState } from "react";
import { listSales, createSale, deleteSale } from "../../services/sales";
import { listCustomers } from "../../services/customers";
import { getActiveRate } from "../../services/marketRates";
import { getErrorMessage } from "../../services/api";
import { Sale, Customer } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyForm = { customer_id: "", sale_date: new Date().toISOString().slice(0, 10), litres: "", rate: "", cans: "" };

const Sales: React.FC = () => {
  const [rows, setRows] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSales({ customer_id: customerFilter || undefined, from: dateFilter || undefined, to: dateFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { listCustomers().then(res => setCustomers(res.data.data)).catch(() => {}); }, []);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [customerFilter, dateFilter]);

  const openForm = async () => {
    setIsFormOpen(true);
    if (!form.rate) {
      try {
        const res = await getActiveRate();
        setForm(f => ({ ...f, rate: String(res.data.data.rate_per_litre) }));
      } catch {
        // no active rate set yet — leave blank, user can type one
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id || !form.litres) return;
    setSaving(true);
    try {
      await createSale({
        customer_id: Number(form.customer_id),
        sale_date: form.sale_date,
        litres: Number(form.litres),
        rate: form.rate ? Number(form.rate) : undefined,
        cans: form.cans ? Number(form.cans) : 0,
      });
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
    if (!confirm("Delete this sale?")) return;
    try {
      await deleteSale(id);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="operations-page supplier-page sales-page">
      <div className="page-heading">
        <div><p className="eyebrow">SALES</p><h1>Milk Sales</h1><p>Record milk sales and keep customer deliveries up to date.</p></div>
        <button className="primary-button" onClick={openForm}>+ New Sale</button>
      </div>

      <div className="stack">
        <div className="table-toolbar">
          <select className="filter-select" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
            <option value="">All customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="date" className="filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush supplier-table-card">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead><tr><th>Date</th><th>Customer</th><th>Cans</th><th>Litres</th><th>Rate Applied</th><th className="right">Amount</th><th></th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={7} className="text-faint">No sales recorded yet.</td></tr>
                ) : rows.map(s => (
                  <tr key={s.id}>
                    <td data-label="Date">{formatDate(s.sale_date)}</td>
                    <td data-label="Customer">{s.customer_name}</td>
                    <td data-label="Cans">{s.cans}</td>
                    <td data-label="Litres">{s.litres} L</td>
                    <td data-label="Rate">₹{Number(s.rate).toFixed(2)}</td>
                    <td data-label="Amount" className="right table-emphasis">₹{Number(s.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Actions" className="supplier-actions actions-cell">
                      <button className="table-action danger-action btn btn--danger btn--sm" onClick={() => handleDelete(s.id)}>Delete</button>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Record milk sale</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Customer
                  <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} required>
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label>Sale date<input type="date" value={form.sale_date} onChange={e => setForm({ ...form, sale_date: e.target.value })} required /></label>
                <label>Cans<input type="number" value={form.cans} onChange={e => setForm({ ...form, cans: e.target.value })} placeholder="Enter number of cans" /></label>
                <label>Quantity in litres<input type="number" step="0.01" value={form.litres} onChange={e => setForm({ ...form, litres: e.target.value })} placeholder="Enter quantity" required /></label>
                <label>Rate per litre<input type="number" step="0.01" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="Defaults to active market rate" /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save sale"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
