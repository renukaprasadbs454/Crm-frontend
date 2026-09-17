import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getClientDashboard } from '../../services/clientPortal.js';

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-brand-900">{value}</p>
    </div>
  );
}

function money(v) {
  return `₹${Number(v || 0).toLocaleString()}`;
}

export default function ClientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getClientDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load client portal'));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">
          Welcome{data?.client?.name ? `, ${data.client.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s your latest project and payment overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Projects" value={data?.counts?.projects ?? '—'} />
        <Stat label="Ongoing" value={data?.counts?.ongoingProjects ?? '—'} />
        <Stat label="Meetings" value={data?.counts?.meetings ?? '—'} />
        <Stat label="Unread messages" value={data?.counts?.unreadMessages ?? '—'} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Project value" value={data ? money(data.finance.projectValue) : '—'} />
        <Stat label="Received" value={data ? money(data.finance.received) : '—'} />
        <Stat label="Pending" value={data ? money(data.finance.pending) : '—'} />
        <Stat label="Expenses" value={data ? money(data.finance.expenses) : '—'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h2 className="font-semibold text-slate-800">Upcoming meetings</h2>
          <ul className="mt-3 space-y-2">
            {(data?.meetings || []).slice(0, 5).map((m) => (
              <li key={m.id} className="text-sm">
                <span className="font-medium">{m.title}</span>
                <span className="text-slate-500"> · {new Date(m.startsAt).toLocaleString()}</span>
              </li>
            ))}
            {!data?.meetings?.length && <li className="text-sm text-slate-500">No upcoming meetings.</li>}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h2 className="font-semibold text-slate-800">Recent messages</h2>
          <ul className="mt-3 space-y-2">
            {(data?.messages || []).slice(0, 6).map((m) => (
              <li key={m.id} className="text-sm">
                <p className="font-medium text-slate-800">{m.subject || 'Message'}</p>
                <p className="text-slate-600">{m.body}</p>
              </li>
            ))}
            {!data?.messages?.length && <li className="text-sm text-slate-500">No messages yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
