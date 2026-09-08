import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/settings";
import { getErrorMessage } from "../../services/api";
import { Settings as SettingsType } from "../../types";

const Settings: React.FC = () => {
  const [form, setForm] = useState<Partial<SettingsType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSettings();
      setForm(res.data.data);
    } catch (err) {
      // If none configured yet, start with sane defaults rather than erroring out
      setForm({ business_name: "Subhash Dairy", default_unit: "Litres (L)", currency: "INR" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await updateSettings(form);
      setForm(res.data.data);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="operations-page"><p className="text-faint">Loading settings…</p></div>;

  return (
    <div className="operations-page">
      <div className="page-heading">
        <div><p className="eyebrow">SETTINGS</p><h1>Business Settings</h1><p>Configure the business profile and preferences.</p></div>
      </div>

      <section className="data-panel full-panel">
        <div className="panel-heading"><div><h2>Business profile</h2>{savedAt && <p className="panel-description">Saved at {savedAt}</p>}</div></div>
        <div style={{ padding: 23 }}>
          {error && <p className="text-faint">{error}</p>}
          <form onSubmit={handleSubmit} className="form-grid" style={{ maxWidth: 420 }}>
            <label>Business name
              <input value={form.business_name || ""} onChange={e => setForm({ ...form, business_name: e.target.value })} placeholder="Enter business name" required />
            </label>
            <label>Owner name
              <input value={form.owner_name || ""} onChange={e => setForm({ ...form, owner_name: e.target.value })} placeholder="Enter owner name" />
            </label>
            <label>Phone number
              <input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
            </label>
            <label>Default unit
              <input value={form.default_unit || ""} onChange={e => setForm({ ...form, default_unit: e.target.value })} placeholder="e.g. Litres (L)" />
            </label>
            <label>Currency
              <input value={form.currency || ""} onChange={e => setForm({ ...form, currency: e.target.value })} placeholder="e.g. INR" />
            </label>
            <div className="modal-actions" style={{ justifyContent: "flex-start", marginTop: 6 }}>
              <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Settings;
