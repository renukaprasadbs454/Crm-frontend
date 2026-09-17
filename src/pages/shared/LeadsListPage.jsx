import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteLead, listLeads } from '../../services/crm.js';
import { listMembers } from '../../services/company.js';
import LeadTable from '../../components/leads/LeadTable.jsx';
import { INTEREST_OPTIONS, STAGE_OPTIONS } from '../../utils/constants.js';
import { useAuthStore } from '../../store/authStore.js';

const PAGE_SIZE = 20;

export default function LeadsListPage() {
  const user = useAuthStore((s) => s.user);
  const canFilterByRep = ['COMPANY_ADMIN', 'TL'].includes(user?.role);
  const canDelete = ['COMPANY_ADMIN', 'SOLO'].includes(user?.role);

  const [data, setData] = useState({ items: [], pagination: {} });
  const [interest, setInterest] = useState('');
  const [stage, setStage] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canFilterByRep) {
      listMembers()
        .then((members) => setReps(members.filter((m) => m.role === 'SALES')))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await listLeads({
        interest: interest || undefined,
        stage: stage || undefined,
        assignedToId: canFilterByRep ? assignedToId || undefined : undefined,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setData(res);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interest, stage, assignedToId, page]);

  useEffect(() => {
    setPage(1);
  }, [interest, stage, assignedToId]);

  async function onDelete(lead) {
    if (!window.confirm(`Delete lead ${lead.phone}?`)) return;
    try {
      await deleteLead(lead.id);
      toast.success('Lead deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  }

  function onSearchSubmit() {
    setPage(1);
    load();
  }

  const { pagination } = data;
  const pages = pagination.pages || 1;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">Phone is the unique key.</p>
        </div>
        <Link
          to="/app/leads/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Add lead
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
          placeholder="Search phone, name, college…"
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
        />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All stages</option>
          {STAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All interest</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {canFilterByRep && (
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">All reps</option>
            {reps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={onSearchSubmit}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Search
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            <LeadTable leads={data.items} basePath="/app/leads" onDelete={canDelete ? onDelete : undefined} />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                {pagination.total || 0} lead{pagination.total === 1 ? '' : 's'} · page{' '}
                {pagination.page || 1} of {pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={(pagination.page || 1) <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={(pagination.page || 1) >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
