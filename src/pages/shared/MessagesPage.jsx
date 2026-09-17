import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientsApi, messagesApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

const empty = { subject: '', body: '', channel: 'INTERNAL', clientId: '' };

export default function MessagesPage() {
  const [data, setData] = useState({ items: [] });
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [messages, clientList] = await Promise.all([
        messagesApi.list({ limit: 50 }),
        clientsApi.list({ limit: 100 }),
      ]);
      setData(messages);
      setClients(clientList.items || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await messagesApi.create({ ...form, clientId: form.clientId || null });
      toast.success('Message sent');
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Send failed');
    } finally {
      setSaving(false);
    }
  }

  async function markRead(id) {
    try {
      await messagesApi.update(id, { isRead: true });
      load();
    } catch {
      toast.error('Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Messages</h1>
        <p className="mt-1 text-sm text-slate-500">Internal notes and client-facing messages.</p>
      </div>

      <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="INTERNAL">Internal</option>
            <option value="CLIENT">Client</option>
          </select>
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">No client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <textarea required rows={3} placeholder="Message *" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="submit" disabled={saving} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Sending…' : 'Send message'}</button>
      </form>

      <div className="space-y-3">
        {loading ? <p className="text-sm text-slate-500">Loading…</p> : data.items.map((m) => (
          <div key={m.id} onClick={() => setSelected(m)} className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:border-brand-300 ${m.isRead ? 'border-slate-200' : 'border-brand-200 bg-brand-50/30'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{m.channel} · {m.sender?.name || 'System'} · {m.client?.name || 'General'}</span>
              <span>{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            {m.subject && <p className="mt-1 text-sm font-semibold text-slate-800">{m.subject}</p>}
            <p className="mt-1 text-sm text-slate-700">{m.body}</p>
            {!m.isRead && (
              <button type="button" onClick={(event) => { event.stopPropagation(); markRead(m.id); }} className="mt-2 text-xs font-medium text-brand-600">Mark read</button>
            )}
          </div>
        ))}
        {!loading && !data.items.length && <p className="text-sm text-slate-500">No messages yet.</p>}
      </div>
      <DetailsModal title="Message" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Subject', value: selected.subject }, { label: 'Channel', value: selected.channel },
        { label: 'Sender', value: selected.sender?.name }, { label: 'Client', value: selected.client?.name },
        { label: 'Date', value: new Date(selected.createdAt).toLocaleString() }, { label: 'Message', value: selected.body },
        { label: 'Read', value: selected.isRead ? 'Yes' : 'No' },
      ] : []} />
    </div>
  );
}
