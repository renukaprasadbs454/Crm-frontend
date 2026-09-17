import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, UserRound, UsersRound } from 'lucide-react';

const roles = [
  { to: '/organisation/signin', title: 'Company Admin', eyebrow: 'Full company control', text: 'Manage your CRM, team, customers, sales activity and company settings from one workspace.', icon: ShieldCheck, tone: 'from-violet-50 to-white border-violet-200 hover:border-violet-300', iconTone: 'bg-violet-100 text-violet-700' },
  { to: '/staff/login?role=TL', title: 'Team Lead', eyebrow: 'Lead the sales team', text: 'Manage assigned sales reps, pipeline performance and team activity with the same CRM identity.', icon: UsersRound, tone: 'from-emerald-50 to-white border-emerald-200 hover:border-emerald-300', iconTone: 'bg-emerald-100 text-emerald-700' },
  { to: '/staff/login?role=SALES', title: 'Sales Rep', eyebrow: 'Work your pipeline', text: 'Access assigned leads, customers, tasks, calls and daily sales activity securely.', icon: UserRound, tone: 'from-sky-50 to-white border-sky-200 hover:border-sky-300', iconTone: 'bg-sky-100 text-sky-700' },
];

export default function OrganisationAuth() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,.12),transparent_28%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,.10),transparent_30%),linear-gradient(#f8fafc,#eef4fb)] px-5 py-7 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between px-1">
          <Link to="/login" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-violet-700"><ArrowLeft size={16} className="transition group-hover:-translate-x-1"/>Back</Link>
          <Link to="/signup/company" className="text-sm font-black text-violet-600 transition hover:text-violet-800">Create an organisation</Link>
        </header>

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14 animate-fade-up">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.25rem] bg-slate-950 text-white shadow-xl shadow-slate-300/50"><Building2 size={27}/></div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-[.18em] text-slate-500 shadow-sm">One CRM identity · Role-based access</div>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Organisation access</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Choose your role and continue to the same secure Skill99 CRM login used by the desktop and mobile caller.</p>
        </section>

        <section className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
          {roles.map(({ to, title, eyebrow, text, icon: Icon, tone, iconTone }, index) => (
            <Link key={to} to={to} className={`group relative min-h-[295px] overflow-hidden rounded-[1.6rem] border bg-gradient-to-br p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300/40 animate-fade-up ${tone}`} style={{ animationDelay: `${index * 90}ms` }}>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/50 blur-2xl transition group-hover:scale-150" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between"><div className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${iconTone}`}><Icon size={22}/></div><span className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-400 shadow-sm transition group-hover:translate-x-1 group-hover:text-violet-600"><ArrowRight size={17}/></span></div>
                <p className="mt-7 text-[11px] font-black uppercase tracking-[.16em] text-slate-400">{eyebrow}</p>
                <h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                <div className="mt-auto pt-5 text-xs font-black uppercase tracking-wider text-slate-700">Continue securely →</div>
              </div>
            </Link>
          ))}
        </section>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/75 px-5 py-4 text-center text-xs leading-5 text-slate-500 shadow-sm backdrop-blur sm:flex-row sm:text-left"><div><span className="font-black text-slate-700">Same credentials across CRM + mobile.</span> Your backend role is verified on every protected API request.</div><div className="inline-flex items-center gap-1.5 font-black text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/>Secure session</div></div>
      </div>
    </main>
  );
}
