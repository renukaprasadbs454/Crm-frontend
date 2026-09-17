import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, meetingsApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { title: '', startsAt: '', clientId: '', location: '', meetUrl: '', notes: '' };

export default function MeetingsPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [meetings, clientList] = await Promise.all([
        meetingsApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(meetings);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await meetingsApi.create({
        ...form,
        startsAt: new Date(form.startsAt).toISOString(),
        clientId: form.clientId || null,
        meetUrl: form.meetUrl || null,
      });
      toast.success('Meeting scheduled');
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
      await meetingsApi.update(id, { status });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Meetings</h1>
        <p className="mt-1 text-sm text-slate-500">Schedule calls and demos.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2">
        <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">No client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Meet URL" value={form.meetUrl} onChange={(e) => setForm({ ...form, meetUrl: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:col-span-2">{saving ? 'Scheduling…' : 'Schedule meeting'}</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading…</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Meeting</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((m) => (
                <tr key={m.id} onClick={() => setSelected(m)} className="cursor-pointer border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-700">{m.title}{m.meetUrl && <a href={m.meetUrl} onClick={(event) => event.stopPropagation()} target="_blank" rel="noreferrer" className="ml-2 text-xs text-brand-600">Join</a>}</td>
                  <td className="px-4 py-3">{new Date(m.startsAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{m.client?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={m.status} onClick={(event) => event.stopPropagation()} onChange={(e) => setStatus(m.id, e.target.value)} className="rounded border border-slate-200 px-2 py-1 text-sm">
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No show</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No meetings yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <DetailsModal title="Meeting" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Title', value: selected.title }, { label: 'When', value: new Date(selected.startsAt).toLocaleString() },
        { label: 'Client', value: selected.client?.name }, { label: 'Status', value: selected.status },
        { label: 'Location', value: selected.location }, { label: 'Meeting URL', value: selected.meetUrl },
        { label: 'Notes', value: selected.notes },
      ] : []} />
    </div>
  );
}
