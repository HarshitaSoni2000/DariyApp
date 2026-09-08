import React, { useEffect, useState } from "react";
import { listSupplierBills, generateSupplierBill, paySupplierBill } from "../../services/supplierBills";
import { listSuppliers } from "../../services/suppliers";
import { getErrorMessage } from "../../services/api";
import { SupplierBill, Supplier } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyGenForm = { supplier_id: "", period_start: "", period_end: "", settlement_date: "" };
const emptyPayForm = { amount: "", payment_date: new Date().toISOString().slice(0, 10) };

const statusLabel: Record<string, string> = {
  open: "Open",
  partially_paid: "Partially Paid",
  settled: "Settled",
  business_rule_pending: "Business Rule Pending",
};

const SupplierBills: React.FC = () => {
  const [rows, setRows] = useState<SupplierBill[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isGenOpen, setIsGenOpen] = useState(false);
  const [genForm, setGenForm] = useState(emptyGenForm);
  const [genSaving, setGenSaving] = useState(false);

  const [payBillId, setPayBillId] = useState<number | null>(null);
  const [payForm, setPayForm] = useState(emptyPayForm);
  const [paySaving, setPaySaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSupplierBills({ supplier_id: supplierFilter || undefined, status: statusFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { listSuppliers().then(res => setSuppliers(res.data.data)).catch(() => {}); }, []);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [supplierFilter, statusFilter]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genForm.supplier_id || !genForm.period_start || !genForm.period_end) return;
    setGenSaving(true);
    try {
      await generateSupplierBill({
        supplier_id: Number(genForm.supplier_id),
        period_start: genForm.period_start,
        period_end: genForm.period_end,
        settlement_date: genForm.settlement_date || undefined,
      });
      setIsGenOpen(false);
      setGenForm(emptyGenForm);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setGenSaving(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payBillId || !payForm.amount || !payForm.payment_date) return;
    setPaySaving(true);
    try {
      await paySupplierBill(payBillId, { amount: Number(payForm.amount), payment_date: payForm.payment_date });
      setPayBillId(null);
      setPayForm(emptyPayForm);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setPaySaving(false);
    }
  };

  return (
    <div className="operations-page supplier-bills-reference">
      <div className="page-heading">
        <div><p className="eyebrow">SUPPLIER BILLS</p><h1>Supplier Bills</h1><p>Review bills raised by your milk suppliers and settle outstanding balances.</p></div>
        <button className="primary-button" onClick={() => setIsGenOpen(true)}>+ Generate Bill</button>
      </div>

      <div className="stack">
        <div className="pending-panel">
          <div className="pending-panel__icon">ℹ️</div>
          <div><div className="pending-panel__title">How bills are built</div><div className="pending-panel__text">Pick a supplier and a date range — the bill sums every purchase recorded in that period. Standard periods are 1st–10th and 11th–20th, per the BRD.</div></div>
        </div>

        <div className="table-toolbar">
          <select className="filter-select" value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
            <option value="">All suppliers</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="settled">Settled</option>
          </select>
        </div>

        {error && <p className="text-faint">{error}</p>}

        <div className="data-panel card card--flush">
          <div className="table-wrap">
            <table className="supplier-table data-table data-table--cards supplier-bills-table">
              <thead><tr><th>Bill No.</th><th>Supplier</th><th>Period</th><th className="right">Total Litres</th><th className="right">Total Bill</th><th className="right">Paid</th><th className="right">Remaining</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={9} className="text-faint">No bills generated yet.</td></tr>
                ) : rows.map(b => (
                  <tr key={b.id}>
                    <td data-label="Bill No.">{b.bill_number}</td>
                    <td data-label="Supplier"><span className="supplier-name">{b.supplier_name}</span></td>
                    <td data-label="Period">{formatDate(b.period_start)} – {formatDate(b.period_end)}</td>
                    <td data-label="Total Litres" className="right">{b.total_litres} L</td>
                    <td data-label="Total Bill" className="right">₹{Number(b.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Paid" className="right">₹{Number(b.paid_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Remaining" className="right table-emphasis">₹{Number(b.balance_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Status"><span className={`bill-status ${b.status === "open" ? "bill-status-info" : "bill-status-warning"}`}>{statusLabel[b.status]}</span></td>
                    <td data-label="Actions" className="supplier-actions actions-cell">
                      {b.status !== "settled" && <button className="table-action btn btn--ghost btn--sm" onClick={() => setPayBillId(b.id)}>Record Payment</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isGenOpen && (
        <div className="modal-backdrop" onClick={() => setIsGenOpen(false)}>
          <div className="entry-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><div><p className="eyebrow">NEW BILL</p><h2>Generate supplier bill</h2></div><button className="modal-close" onClick={() => setIsGenOpen(false)}>×</button></div>
            <form onSubmit={handleGenerate}>
              <div className="form-grid">
                <label>Supplier
                  <select value={genForm.supplier_id} onChange={e => setGenForm({ ...genForm, supplier_id: e.target.value })} required>
                    <option value="">Select supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </label>
                <label>Period start<input type="date" value={genForm.period_start} onChange={e => setGenForm({ ...genForm, period_start: e.target.value })} required /></label>
                <label>Period end<input type="date" value={genForm.period_end} onChange={e => setGenForm({ ...genForm, period_end: e.target.value })} required /></label>
                <label>Settlement date (optional)<input type="date" value={genForm.settlement_date} onChange={e => setGenForm({ ...genForm, settlement_date: e.target.value })} /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsGenOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={genSaving}>{genSaving ? "Generating…" : "Generate bill"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payBillId !== null && (
        <div className="modal-backdrop" onClick={() => setPayBillId(null)}>
          <div className="entry-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><div><p className="eyebrow">SUPPLIER PAYMENT</p><h2>Record payment</h2></div><button className="modal-close" onClick={() => setPayBillId(null)}>×</button></div>
            <form onSubmit={handlePay}>
              <div className="form-grid">
                <label>Amount<input type="number" step="0.01" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} placeholder="Enter payment amount" required /></label>
                <label>Payment date<input type="date" value={payForm.payment_date} onChange={e => setPayForm({ ...payForm, payment_date: e.target.value })} required /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setPayBillId(null)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={paySaving}>{paySaving ? "Saving…" : "Save payment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierBills;
