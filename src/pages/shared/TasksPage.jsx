import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, tasksApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { title: '', status: 'TODO', priority: 2, clientId: '', dueAt: '', description: '' };

export default function TasksPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [tasks, clientList] = await Promise.all([
        tasksApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(tasks);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await tasksApi.create({
        ...form,
        priority: Number(form.priority),
        clientId: form.clientId || null,
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null,
      });
      toast.success('Task created');
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
      await tasksApi.update(id, { status });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">To-dos for follow-ups and delivery.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">No client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="1">High</option>
          <option value="2">Medium</option>
          <option value="3">Low</option>
        </select>
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Creating…' : 'Add task'}</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((t) => (
                <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{t.title}</td>
                  <td className="px-4 py-3">{t.dueAt ? new Date(t.dueAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">{t.client?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={t.status} onClick={(event) => event.stopPropagation()} onChange={(e) => setStatus(t.id, e.target.value)} className="rounded border border-slate-200 px-2 py-1 text-sm">
                      <option value="TODO">To do</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="DONE">Done</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No tasks yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Task" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Title', value: selected.title }, { label: 'Client', value: selected.client?.name },
        { label: 'Status', value: selected.status }, { label: 'Priority', value: selected.priority },
        { label: 'Due', value: selected.dueAt && new Date(selected.dueAt).toLocaleString() },
        { label: 'Description', value: selected.description },
      ] : []} />
    </div>
  );
}
