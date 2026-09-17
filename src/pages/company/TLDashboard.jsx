import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTLDashboard } from '../../services/company.js';

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${tone || 'text-brand-900'}`}>{value}</p>
    </div>
  );
}

export default function TLDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getTLDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load team overview'));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">
          {data?.teamName || 'My Team'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">How your team is performing this cycle.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Team leads" value={data?.totalLeads ?? '—'} />
        <Stat label="Won" value={data?.wonLeads ?? '—'} tone="text-emerald-700" />
        <Stat label="Conversion rate" value={data ? `${data.conversionRate}%` : '—'} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-brand-900">Team members</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Salesperson</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Won</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.members || []).map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">{m.leads}</td>
                  <td className="px-4 py-3">{m.won}</td>
                  <td className="px-4 py-3">
                    <span className={m.isActive ? 'text-emerald-700' : 'text-slate-400'}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.members?.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No salespeople on your team yet. Add one from Team Members.
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
