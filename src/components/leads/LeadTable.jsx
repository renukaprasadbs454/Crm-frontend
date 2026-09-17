import { Link } from 'react-router-dom';
import CallButton from './CallButton.jsx';
import {
  formatInterest,
  interestBadgeClass,
  formatStage,
  stageBadgeClass,
} from '../../utils/constants.js';

export default function LeadTable({ leads, basePath, onDelete }) {
  if (!leads?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Details</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Interest</th>
            <th className="px-4 py-3">Assigned</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-50 transition hover:bg-brand-50/40 last:border-0">
              <td className="px-4 py-3 font-medium text-brand-700">
                <Link to={`${basePath}/${lead.id}`} className="hover:underline" aria-label={`View details for ${lead.phone}`}>
                  {lead.phone}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link to={`${basePath}/${lead.id}`} className="hover:text-brand-700 hover:underline">
                  {lead.fullName || '—'}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link to={`${basePath}/${lead.id}`} className="block hover:text-brand-700">
                  <div>{lead.detailType === 'COMPANY' ? lead.companyName : lead.collegeName}</div>
                  <div className="text-xs text-slate-500">
                  {(lead.detailType === 'COMPANY' ? [lead.companyCity, lead.companyIndustry, lead.companySize] : [lead.collegeCity, lead.collegeCourse, lead.collegeYear]).filter(Boolean).join(' · ') ||
                    '—'}
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadgeClass(lead.stage)}`}>
                  {formatStage(lead.stage)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${interestBadgeClass(lead.interest)}`}>
                  {formatInterest(lead.interest)}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.assignedTo?.name || '—'}</td>
              <td className="px-4 py-3 text-right">
                <CallButton lead={lead} className="px-3 py-1.5" />
                <Link
                  to={`${basePath}/${lead.id}`}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  View details
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(lead)}
                    className="ml-3 font-medium text-rose-600 hover:text-rose-700"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
