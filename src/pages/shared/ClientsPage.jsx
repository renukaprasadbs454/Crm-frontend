import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { name: '', email: '', phone: '', company: '', status: 'ONBOARDING', notes: '' };

export default function ClientsPage() {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setData(await clientsApi.list({ search: search || undefined, limit: 50 }));
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await clientsApi.create({ ...form, email: form.email || null, phone: form.phone || null });
      toast.success('Client created');
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this client?')) return;
    try {
      await clientsApi.remove(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Clients</h1>
        <p className="mt-1 text-sm text-slate-500">Converted leads and active customers.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Company / college" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="ONBOARDING">Onboarding</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {saving ? 'Creating…' : 'Add client'}
        </button>
      </form>

      <div className="flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder="Search clients…" className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        <button type="button" onClick={load} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">Search</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{c.name}<div className="text-xs text-slate-500">{c.company || '—'}</div></td>
                  <td className="px-4 py-3">{c.email || c.phone || '—'}</td>
                  <td className="px-4 py-3">{c.status}</td>
                  <td className="px-4 py-3">{c._count?.projects ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(c.id); }} className="font-medium text-rose-600 hover:text-rose-700">Delete</button>
                  </td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No clients yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Client" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Name', value: selected.name }, { label: 'Email', value: selected.email },
        { label: 'Phone', value: selected.phone }, { label: 'Company', value: selected.company },
        { label: 'Status', value: selected.status }, { label: 'Projects', value: selected._count?.projects },
        { label: 'Notes', value: selected.notes },
      ] : []} />
    </div>
  );
}
