import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, paymentsApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { title: '', amount: '', type: 'REVENUE', status: 'RECEIVED', clientId: '', category: '' };

export default function PaymentsPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [payments, clientList] = await Promise.all([
        paymentsApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(payments);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await paymentsApi.create({
        ...form,
        amount: Number(form.amount),
        clientId: form.clientId || null,
        paidAt: form.status === 'RECEIVED' ? new Date().toISOString() : null,
      });
      toast.success('Payment recorded');
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Revenue and expenses.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input required type="number" min="0.01" step="0.01" placeholder="Amount *" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="REVENUE">Revenue</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="PENDING">Pending</option>
          <option value="RECEIVED">Received</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">No client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Saving…' : 'Record payment'}</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Client</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{p.title}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className={`px-4 py-3 font-medium ${p.type === 'EXPENSE' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {p.type === 'EXPENSE' ? '-' : '+'}₹{Number(p.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">{p.client?.name || '—'}</td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No payments yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Payment" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Title', value: selected.title }, { label: 'Type', value: selected.type },
        { label: 'Amount', value: `₹${Number(selected.amount || 0).toLocaleString()}` },
        { label: 'Status', value: selected.status }, { label: 'Client', value: selected.client?.name },
        { label: 'Category', value: selected.category }, { label: 'Notes', value: selected.notes },
      ] : []} />
    </div>
  );
}
