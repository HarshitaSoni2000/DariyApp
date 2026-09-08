import React, { useEffect, useState } from "react";
import { listCustomerBills, generateCustomerBill, payCustomerBill } from "../../services/customerBills";
import { listCustomers } from "../../services/customers";
import { getErrorMessage } from "../../services/api";
import { CustomerBill, Customer } from "../../types";
import { formatDate } from "../../utils/helpers";

const emptyGenForm = { customer_id: "", period_start: "", period_end: "" };
const emptyPayForm = { amount: "", payment_date: new Date().toISOString().slice(0, 10) };

const statusLabel: Record<string, string> = { open: "Open", partially_paid: "Partially Paid", settled: "Settled" };

const CustomerBills: React.FC = () => {
  const [rows, setRows] = useState<CustomerBill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState("");
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
      const res = await listCustomerBills({ customer_id: customerFilter || undefined, status: statusFilter || undefined });
      setRows(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { listCustomers().then(res => setCustomers(res.data.data)).catch(() => {}); }, []);
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [customerFilter, statusFilter]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genForm.customer_id || !genForm.period_start || !genForm.period_end) return;
    setGenSaving(true);
    try {
      await generateCustomerBill({
        customer_id: Number(genForm.customer_id),
        period_start: genForm.period_start,
        period_end: genForm.period_end,
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
      await payCustomerBill(payBillId, { amount: Number(payForm.amount), payment_date: payForm.payment_date });
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
    <div className="operations-page customer-bills-reference">
      <div className="page-heading">
        <div><p className="eyebrow">CUSTOMER BILLS</p><h1>Customer Bills</h1><p>Track customer invoices and outstanding receivables.</p></div>
        <button className="primary-button" onClick={() => setIsGenOpen(true)}>+ Generate Bill</button>
      </div>

      <div className="stack">
        <div className="pending-panel">
          <div className="pending-panel__icon">ℹ️</div>
          <div><div className="pending-panel__title">Final Customer Amount = Total Bill − Payments − Valid Adjustments</div><div className="pending-panel__text">Only confirmed Khowa/yield adjustments for the customer's period are subtracted automatically.</div></div>
        </div>

        <div className="table-toolbar">
          <select className="filter-select" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
            <option value="">All customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
            <table className="supplier-table data-table data-table--cards customer-bills-table">
              <thead><tr><th>Bill No.</th><th>Customer</th><th>Period</th><th className="right">Total Qty</th><th className="right">Total Amount</th><th className="right">Payments</th><th className="right">Adjustments</th><th className="right">Remaining</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={10} className="text-faint">No bills generated yet.</td></tr>
                ) : rows.map(b => (
                  <tr key={b.id}>
                    <td data-label="Bill No.">{b.bill_number}</td>
                    <td data-label="Customer"><span className="supplier-name">{b.customer_name}</span></td>
                    <td data-label="Period">{formatDate(b.period_start)} – {formatDate(b.period_end)}</td>
                    <td data-label="Total Qty" className="right">{b.total_qty} L</td>
                    <td data-label="Total Amount" className="right">₹{Number(b.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Payments" className="right">₹{Number(b.paid_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td data-label="Adjustments" className="right">₹{Number(b.adjustment_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
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
            <div className="modal-heading"><div><p className="eyebrow">NEW BILL</p><h2>Generate customer bill</h2></div><button className="modal-close" onClick={() => setIsGenOpen(false)}>×</button></div>
            <form onSubmit={handleGenerate}>
              <div className="form-grid">
                <label>Customer
                  <select value={genForm.customer_id} onChange={e => setGenForm({ ...genForm, customer_id: e.target.value })} required>
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label>Period start<input type="date" value={genForm.period_start} onChange={e => setGenForm({ ...genForm, period_start: e.target.value })} required /></label>
                <label>Period end<input type="date" value={genForm.period_end} onChange={e => setGenForm({ ...genForm, period_end: e.target.value })} required /></label>
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
            <div className="modal-heading"><div><p className="eyebrow">CUSTOMER PAYMENT</p><h2>Record payment</h2></div><button className="modal-close" onClick={() => setPayBillId(null)}>×</button></div>
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

export default CustomerBills;
