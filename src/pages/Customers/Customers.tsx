import React, { useEffect, useState } from "react";
import { listCustomers, createCustomer, deleteCustomer, CustomerPayload } from "../../services/customers";
import { getErrorMessage } from "../../services/api";
import { Customer } from "../../types";

const emptyForm: CustomerPayload = { name: "", phone: "", address: "", payment_cycle: "10day" };

const cycleLabel: Record<string, string> = {
  "7day": "Every 7 days (Type A)",
  "10day": "Every 10 days (Type B)",
  daily: "Daily / partial payments (Type C)",
};

const Customers: React.FC = () => {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cycleFilter, setCycleFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<CustomerPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomers({ search: query, cycle: cycleFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cycleFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSaving(true);
    try {
      await createCustomer(form);
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
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="operations-page supplier-page customer-page">
      <div className="page-heading">
        <div><p className="eyebrow">CUSTOMERS</p><h1>Customers</h1><p>Manage shops, sweet makers and other customers who buy your milk.</p></div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>+ Add Customer</button>
      </div>

      <div className="stack">
        <div className="table-toolbar">
          <input className="search-input" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers by name or phone..." />
          <select className="filter-select" value={cycleFilter} onChange={e => setCycleFilter(e.target.value)}>
            <option value="">All payment cycles</option>
            <option value="7day">Every 7 days (Type A)</option>
            <option value="10day">Every 10 days (Type B)</option>
            <option value="daily">Daily / partial payments (Type C)</option>
          </select>
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush supplier-table-card">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead>
                <tr><th>Customer Name</th><th>Phone</th><th>Payment Cycle</th><th className="right">Outstanding</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={6} className="text-faint">No customers yet. Add your first one.</td></tr>
                ) : rows.map(c => (
                  <tr key={c.id}>
                    <td data-label="Customer"><span className="supplier-name">{c.name}</span></td>
                    <td data-label="Phone">{c.phone || "—"}</td>
                    <td data-label="Payment Cycle">{cycleLabel[c.payment_cycle]}</td>
                    <td data-label="Outstanding" className="right table-emphasis">
                      ₹{Number(c.outstanding_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td data-label="Status"><span className={`supplier-status badge ${c.status === "active" ? "badge--success" : ""}`}>{c.status}</span></td>
                    <td data-label="Actions" className="supplier-actions actions-cell">
                      <button className="table-action danger-action btn btn--danger btn--sm" onClick={() => handleDelete(c.id)}>Delete</button>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Add a customer</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Customer name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter customer name" required /></label>
                <label>Phone number<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" required /></label>
                <label>Address<input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Enter address" /></label>
                <label>Payment cycle
                  <select value={form.payment_cycle} onChange={e => setForm({ ...form, payment_cycle: e.target.value as CustomerPayload["payment_cycle"] })}>
                    <option value="7day">Every 7 days (Type A)</option>
                    <option value="10day">Every 10 days (Type B)</option>
                    <option value="daily">Daily / partial payments (Type C)</option>
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
