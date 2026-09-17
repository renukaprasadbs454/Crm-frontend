import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore.js';
import { listMembers, addCompanyAdmin, addTeamLead, addSalesperson, removeMember, resendMemberOtp } from '../../services/company.js';

function emptyForm() {
  return { email: '', name: '', phone: '', teamName: '', teamId: '' };
}

export default function TeamMembersPage() {
  const user = useAuthStore((s) => s.user);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [addingType, setAddingType] = useState(null); // 'ADMIN' | 'TL' | 'SALES' | null
  const [submitting, setSubmitting] = useState(false);
  const teams = members.filter((m) => m.role === 'TL' && m.ledTeam).map((m) => m.ledTeam);

  const canAddAdmin = user?.role === 'COMPANY_ADMIN';
  const canAddTL = ['COMPANY_ADMIN'].includes(user?.role);
  const canAddSales = ['COMPANY_ADMIN', 'TL'].includes(user?.role);

  function load() {
    setLoading(true);
    listMembers()
      .then(setMembers)
      .catch(() => toast.error('Failed to load team members'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (addingType === 'ADMIN') {
        await addCompanyAdmin(form);
        toast.success('Company Admin added and WhatsApp OTP sent');
      } else if (addingType === 'TL') {
        const payload = { ...form };
        delete payload.teamId;
        await addTeamLead(payload);
        toast.success('Team Lead added and WhatsApp OTP sent');
      } else {
        const payload = { ...form };
        if (user?.role === 'TL') delete payload.teamId;
        await addSalesperson(payload);
        toast.success('Salesperson added and WhatsApp OTP sent');
      }
      setForm(emptyForm());
      setAddingType(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend(id) {
    try {
      await resendMemberOtp(id);
      toast.success('A new WhatsApp OTP was sent');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    }
  }

  async function handleRemove(id) {
    if (!confirm('Delete this user account? This cannot be undone.')) return;
    try {
      await removeMember(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove member');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Team Members</h1>
          <p className="mt-1 text-sm text-slate-500">
            {['COMPANY_ADMIN'].includes(user?.role) ? 'Everyone in your company.' : 'Your team.'}
          </p>
        </div>
        <div className="flex gap-2">
          {canAddAdmin && (
            <button type="button" onClick={() => setAddingType('ADMIN')} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
              + Add Company Admin
            </button>
          )}
          {canAddTL && (
            <button
              type="button"
              onClick={() => setAddingType('TL')}
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
            >
              + Add Team Lead
            </button>
          )}
          {canAddSales && (
            <button
              type="button"
              onClick={() => setAddingType('SALES')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
            >
              + Add Salesperson
            </button>
          )}
        </div>
      </div>

      {addingType && (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-xl border border-slate-200/80 bg-white p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 font-semibold text-slate-800">
            New {addingType === 'ADMIN' ? 'Company Admin' : addingType === 'TL' ? 'Team Lead' : 'Salesperson'}
          </p>
          <p className="sm:col-span-2 rounded-lg bg-violet-50 px-3 py-2 text-xs leading-5 text-violet-800">The new user will receive a WhatsApp OTP. They will verify it and create their own password from the account activation page.</p>
          <input
            required
            placeholder="Full name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            placeholder="WhatsApp phone number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {addingType === 'SALES' && ['COMPANY_ADMIN'].includes(user?.role) && (
            <select
              required
              value={form.teamId || ''}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select Team Lead</option>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          )}
          {addingType === 'TL' && (
            <input
              placeholder="Team name (optional)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              value={form.teamName}
              onChange={(e) => setForm({ ...form, teamName: e.target.value })}
            />
          )}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Adding…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingType(null);
                setForm(emptyForm());
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">{m.role}</td>
                <td className="px-4 py-3">{m.ledTeam?.name || m.team?.name || (m.role === 'TL' ? 'Team Lead' : '—')}</td>
                <td className="px-4 py-3">
                  <span className={!m.isActive ? 'text-slate-400' : !m.isVerified || !m.passwordSetAt ? 'text-amber-700' : 'text-emerald-700'}>
                    {!m.isActive ? 'Inactive' : !m.isVerified || !m.passwordSetAt ? 'Pending activation' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {m.id !== user?.id && m.isActive && !m.isVerified && (
                    <button type="button" onClick={() => handleResend(m.id)} className="mr-3 text-sm text-violet-600 hover:underline">Resend OTP</button>
                  )}
                  {user?.role === 'COMPANY_ADMIN' && m.id !== user?.id && m.isActive && (
                    <button
                      type="button"
                      onClick={() => handleRemove(m.id)}
                      className="text-sm text-rose-600 hover:underline"
                    >
                      Delete user
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !members.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
