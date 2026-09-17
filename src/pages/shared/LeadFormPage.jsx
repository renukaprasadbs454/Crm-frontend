import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createLead,
  getLead,
  updateLead,
  convertLead,
  listLeadActivities,
  addLeadActivity,
} from '../../services/crm.js';
import { listMembers } from '../../services/company.js';
import CallButton from '../../components/leads/CallButton.jsx';
import { useAuthStore } from '../../store/authStore.js';
import {
  INTEREST_OPTIONS,
  STAGE_OPTIONS,
  ACTIVITY_TYPE_OPTIONS,
  formatActivityType,
  activityDotClass,
  stageBadgeClass,
  formatStage,
} from '../../utils/constants.js';

const empty = {
  phone: '',
  fullName: '',
  email: '',
  detailType: 'COLLEGE',
  collegeName: '',
  collegeCity: '',
  collegeCourse: '',
  collegeYear: '',
  companyName: '',
  companyCity: '',
  companyIndustry: '',
  companySize: '',
  interest: 'ON_HOLD',
  stage: 'NEW',
  source: 'MANUAL',
  comments: '',
  assignedToId: '',
};

function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('NOTE');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setActivities(await listLeadActivities(leadId));
    } catch {
      toast.error('Failed to load activity');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  async function onAdd(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    try {
      await addLeadActivity(leadId, { type, body: body.trim() });
      setBody('');
      setType('NOTE');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add activity');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">Activity</h2>

      <form onSubmit={onAdd} className="mt-3 space-y-2">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {ACTIVITY_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving || !body.trim()}
            className="ml-auto rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Log activity'}
          </button>
        </div>
        <textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened? (call summary, note, email…)"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </form>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet.</p>
        ) : (
          <ol className="space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="relative pl-5">
                <span
                  className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${activityDotClass(a.type)}`}
                />
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {formatActivityType(a.type)}
                  </span>
                  <span>·</span>
                  <span>{a.author?.name || 'System'}</span>
                  <span>·</span>
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                {a.body && <p className="mt-0.5 text-sm text-slate-800">{a.body}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function LeadFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const base = '/app/leads';

  const [form, setForm] = useState(empty);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [lead, setLead] = useState(null);

  const title = useMemo(() => (isNew ? 'Add lead' : 'Edit lead'), [isNew]);

  const canAssignOthers = ['COMPANY_ADMIN', 'TL'].includes(user?.role);

  useEffect(() => {
    if (canAssignOthers) {
      listMembers()
        .then((members) => setUsers(members.filter((m) => m.role === 'SALES')))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function applyLead(l) {
    setLead(l);
    setForm({
      phone: l.phone || '',
      fullName: l.fullName || '',
      email: l.email || '',
      detailType: l.detailType || (l.companyName ? 'COMPANY' : 'COLLEGE'),
      collegeName: l.collegeName || '',
      collegeCity: l.collegeCity || '',
      collegeCourse: l.collegeCourse || '',
      collegeYear: l.collegeYear || '',
      companyName: l.companyName || '',
      companyCity: l.companyCity || '',
      companyIndustry: l.companyIndustry || '',
      companySize: l.companySize || '',
      interest: l.interest || 'ON_HOLD',
      stage: l.stage || 'NEW',
      source: l.source || 'MANUAL',
      comments: l.comments || '',
      assignedToId: l.assignedToId || '',
    });
  }

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    getLead(id)
      .then(applyLead)
      .catch(() => {
        toast.error('Lead not found');
        navigate(base);
      })
      .finally(() => setLoading(false));
  }, [id, isNew, navigate, base]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      email: form.email || null,
      assignedToId: form.assignedToId || null,
    };
    try {
      if (isNew) {
        await createLead(payload);
        toast.success('Lead created');
      } else {
        await updateLead(id, payload);
        toast.success('Lead updated');
      }
      navigate(base);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function onConvert() {
    const ref = window.prompt(
      'Convert this lead to a student.\nOptional student/enrollment reference:',
      lead?.convertedRef || ''
    );
    // Cancelled
    if (ref === null) return;
    setConverting(true);
    try {
      const updated = await convertLead(id, { convertedRef: ref || undefined });
      applyLead(updated);
      toast.success('Lead converted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Convert failed');
    } finally {
      setConverting(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-brand-900">{title}</h1>
            {!isNew && (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadgeClass(form.stage)}`}
              >
                {formatStage(form.stage)}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Phone must be unique.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && lead?.convertedAt && (
            <span className="text-xs font-medium text-emerald-700">
              Converted{lead.convertedRef ? ` · ${lead.convertedRef}` : ''}
            </span>
          )}
          {!isNew && <CallButton lead={lead} />}
          {!isNew && !lead?.convertedAt && (
            <button
              type="button"
              onClick={onConvert}
              disabled={converting}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            >
              {converting ? 'Converting…' : 'Convert to student'}
            </button>
          )}
          <Link to={base} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(320px,380px)]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-1">
              <span className="mb-1 block font-medium">Phone *</span>
              <input
                required
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                placeholder="9876543210"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Full name</span>
              <input
                value={form.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Interest *</span>
              <select
                required
                value={form.interest}
                onChange={(e) => setField('interest', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              >
                {INTEREST_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Pipeline stage</span>
              <select
                value={form.stage}
                onChange={(e) => setField('stage', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Source</span>
              <input
                value={form.source}
                onChange={(e) => setField('source', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                placeholder="MANUAL, WEBSITE, referral…"
              />
            </label>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">Lead details</p>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
                {['COLLEGE', 'COMPANY'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setField('detailType', type)}
                    className={`rounded-md px-3 py-1.5 ${form.detailType === type ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    {type === 'COLLEGE' ? 'College details' : 'Company details'}
                  </button>
                ))}
              </div>
            </div>
            {form.detailType === 'COLLEGE' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium">College name *</span>
                <input
                  required
                  value={form.collegeName}
                  onChange={(e) => setField('collegeName', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">City</span>
                <input
                  value={form.collegeCity}
                  onChange={(e) => setField('collegeCity', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Course</span>
                <input
                  value={form.collegeCourse}
                  onChange={(e) => setField('collegeCourse', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  placeholder="B.Tech CSE"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Year</span>
                <input
                  value={form.collegeYear}
                  onChange={(e) => setField('collegeYear', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  placeholder="3rd year"
                />
              </label>
            </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium">Company name *</span>
                  <input required value={form.companyName} onChange={(e) => setField('companyName', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2" />
                </label>
                <label className="block text-sm"><span className="mb-1 block font-medium">City</span><input value={form.companyCity} onChange={(e) => setField('companyCity', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2" /></label>
                <label className="block text-sm"><span className="mb-1 block font-medium">Industry</span><input value={form.companyIndustry} onChange={(e) => setField('companyIndustry', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2" /></label>
                <label className="block text-sm"><span className="mb-1 block font-medium">Company size</span><input value={form.companySize} onChange={(e) => setField('companySize', e.target.value)} placeholder="11–25 employees" className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2" /></label>
              </div>
            )}
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Comments</span>
            <textarea
              rows={4}
              value={form.comments}
              onChange={(e) => setField('comments', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="Call notes, follow-up…"
            />
          </label>

          {canAssignOthers && (
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Assign to</span>
              <select
                value={form.assignedToId}
                onChange={(e) => setField('assignedToId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Link
              to={base}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save lead'}
            </button>
          </div>
        </form>

        {!isNew && <ActivityTimeline leadId={id} />}
      </div>
    </div>
  );
}
