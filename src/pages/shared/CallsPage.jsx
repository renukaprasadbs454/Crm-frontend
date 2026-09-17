import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Activity, Clock3, History, PhoneCall, Radio, Smartphone, Timer, XCircle } from 'lucide-react';
import { callsApi } from '../../services/crm.js';
import DetailsModal from '../../components/common/DetailsModal.jsx';

function secondsToLabel(seconds = 0) {
  const total = Math.max(0, Number(seconds) || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}h ${m}m` : `${m}m ${String(s).padStart(2, '0')}s`;
}

const statusMeta = {
  QUEUED: ['Queued', 'bg-amber-50 text-amber-700'],
  DELIVERED: ['Delivered', 'bg-sky-50 text-sky-700'],
  RINGING: ['Ringing', 'bg-violet-50 text-violet-700'],
  CONNECTED: ['Connected', 'bg-emerald-50 text-emerald-700'],
  ENDED: ['Completed', 'bg-slate-100 text-slate-700'],
  FAILED: ['Failed', 'bg-rose-50 text-rose-700'],
  EXPIRED: ['Expired', 'bg-rose-50 text-rose-700'],
};

function StatusBadge({ status }) {
  const [label, cls] = statusMeta[status] || [status, 'bg-slate-100 text-slate-600'];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{label}</span>;
}

export default function CallsPage() {
  const [dashboard, setDashboard] = useState({ totalCalls: 0, connectedCalls: 0, avgDurationSeconds: 0, totalTalkSeconds: 0, recordings: 0 });
  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);

  async function load({ silent = false } = {}) {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const [stats, calls] = await Promise.all([callsApi.dashboard(), callsApi.list({ page: 1, limit: 40, status: status || undefined })]);
      setDashboard(stats);
      setData(calls);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load calls');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, [status]);

  useEffect(() => {
    const timer = window.setInterval(() => load({ silent: true }), 5000);
    return () => window.clearInterval(timer);
  }, [status]);

  const talkTimeLabel = useMemo(() => secondsToLabel(dashboard.totalTalkSeconds), [dashboard.totalTalkSeconds]);
  const avgLabel = useMemo(() => secondsToLabel(dashboard.avgDurationSeconds), [dashboard.avgDurationSeconds]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-brand-600">Sales activity</p>
          <h1 className="mt-1 font-display text-3xl font-black text-brand-900">Calls</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Every mobile call stays attached to the CRM lead, agent and device.</p>
        </div>
        <button onClick={() => load({ silent: true })} disabled={refreshing} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 disabled:opacity-50">
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total calls', dashboard.totalCalls, PhoneCall],
          ['Connected', dashboard.connectedCalls, Radio],
          ['Avg duration', avgLabel, Timer],
          ['Talk time', talkTimeLabel, Clock3],
        ].map(([label, value, Icon], index) => (
          <div key={label} className="group animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${index * 70}ms` }}>
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:scale-110"><Icon size={20} /></div></div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><div className="flex items-center gap-2"><History size={18} className="text-brand-600"/><h2 className="font-display text-lg font-black text-brand-900">Recent calls</h2></div><p className="mt-1 text-xs text-slate-500">The page refreshes while a mobile caller is active.</p></div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium">
            <option value="">All statuses</option><option value="QUEUED">Queued</option><option value="DELIVERED">Delivered</option><option value="RINGING">Ringing</option><option value="CONNECTED">Connected</option><option value="ENDED">Completed</option><option value="FAILED">Failed</option>
          </select>
        </div>
        {loading ? <div className="px-6 py-12 text-center text-sm text-slate-500">Loading calls…</div> : !data.items.length ? (
          <div className="px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><PhoneCall size={24}/></div><h3 className="mt-4 font-black text-slate-900">No calls recorded yet</h3><p className="mt-1 text-sm text-slate-500">Open a lead and use its Call button after pairing the Skill99 Mobile Caller.</p></div>
        ) : (
          <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Lead</th><th className="px-5 py-3">Agent</th><th className="px-5 py-3">Device / SIM</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Duration</th><th className="px-5 py-3">Time</th><th className="px-5 py-3">Recording</th></tr></thead><tbody>{data.items.map((call) => <tr key={call.id} onClick={() => setSelected(call)} className="cursor-pointer border-t border-slate-100 transition hover:bg-brand-50/40"><td className="px-5 py-4"><div className="font-bold text-brand-700">{call.lead?.fullName || 'Unnamed lead'}</div><div className="text-xs text-slate-500">{call.lead?.phone || call.phoneNumber}</div></td><td className="px-5 py-4 text-slate-700">{call.agent?.name || '—'}</td><td className="px-5 py-4"><div className="flex items-center gap-2 text-slate-700"><Smartphone size={15}/>{call.device?.deviceName || 'Mobile'}</div><div className="mt-1 text-xs text-slate-500">{call.device?.selectedSimId || call.simSlot || 'SIM not selected'}</div></td><td className="px-5 py-4"><StatusBadge status={call.status}/></td><td className="px-5 py-4 font-semibold text-slate-700">{secondsToLabel(call.durationSeconds)}</td><td className="px-5 py-4 text-xs text-slate-500">{new Date(call.initiatedAt).toLocaleString()}</td><td className="px-5 py-4">{call.recordings?.some((r) => r.uploadStatus === 'UPLOADED') ? <span className="text-xs font-bold text-emerald-600">Available</span> : <span className="text-xs text-slate-400">—</span>}</td></tr>)}</tbody></table></div>
        )}
      </section>

      <DetailsModal title="Call" item={selected} onClose={() => setSelected(null)} fields={selected ? [
        { label: 'Lead', value: selected.lead?.fullName || 'Unnamed lead' },
        { label: 'Phone', value: selected.lead?.phone || selected.phoneNumber },
        { label: 'Agent', value: selected.agent?.name }, { label: 'Status', value: selected.status },
        { label: 'Duration', value: secondsToLabel(selected.durationSeconds) },
        { label: 'Started', value: new Date(selected.initiatedAt).toLocaleString() },
        { label: 'Device', value: selected.device?.deviceName },
      ] : []} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-700 to-indigo-700 p-5 text-white shadow-lg"><div className="flex items-center gap-2 text-brand-100"><Activity size={17}/><p className="text-xs font-black uppercase tracking-widest">Mobile caller</p></div><p className="mt-3 text-xl font-black">One CRM, one identity.</p><p className="mt-2 text-sm leading-6 text-brand-100">The browser queues the call; the paired Android device places it using the selected SIM.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-900">Recording aware</p><p className="mt-2 text-sm leading-6 text-slate-500">Recording stays optional because cellular call capture depends on Android version, OEM and device policy.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-900">Audit ready</p><p className="mt-2 text-sm leading-6 text-slate-500">Every status change is idempotent and attached to the correct agent, company and lead.</p></div>
      </div>
    </div>
  );
}
