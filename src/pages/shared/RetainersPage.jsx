import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, retainersApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { title: '', clientId: '', status: 'ACTIVE', monthlyAmount: 0 };

export default function RetainersPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [retainers, clientList] = await Promise.all([
        retainersApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(retainers);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load retainers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await retainersApi.create({ ...form, monthlyAmount: Number(form.monthlyAmount) || 0 });
      toast.success('Retainer created');
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  const mrr = data.items.filter((r) => r.status === 'ACTIVE').reduce((s, r) => s + Number(r.monthlyAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Retainers</h1>
          <p className="mt-1 text-sm text-slate-500">Recurring packages and MRR.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          Active MRR: <span className="font-display text-lg font-bold text-brand-900">₹{mrr.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">Select client *</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" min="0" placeholder="Monthly amount" value={form.monthlyAmount} onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Creating…' : 'Add retainer'}</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id} onClick={() => setSelected(r)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{r.title}</td>
                  <td className="px-4 py-3">{r.client?.name || '—'}</td>
                  <td className="px-4 py-3">₹{Number(r.monthlyAmount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No retainers yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Retainer" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Title', value: selected.title }, { label: 'Client', value: selected.client?.name },
        { label: 'Monthly amount', value: `₹${Number(selected.monthlyAmount || 0).toLocaleString()}` },
        { label: 'Status', value: selected.status }, { label: 'Description', value: selected.description },
      ] : []} />
    </div>
  );
}
