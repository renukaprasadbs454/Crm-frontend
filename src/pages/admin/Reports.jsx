import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getReportOverview,
  getReportBySource,
  getReportByRep,
} from '../../services/crm.js';
import { formatStage } from '../../utils/constants.js';

function Stat({ label, value, suffix }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-brand-900">
        {value}
        {suffix ? <span className="text-lg font-semibold text-slate-400">{suffix}</span> : null}
      </p>
    </div>
  );
}

export default function AdminReports() {
  const [overview, setOverview] = useState(null);
  const [bySource, setBySource] = useState([]);
  const [byRep, setByRep] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReportOverview(), getReportBySource(), getReportByRep()])
      .then(([o, s, r]) => {
        setOverview(o);
        setBySource(s);
        setByRep(r);
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  const maxFunnel = Math.max(1, ...(overview?.funnel || []).map((f) => f.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Pipeline funnel, sources, and rep performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total leads" value={overview?.total ?? 0} />
        <Stat label="Converted" value={overview?.converted ?? 0} />
        <Stat label="Conversion rate" value={overview?.conversionRate ?? 0} suffix="%" />
        <Stat label="Win rate" value={overview?.winRate ?? 0} suffix="%" />
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-brand-900">Pipeline funnel</h2>
        <div className="mt-4 space-y-3">
          {(overview?.funnel || []).map((f) => (
            <div key={f.stage} className="flex items-center gap-3">
              <span className="w-32 flex-none text-sm text-slate-600">{formatStage(f.stage)}</span>
              <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                <div
                  className="h-full rounded bg-brand-500/80"
                  style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                />
              </div>
              <span className="w-8 flex-none text-right text-sm font-medium text-slate-700">
                {f.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="font-display text-lg font-semibold text-brand-900">By source</h2>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-2.5">Source</th>
                <th className="px-5 py-2.5">Leads</th>
                <th className="px-5 py-2.5">Converted</th>
                <th className="px-5 py-2.5">Rate</th>
              </tr>
            </thead>
            <tbody>
              {bySource.map((s) => (
                <tr key={s.source} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-2.5 font-medium">{s.source}</td>
                  <td className="px-5 py-2.5">{s.total}</td>
                  <td className="px-5 py-2.5">{s.converted}</td>
                  <td className="px-5 py-2.5">{s.conversionRate}%</td>
                </tr>
              ))}
              {bySource.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-4 text-slate-500">
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="font-display text-lg font-semibold text-brand-900">By rep</h2>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-2.5">Rep</th>
                <th className="px-5 py-2.5">Assigned</th>
                <th className="px-5 py-2.5">Won</th>
                <th className="px-5 py-2.5">Rate</th>
              </tr>
            </thead>
            <tbody>
              {byRep.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-2.5">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </td>
                  <td className="px-5 py-2.5">{r.assigned}</td>
                  <td className="px-5 py-2.5">{r.won}</td>
                  <td className="px-5 py-2.5">{r.conversionRate}%</td>
                </tr>
              ))}
              {byRep.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-4 text-slate-500">
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
