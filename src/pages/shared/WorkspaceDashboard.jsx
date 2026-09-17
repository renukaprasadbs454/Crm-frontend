import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBusinessDashboard, getDashboard } from '../../services/crm.js';
import { useLiveRefresh } from '../../hooks/useLiveRefresh.js';

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${tone || 'text-brand-900'}`}>{value}</p>
    </div>
  );
}

function money(n) {
  return `₹${Number(n || 0).toLocaleString()}`;
}

export default function WorkspaceDashboard() {
  const [leadStats, setLeadStats] = useState(null);
  const [biz, setBiz] = useState(null);

  async function loadDashboard(showError = false) {
    try {
      const [leads, business] = await Promise.all([getDashboard(), getBusinessDashboard()]);
      setLeadStats(leads);
      setBiz(business);
    } catch (error) {
      if (showError) toast.error(error.response?.data?.message || 'Failed to load dashboard');
      throw error;
    }
  }

  useEffect(() => {
    loadDashboard(true).catch(() => {});
  }, []);

  useLiveRefresh(() => loadDashboard(false), 10000);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Leads, clients, projects, and money this month.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total leads" value={leadStats?.total ?? '—'} />
        <Stat label="Interested" value={leadStats?.interested ?? '—'} />
        <Stat label="On hold" value={leadStats?.onHold ?? '—'} />
        <Stat label="Won" value={leadStats?.won ?? '—'} />
        <Stat label="Clients" value={biz?.clientsTotal ?? '—'} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-brand-900">Projects</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="New" value={biz?.projects?.new ?? '—'} />
          <Stat label="Ongoing" value={biz?.projects?.ongoing ?? '—'} />
          <Stat label="Completed" value={biz?.projects?.completed ?? '—'} />
          <Stat label="Total" value={biz?.projects?.total ?? '—'} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-brand-900">This month</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Revenue" value={biz ? money(biz.thisMonth.revenue) : '—'} />
          <Stat label="Received" value={biz ? money(biz.thisMonth.received) : '—'} tone="text-emerald-700" />
          <Stat label="Expenses" value={biz ? money(biz.thisMonth.expenses) : '—'} tone="text-rose-600" />
          <Stat label="Money in account" value={biz ? money(biz.thisMonth.moneyInAccount) : '—'} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <p className="text-sm text-slate-500">Active retainers</p>
          <p className="mt-2 font-display text-3xl font-bold text-brand-900">{biz?.retainers?.active ?? '—'}</p>
          <p className="mt-1 text-sm text-slate-500">MRR {biz ? money(biz.retainers.mrr) : '—'}/mo</p>
          <Link to="/app/retainers" className="mt-3 inline-block text-sm font-medium text-brand-600">View retainers →</Link>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-800">All-time revenue</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Total value</p>
              <p className="font-display text-xl font-bold">{biz ? money(biz.allTime.totalProjectValue) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Received</p>
              <p className="font-display text-xl font-bold text-emerald-700">{biz ? money(biz.allTime.amountReceived) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="font-display text-xl font-bold text-amber-700">{biz ? money(biz.allTime.pending) : '—'}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">{biz?.allTime?.collectedPct ?? 0}% collected</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Upcoming meetings</h3>
            <Link to="/app/meetings" className="text-sm text-brand-600">View all</Link>
          </div>
          <ul className="mt-3 space-y-2">
            {(biz?.upcomingMeetings || []).map((m) => (
              <li key={m.id} className="text-sm">
                <span className="font-medium">{m.title}</span>
                <span className="text-slate-500"> · {new Date(m.startsAt).toLocaleString()}</span>
              </li>
            ))}
            {!biz?.upcomingMeetings?.length && <li className="text-sm text-slate-500">No upcoming meetings.</li>}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent clients</h3>
            <Link to="/app/clients" className="text-sm text-brand-600">View all</Link>
          </div>
          <ul className="mt-3 space-y-2">
            {(biz?.recentClients || []).map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-slate-500">{c.status}</span>
              </li>
            ))}
            {!biz?.recentClients?.length && <li className="text-sm text-slate-500">No clients yet. <Link className="text-brand-600" to="/app/clients">Add your first client</Link></li>}
          </ul>
          <div className="mt-4 flex gap-2">
            <Link to="/app/clients" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">Add client</Link>
            <Link to="/app/meetings" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium">Schedule meeting</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
