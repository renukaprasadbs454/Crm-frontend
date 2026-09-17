import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Globe2, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerCompany } from '../../services/company.js';

const sizes = [
  { label: '1–10 employees', value: 10 },
  { label: '11–25 employees', value: 25 },
  { label: '26–50 employees', value: 50 },
  { label: '51–100 employees', value: 100 },
  { label: '101–250 employees', value: 250 },
  { label: '251+ employees', value: 251 },
];

const industries = ['Education', 'IT / Software', 'Consulting', 'Marketing', 'Finance', 'Healthcare', 'Real Estate', 'Other'];

export default function CompanySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '', industry: '', employeeCount: '', website: '', city: '',
    name: '', email: '', phone: '', planTier: 'COMPANY_STARTER', verificationChannel: 'whatsapp',
  });
  const [submitting, setSubmitting] = useState(false);
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const pending = localStorage.getItem('skill99.pendingActivation');
    if (pending) navigate(`/activate?${pending}`, { replace: true });
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await registerCompany({
        ...form,
        employeeCount: Number(form.employeeCount),
        website: form.website || undefined,
      });
      const activationIdentifier = result.channel === 'email' ? result.email : result.user.phone;
      const activationQuery = `identifier=${encodeURIComponent(activationIdentifier)}&channel=${result.channel}`;
      localStorage.setItem('skill99.pendingActivation', activationQuery);
      toast.success('Account created. Your 7-day free trial starts now.');
      navigate(`/activate?${activationQuery}`, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,.14),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(14,165,233,.10),transparent_28%),#f8fafc px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600"><ArrowLeft size={16} /> Back</Link>
            <Link to="/" className="font-black text-2xl tracking-tight text-slate-950">Skill99 <span className="text-violet-600">CRM</span></Link>
          </div>
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-violet-600">Already have an account?</Link>
        </div>

        <section className="mx-auto mt-10 max-w-3xl text-center animate-fade-up">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl"><Building2 size={24} /></div>
          <p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-violet-600">Company onboarding</p>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Create your organisation workspace</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Tell us about your company and the person who will manage the CRM. Your account becomes the first Company Admin.</p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 animate-fade-up">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Building2 size={20}/></div><div><h2 className="font-black text-slate-950">Organisation details</h2><p className="text-xs text-slate-500">Used to configure your CRM workspace.</p></div></div>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Company name<input required value={form.companyName} onChange={(e) => setField('companyName', e.target.value)} placeholder="Acme Technologies Pvt Ltd" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label>
              <label className="text-sm font-bold text-slate-700">Industry<select required value={form.industry} onChange={(e) => setField('industry', e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"><option value="">Select industry</option>{industries.map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className="text-sm font-bold text-slate-700">Company size<select required value={form.employeeCount} onChange={(e) => setField('employeeCount', e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"><option value="">Select employees</option>{sizes.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
              <label className="text-sm font-bold text-slate-700">City<input required value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="Bengaluru" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-bold text-slate-700">Website <span className="font-normal text-slate-400">(optional)</span><div className="relative mt-1.5"><Globe2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="url" value={form.website} onChange={(e) => setField('website', e.target.value)} placeholder="https://company.com" className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4" /></div></label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 animate-fade-up" style={{ animationDelay: '90ms' }}>
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><UsersRound size={20}/></div><div><h2 className="font-black text-slate-950">Company Admin</h2><p className="text-xs text-slate-500">Your secure CRM identity.</p></div></div>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Owner / Admin name<input required value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your full name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="block text-sm font-bold text-slate-700">WhatsApp / mobile<input required value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="9876543210" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="block text-sm font-bold text-slate-700">Owner email<input required type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="owner@company.com" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <fieldset className="text-sm font-bold text-slate-700"><legend>Verify using one method</legend><div className="mt-2 flex gap-5 font-normal"><label><input type="radio" name="companyVerificationChannel" value="whatsapp" checked={form.verificationChannel === 'whatsapp'} onChange={(e) => setField('verificationChannel', e.target.value)} /> WhatsApp</label><label><input type="radio" name="companyVerificationChannel" value="email" checked={form.verificationChannel === 'email'} onChange={(e) => setField('verificationChannel', e.target.value)} /> Email</label></div></fieldset>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500"><CheckCircle2 size={15} className="mr-1 inline text-emerald-500"/> Your role is assigned by the backend as <b>COMPANY_ADMIN</b>. The browser cannot promote an account to another role.</div>
            <button disabled={submitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-60">{submitting ? 'Creating workspace…' : 'Start 7-day free trial'} <ArrowRight size={17}/></button>
            <p className="mt-4 text-center text-xs text-slate-500">No payment today. Your 7-day free trial starts after account creation. Mobile OTP verification is required before access.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
