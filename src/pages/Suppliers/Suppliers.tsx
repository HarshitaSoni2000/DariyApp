import React, { useEffect, useState } from "react";
import { listSuppliers, createSupplier, deleteSupplier, SupplierPayload } from "../../services/suppliers";
import { getErrorMessage } from "../../services/api";
import { Supplier } from "../../types";

const emptyForm: SupplierPayload = { name: "", phone: "", address: "" };

const Suppliers: React.FC = () => {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<SupplierPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSuppliers({ search });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(query), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;
    setSaving(true);
    try {
      await createSupplier(form);
      setIsFormOpen(false);
      setForm(emptyForm);
      load(query);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      load(query);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="operations-page supplier-page">
      <div className="page-heading">
        <div><p className="eyebrow">SUPPLIERS</p><h1>Suppliers / Dairies</h1><p>Manage the dairies and suppliers you buy milk from.</p></div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>+ Add Supplier</button>
      </div>

      <div className="stack">
        <div className="table-toolbar">
          <input className="search-input" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search suppliers by name or contact..." />
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush supplier-table-card">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead>
                <tr><th>Supplier Name</th><th>Contact</th><th>Address</th><th className="right">Outstanding</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={6} className="text-faint">No suppliers yet. Add your first one.</td></tr>
                ) : rows.map(s => (
                  <tr key={s.id}>
                    <td data-label="Supplier"><span className="supplier-name">{s.name}</span></td>
                    <td data-label="Contact">{s.phone || "—"}</td>
                    <td data-label="Address">{s.address || "—"}</td>
                    <td data-label="Outstanding" className="right table-emphasis">
                      ₹{Number(s.outstanding_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td data-label="Status"><span className={`supplier-status badge ${s.status === "active" ? "badge--success" : ""}`}>{s.status}</span></td>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Add a supplier</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Supplier name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter supplier name" required /></label>
                <label>Phone number<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" required /></label>
                <label>Address<input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Enter address" required /></label>
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

export default Suppliers;
