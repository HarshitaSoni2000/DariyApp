import React, { useEffect, useState } from "react";
import { listMarketRates, createMarketRate } from "../../services/marketRates";
import { getErrorMessage } from "../../services/api";
import { MarketRate } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyForm = { rate_per_litre: "", effective_from: new Date().toISOString().slice(0, 10), notes: "" };

const MarketRates: React.FC = () => {
  const [rows, setRows] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listMarketRates();
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const active = rows.find(r => !r.effective_to || new Date(r.effective_to) >= new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rate_per_litre || !form.effective_from) return;
    setSaving(true);
    try {
      await createMarketRate({
        rate_per_litre: Number(form.rate_per_litre),
        effective_from: form.effective_from,
        notes: form.notes || undefined,
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

  return (
    <div className="operations-page reference-module">
      <div className="page-heading">
        <div><p className="eyebrow">MARKET RATES</p><h1>Market Rates</h1><p>Set the active milk rate used for today's sales and purchase calculations.</p></div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>+ Add New Rate</button>
      </div>

      <div className="stack">
        <div className="pending-panel">
          <div className="pending-panel__icon">ℹ️</div>
          <div><div className="pending-panel__title">The rate never changes automatically</div><div className="pending-panel__text">A new rate only takes effect when you add one below. Older rates stay in this history.</div></div>
        </div>

        <div className="kpi-row">
          <div className="kpi-box"><div className="kpi-box__label">Current Active Rate</div><div className="kpi-box__value">{active ? `₹${Number(active.rate_per_litre).toFixed(2)}/L` : "Not set"}</div></div>
          <div className="kpi-box"><div className="kpi-box__label">Effective From</div><div className="kpi-box__value">{active ? formatDate(active.effective_from) : "—"}</div></div>
          <div className="kpi-box"><div className="kpi-box__label">Rates on File</div><div className="kpi-box__value">{rows.length}</div></div>
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards">
              <thead><tr><th>Rate</th><th>Effective From</th><th>Effective To</th><th>Status</th><th>Notes</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="text-faint">No rates set yet.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id}>
                    <td data-label="Rate">₹{Number(r.rate_per_litre).toFixed(2)}/L</td>
                    <td data-label="Effective From">{formatDate(r.effective_from)}</td>
                    <td data-label="Effective To" className="text-faint">{r.effective_to ? formatDate(r.effective_to) : "Open-ended"}</td>
                    <td data-label="Status"><span className={`supplier-status badge ${!r.effective_to || new Date(r.effective_to) >= new Date() ? "badge--success" : ""}`}>{!r.effective_to || new Date(r.effective_to) >= new Date() ? "Active" : "Expired"}</span></td>
                    <td data-label="Notes" className="text-faint">{r.notes || "—"}</td>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Update market rate</h2></div><button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>New rate per litre<input type="number" step="0.01" value={form.rate_per_litre} onChange={e => setForm({ ...form, rate_per_litre: e.target.value })} placeholder="Enter new rate" required /></label>
                <label>Effective from<input type="date" value={form.effective_from} onChange={e => setForm({ ...form, effective_from: e.target.value })} required /></label>
                <label>Notes<input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save rate"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketRates;
