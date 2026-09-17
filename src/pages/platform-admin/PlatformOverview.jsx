import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getPlatformOverview } from '../../services/company.js';

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${tone || 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

export default function PlatformOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPlatformOverview()
      .then(setData)
      .catch(() => toast.error('Failed to load platform overview'));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tenant and usage metadata only — no lead, client, or payment records are ever shown here.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Companies</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total" value={data?.companies?.total ?? '—'} />
          <Stat label="Active" value={data?.companies?.active ?? '—'} tone="text-emerald-600" />
          <Stat label="Trial" value={data?.companies?.trial ?? '—'} tone="text-amber-600" />
          <Stat label="Suspended" value={data?.companies?.suspended ?? '—'} tone="text-rose-600" />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Users across platform</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Team Leads" value={data?.users?.teamLeads ?? '—'} />
          <Stat label="Salespeople" value={data?.users?.salespeople ?? '—'} />
          <Stat label="Solo users" value={data?.users?.soloUsers ?? '—'} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Usage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Stat label="Total leads across platform" value={data?.totalLeadsAcrossPlatform ?? '—'} />
          <Stat label="Active subscriptions" value={data?.activeSubscriptions ?? '—'} />
        </div>
      </div>
    </div>
  );
}
