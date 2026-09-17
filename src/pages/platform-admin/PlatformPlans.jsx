import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createPlan, deletePlan, listPlans, updatePlan } from '../../services/company.js';

function PlanEditor({ plan, onCancel, onSave }) {
  const [form, setForm] = useState({ name: plan.name, priceMonthly: plan.priceMonthly, maxUsers: plan.maxUsers ?? '', maxTLs: plan.maxTLs ?? '', maxLeads: plan.maxLeads ?? '', storageGB: plan.storageGB ?? '', apiCallsPerMonth: plan.apiCallsPerMonth ?? '', isActive: plan.isActive });
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
    <input required value={form.name} onChange={(event) => setField('name', event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" placeholder="Plan name" />
    <input required type="number" min="0" value={form.priceMonthly} onChange={(event) => setField('priceMonthly', event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" placeholder="Monthly price" />
    {['maxUsers', 'maxTLs', 'maxLeads', 'storageGB', 'apiCallsPerMonth'].map((key) => <input key={key} type="number" min="0" value={form[key]} onChange={(event) => setField(key, event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" placeholder={key} />)}
    <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={form.isActive} onChange={(event) => setField('isActive', event.target.checked)} /> Active</label>
    <div className="flex gap-2 sm:col-span-2"><button type="submit" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">Save</button><button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">Cancel</button></div>
  </form>;
}

const PLAN_TIERS = ['SOLO_FREE', 'SOLO_PRO', 'SOLO_BUSINESS', 'COMPANY_STARTER', 'COMPANY_GROWTH', 'COMPANY_PRO', 'ENTERPRISE'];
const LIMIT_FIELDS = [
  ['maxUsers', 'Maximum users', 'Leave blank for unlimited'],
  ['maxTLs', 'Team leads', 'Company plans only'],
  ['maxLeads', 'Maximum leads', 'Total lead records'],
  ['storageGB', 'Storage (GB)', 'File storage allowance'],
  ['apiCallsPerMonth', 'API calls / month', 'Monthly API quota'],
];

function AddPlanForm({ plans, value, onChange, onCancel, onSave }) {
  const availableTiers = PLAN_TIERS.filter((tier) => !plans.some((plan) => plan.tier === tier));
  const setField = (key, fieldValue) => onChange({ ...value, [key]: fieldValue });
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave(value); }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-slate-100 pb-4"><h2 className="font-display text-lg font-bold text-slate-900">Create subscription plan</h2><p className="mt-1 text-sm text-slate-500">Define pricing, access limits, and the workspace this plan serves.</p></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Plan tier<select required disabled={!availableTiers.length} value={value.tier} onChange={(event) => setField('tier', event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">{availableTiers.length ? 'Choose an available tier' : 'All plan tiers are already in use'}</option>{availableTiers.map((tier) => <option key={tier} value={tier}>{tier}</option>)}</select>{!availableTiers.length && <span className="mt-1 block text-xs font-normal text-amber-700">The current catalog already has every supported tier. Edit an existing plan below, or add another tier to the PlanTier catalog before creating a new one.</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Plan name<input required value={value.name} onChange={(event) => setField('name', event.target.value)} placeholder="e.g. Solo Plus" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
        <label className="block text-sm font-semibold text-slate-700">Workspace type<select required value={value.workspaceType} onChange={(event) => setField('workspaceType', event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="SOLO">Solo workspace</option><option value="COMPANY">Company workspace</option></select></label>
        <div className="grid grid-cols-[1fr_2fr] gap-2"><label className="block text-sm font-semibold text-slate-700">Currency<input maxLength={3} required value={value.currency} onChange={(event) => setField('currency', event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase" /></label><label className="block text-sm font-semibold text-slate-700">Monthly price<input required type="number" min="0" value={value.priceMonthly} onChange={(event) => setField('priceMonthly', event.target.value)} placeholder="0" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label></div>
      </div>
      <div className="mt-6"><h3 className="text-sm font-bold text-slate-800">Usage limits</h3><p className="mt-1 text-xs text-slate-500">Blank limits are unlimited. These values control workspace capacity.</p><div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{LIMIT_FIELDS.map(([key, label, hint]) => <label key={key} className="block text-sm font-semibold text-slate-700">{label}<input type="number" min="0" value={value[key]} onChange={(event) => setField(key, event.target.value)} placeholder="Unlimited" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><span className="mt-1 block text-[11px] font-normal text-slate-400">{hint}</span></label>)}</div></div>
      <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={value.isActive} onChange={(event) => setField('isActive', event.target.checked)} /> Make this plan available immediately</label>
      <div className="mt-5 flex gap-2"><button type="submit" disabled={!availableTiers.length} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Create plan</button><button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button></div>
    </form>
  );
}

export default function PlatformPlans() {
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const blankPlan = { tier: '', name: '', workspaceType: 'SOLO', priceMonthly: 0, currency: 'INR', maxUsers: '', maxTLs: '', maxLeads: '', storageGB: '', apiCallsPerMonth: '', isActive: true };
  const [newPlan, setNewPlan] = useState(blankPlan);

  useEffect(() => {
    listPlans().then(setPlans).catch(() => toast.error('Failed to load plans'));
  }, []);

  async function savePlan(tier, form) {
    try {
      await updatePlan(tier, { ...form, priceMonthly: Number(form.priceMonthly), maxUsers: form.maxUsers === '' ? null : Number(form.maxUsers), maxTLs: form.maxTLs === '' ? null : Number(form.maxTLs), maxLeads: form.maxLeads === '' ? null : Number(form.maxLeads), storageGB: form.storageGB === '' ? null : Number(form.storageGB), apiCallsPerMonth: form.apiCallsPerMonth === '' ? null : Number(form.apiCallsPerMonth) });
      setPlans(await listPlans());
      setEditing(null);
      toast.success('Plan updated');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to update plan'); }
  }

  async function addPlan(planForm) {
    try {
      const payload = { ...planForm, priceMonthly: Number(planForm.priceMonthly) };
      for (const key of ['maxUsers', 'maxTLs', 'maxLeads', 'storageGB', 'apiCallsPerMonth']) payload[key] = planForm[key] === '' ? null : Number(planForm[key]);
      await createPlan(payload);
      setPlans(await listPlans());
      setNewPlan(blankPlan);
      setShowAdd(false);
      toast.success('Plan created');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to create plan'); }
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete the ${plan.name} plan?`)) return;
    try { await deletePlan(plan.tier); setPlans(await listPlans()); toast.success('Plan deleted'); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete plan'); }
  }

  const solo = plans.filter((p) => p.workspaceType === 'SOLO');
  const company = plans.filter((p) => p.workspaceType === 'COMPANY');

  function PlanCard({ plan }) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-display text-lg font-bold text-slate-900">{plan.name}</p>
        <p className="mt-1 text-2xl font-bold text-brand-600">
          ₹{Number(plan.priceMonthly).toLocaleString()}<span className="text-sm text-slate-500">/mo</span>
        </p>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          <li>Users: {plan.maxUsers ?? 'Unlimited'}</li>
          <li>Team Leads: {plan.maxTLs ?? 'Unlimited'}</li>
          <li>Leads: {plan.maxLeads ?? 'Unlimited'}</li>
          <li>Storage: {plan.storageGB ?? 'Unlimited'} GB</li>
          <li>API calls/mo: {plan.apiCallsPerMonth ?? 'Unlimited'}</li>
        </ul>
        <div className="mt-4 flex gap-2"><button type="button" onClick={() => setEditing(plan)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">Edit plan</button><button type="button" onClick={() => removePlan(plan)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">Delete plan</button></div>
        {editing?.tier === plan.tier && <PlanEditor plan={plan} onCancel={() => setEditing(null)} onSave={(form) => savePlan(plan.tier, form)} />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Plans</h1>
        <p className="mt-1 text-sm text-slate-500">The sellable plan catalog for Solo and Company workspaces.</p>
      </div>
      <button type="button" onClick={() => setShowAdd((value) => !value)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">+ Add subscription plan</button>
      {showAdd && <AddPlanForm plans={plans} value={newPlan} onChange={setNewPlan} onCancel={() => setShowAdd(false)} onSave={addPlan} />}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Solo</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {solo.map((p) => <PlanCard key={p.tier} plan={p} />)}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Company</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {company.map((p) => <PlanCard key={p.tier} plan={p} />)}
        </div>
      </div>
    </div>
  );
}
