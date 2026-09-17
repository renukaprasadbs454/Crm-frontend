import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteCompanySubscription, listCompanies, updateCompanyStatus, updateCompanySubscription, platformCreateCompany, listPlans, deletePlatformCompany } from '../../services/company.js';

const STATUS_OPTIONS = ['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED'];

function emptyForm() {
  return { companyName: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerPassword: '', verificationChannel: 'email', planTier: 'COMPANY_STARTER' };
}

export default function PlatformCompanies() {
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    listCompanies()
      .then(setCompanies)
      .catch(() => toast.error('Failed to load companies'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    listPlans().then((p) => setPlans(p.filter((pl) => pl.workspaceType === 'COMPANY')))
      .catch(() => {});
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await updateCompanyStatus(id, status);
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  }

  async function handlePlanChange(id, planTier) {
    try {
      await updateCompanySubscription(id, { planTier });
      toast.success('Subscription plan updated');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update plan');
    }
  }

  async function handleSubscriptionDelete(company) {
    if (!window.confirm(`Delete the subscription for ${company.name}?`)) return;
    try { await deleteCompanySubscription(company.id); toast.success('Subscription deleted'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete subscription'); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await platformCreateCompany(form);
      toast.success('Company created pending email verification');
      setForm(emptyForm());
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  }

  function showPaymentDetails(company) {
    const payment = company.paymentDetails;
    if (!payment) return;
    window.alert(`Payment details\n\nPlan: ${company.plan?.name || '—'}\nStatus: ${company.subscriptionStatus || '—'}\nRazorpay order: ${payment.razorpayOrderId || 'Not available'}\nRazorpay payment: ${payment.razorpayPaymentId || 'Not available'}\nPaid at: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Not paid'}\nStarted: ${payment.startedAt ? new Date(payment.startedAt).toLocaleString() : '—'}\nPeriod ends: ${payment.currentPeriodEnd ? new Date(payment.currentPeriodEnd).toLocaleString() : '—'}`);
  }

  async function handleDelete(company) {
    if (!window.confirm(`Delete ${company.name} and all its members?`)) return;
    try { await deletePlatformCompany(company.id); toast.success('Company deleted'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete company'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Companies</h1>
          <p className="mt-1 text-sm text-slate-500">Tenant metadata, subscription status, and usage counts.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
        >
          + Add Company
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <input
            placeholder="Owner phone (optional)"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            value={form.ownerPhone}
            onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
          />
          <select value={form.verificationChannel} onChange={(e) => setForm({ ...form, verificationChannel: e.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="email">Verify by email</option><option value="whatsapp">Verify by WhatsApp</option></select>
          <input
            required
            placeholder="Company name"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            value={form.planTier}
            onChange={(e) => setForm({ ...form, planTier: e.target.value })}
          >
            {plans.map((p) => (
              <option key={p.tier} value={p.tier}>{p.name}</option>
            ))}
          </select>
          <input
            required
            placeholder="Owner name"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Owner email"
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
            value={form.ownerEmail}
            onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Temporary password"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 sm:col-span-2"
            value={form.ownerPassword}
            onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
          />
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create Company'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-3">{c.owner?.name} <span className="text-slate-400">({c.owner?.email})</span></td>
                <td className="px-4 py-3"><select value={c.plan?.tier || ''} onChange={(e) => handlePlanChange(c.id, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"><option value="">No subscription</option>{plans.map((p) => <option key={p.tier} value={p.tier}>{p.name}</option>)}</select>{c.subscriptionStatus && <button type="button" onClick={() => handleSubscriptionDelete(c)} className="ml-2 text-rose-600 hover:underline">Delete subscription</button>}</td>
                <td className="px-4 py-3">{c.paymentDetails ? <button type="button" onClick={() => showPaymentDetails(c)} className="text-brand-600 hover:underline">Payment details</button> : '—'}</td>
                <td className="px-4 py-3">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right"><button type="button" onClick={() => handleDelete(c)} className="text-rose-600 hover:underline">Delete</button></td>
              </tr>
            ))}
            {!loading && !companies.length && (
              <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No companies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
