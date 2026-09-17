import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, UserRound } from 'lucide-react';

export default function SignupChoice() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_8%_4%,rgba(124,58,237,.14),transparent_27%),radial-gradient(circle_at_92%_88%,rgba(14,165,233,.12),transparent_30%),#f8fafc px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-tight text-slate-950">Skill99 <span className="text-violet-600">CRM</span></Link>
          <Link to="/login" className="text-sm font-bold text-slate-500 transition hover:text-violet-600">Already have an account?</Link>
        </header>
        <section className="mx-auto mt-16 max-w-2xl text-center sm:mt-20">
          <p className="text-xs font-black uppercase tracking-[.22em] text-violet-600">Step 1 of 1 · Workspace setup</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Choose your workspace</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">Start with the workspace that matches how you work today.</p>
        </section>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Link
            to="/signup/solo"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100 sm:p-8"
          >
            <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-50 text-violet-700"><UserRound size={24} /></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">Freelancer</span></div>
            <p className="mt-8 font-display text-2xl font-black text-slate-950">Solo workspace</p>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">A focused private workspace for managing your own business and client relationships.</p>
            <ul className="mt-6 space-y-3 text-left text-sm font-semibold text-slate-700"><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Leads and pipeline</li><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Clients and projects</li><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Private CRM workspace</li></ul>
            <div className="mt-8 flex items-center gap-2 font-bold text-violet-700">Create solo workspace <ArrowRight size={17} className="transition group-hover:translate-x-1" /></div>
          </Link>
          <Link
            to="/signup/company"
            className="group relative overflow-hidden rounded-2xl border border-sky-200 bg-white p-6 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 sm:p-8"
          >
            <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-sky-700"><Building2 size={24} /></div><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">Organisation</span></div>
            <p className="mt-8 font-display text-2xl font-black">Company workspace</p>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">Bring your team together with shared CRM records, assignments and performance visibility.</p>
            <ul className="mt-6 space-y-3 text-left text-sm font-semibold text-slate-700"><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Leads, clients and projects</li><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Team Leads and sales reps</li><li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Reports and team controls</li></ul>
            <div className="mt-8 flex items-center gap-2 font-bold text-sky-700">Create organisation workspace <ArrowRight size={17} className="transition group-hover:translate-x-1" /></div>
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">You can’t change workspace type after registration.</p>
      </div>
    </main>
  );
}
