import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSolo } from '../../services/company.js';

export default function SoloSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ companyName: '', name: '', email: '', phone: '', verificationChannel: 'whatsapp' });
  const [submitting, setSubmitting] = useState(false);
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const pending = localStorage.getItem('skill99.pendingActivation');
    if (pending) navigate(`/activate?${pending}`, { replace: true });
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await registerSolo(form);
      const activationIdentifier = result.channel === 'email' ? result.email : result.user.phone;
      const activationQuery = `identifier=${encodeURIComponent(activationIdentifier)}&channel=${result.channel}`;
      localStorage.setItem('skill99.pendingActivation', activationQuery);
      toast.success('Account created. Verify your OTP to continue.');
      navigate(`/activate?${activationQuery}`, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed');
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
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl"><UserRound size={24} /></div>
          <p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-violet-600">Freelancer onboarding</p>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Create your solo workspace</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Manage your leads, clients, projects and follow-ups in one private CRM workspace.</p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><UserRound size={20} /></div>
              <div><h2 className="font-black text-slate-950">Freelancer details</h2><p className="text-xs text-slate-500">Your private CRM identity.</p></div>
            </div>
            <div className="mt-6 space-y-4">
              <label className="text-sm font-bold text-slate-700">Company / business name<input required value={form.companyName} onChange={(event) => setField('companyName', event.target.value)} placeholder="Your business name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-bold text-slate-700">Full name<input required value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Your full name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-bold text-slate-700">WhatsApp / mobile<input required value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="9876543210" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <label className="text-sm font-bold text-slate-700">Email<input required type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
              <fieldset className="text-sm font-bold text-slate-700"><legend>Verify using one method</legend><div className="mt-2 flex gap-5 font-normal"><label><input type="radio" name="verificationChannel" value="whatsapp" checked={form.verificationChannel === 'whatsapp'} onChange={(event) => setField('verificationChannel', event.target.value)} /> WhatsApp</label><label><input type="radio" name="verificationChannel" value="email" checked={form.verificationChannel === 'email'} onChange={(event) => setField('verificationChannel', event.target.value)} /> Email</label></div></fieldset>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500"><CheckCircle2 size={15} className="mr-1 inline text-emerald-500" /> Your solo workspace starts with a 7-day free trial. Choose a subscription before the trial ends.</div>
            <button type="submit" disabled={submitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-60">{submitting ? 'Creating workspace…' : 'Create solo workspace'} <ArrowRight size={17} /></button>
            <p className="mt-4 text-center text-xs text-slate-500">7-day trial • Mobile OTP verification is required before access.</p>
          </section>
        </form>
      </div>
    </main>
  );
}
