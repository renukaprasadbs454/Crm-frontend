import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCompanyDashboard } from '../../services/company.js';

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${tone || 'text-brand-900'}`}>{value}</p>
    </div>
  );
}

export default function CompanyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCompanyDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load company overview'));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Company Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Performance across every team in your company.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total leads" value={data?.totalLeads ?? '—'} />
        <Stat label="Won" value={data?.wonLeads ?? '—'} tone="text-emerald-700" />
        <Stat label="Conversion rate" value={data ? `${data.conversionRate}%` : '—'} />
        <Stat label="Team Leads / Sales" value={data ? `${data.tlCount} / ${data.salesCount}` : '—'} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-brand-900">Team performance</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Team Lead</th>
                <th className="px-4 py-3">Salespeople</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Won</th>
                <th className="px-4 py-3">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {(data?.teams || []).map((t) => (
                <tr key={t.teamId} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{t.teamName}</td>
                  <td className="px-4 py-3">{t.tl?.name || '—'}</td>
                  <td className="px-4 py-3">{t.salesCount}</td>
                  <td className="px-4 py-3">{t.leads}</td>
                  <td className="px-4 py-3">{t.won}</td>
                  <td className="px-4 py-3">{t.leads ? Math.round((t.won / t.leads) * 1000) / 10 : 0}%</td>
                </tr>
              ))}
              {!data?.teams?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No teams yet. Add a Team Lead from Team Members to get started.
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
