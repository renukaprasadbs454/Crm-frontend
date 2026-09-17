import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, projectsApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { title: '', clientId: '', status: 'NEW', budget: 0, description: '' };

export default function ProjectsPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [projects, clientList] = await Promise.all([
        projectsApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(projects);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await projectsApi.create({ ...form, budget: Number(form.budget) || 0 });
      toast.success('Project created');
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id, status) {
    try {
      await projectsApi.update(id, { status });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Projects</h1>
        <p className="mt-1 text-sm text-slate-500">Track work and enrollments for clients.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">Select client *</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="NEW">New</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input type="number" min="0" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Creating…' : 'Add project'}</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{p.title}</td>
                  <td className="px-4 py-3">{p.client?.name || '—'}</td>
                  <td className="px-4 py-3">₹{Number(p.budget || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select value={p.status} onClick={(event) => event.stopPropagation()} onChange={(e) => setStatus(p.id, e.target.value)} className="rounded border border-slate-200 px-2 py-1 text-sm">
                      <option value="NEW">New</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No projects yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Project" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Title', value: selected.title }, { label: 'Client', value: selected.client?.name },
        { label: 'Status', value: selected.status }, { label: 'Budget', value: `₹${Number(selected.budget || 0).toLocaleString()}` },
        { label: 'Description', value: selected.description }, { label: 'Start date', value: selected.startDate && new Date(selected.startDate).toLocaleDateString() },
        { label: 'End date', value: selected.endDate && new Date(selected.endDate).toLocaleDateString() },
      ] : []} />
    </div>
  );
}
