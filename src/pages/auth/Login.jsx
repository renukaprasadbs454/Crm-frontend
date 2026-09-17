import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ShieldCheck, UserRound } from 'lucide-react';

const cards = [
  { to: '/organisation', title: 'Organisation', text: 'Company Admin, Team Lead and Sales Rep accounts share the same secure CRM identity.', icon: Building2, tone: 'from-violet-50 to-white border-violet-200', accent: 'text-violet-700', badge: 'CRM workspace' },
  { to: '/solo/login', title: 'Freelancer / One Person Company', text: 'A private workspace for independent professionals who want the same CRM workflow.', icon: UserRound, tone: 'from-emerald-50 to-white border-emerald-200', accent: 'text-emerald-700', badge: 'Independent workspace' },
];

export default function Login() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,.12),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,.10),transparent_30%),linear-gradient(#f8fafc,#eef4fb)] px-5 py-7 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 px-1"><Link to="/" className="font-black tracking-tight text-2xl text-slate-950">Skill99 <span className="text-violet-600">CRM</span></Link><Link to="/signup" className="text-sm font-bold text-violet-600 transition hover:text-violet-800">Don't have an account?</Link></div>
        <section className="mx-auto mt-12 max-w-3xl text-center animate-fade-up"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.25rem] bg-slate-950 text-white shadow-xl"><ShieldCheck size={26}/></div><div className="mt-6 inline-flex rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[11px] font-black uppercase tracking-[.18em] text-slate-500 shadow-sm">Secure access</div><h1 className="mt-5 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Sign in to Skill99 CRM</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Choose the workspace that matches your account. Desktop CRM and Mobile Caller use the same credentials and backend role.</p></section>
        <section className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {cards.map(({ to, title, text, icon: Icon, tone, accent, badge }, index) => <Link key={to} to={to} className={`group relative min-h-[275px] overflow-hidden rounded-[1.6rem] border bg-gradient-to-br p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-up ${tone}`} style={{ animationDelay: `${index * 90}ms` }}><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/70 blur-2xl transition group-hover:scale-150"/><div className="relative flex h-full flex-col"><div className="flex items-start justify-between gap-3"><div className={`grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm ${accent}`}><Icon size={25}/></div><span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{badge}</span></div><h2 className="mt-8 text-xl font-black text-slate-950">{title}</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{text}</p><div className="mt-auto flex items-center gap-2 pt-6 text-sm font-black text-slate-800">Continue securely <ArrowRight size={16} className="transition group-hover:translate-x-1"/></div></div></Link>)}
        </section>
        <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-2 text-sm text-slate-400 animate-fade-up" style={{ animationDelay: '180ms' }}>Need platform access? <Link to="/super-admin/login" className="font-black text-violet-600 underline decoration-violet-200 underline-offset-4 transition hover:text-violet-800">Platform Admin</Link></div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-5 text-slate-400">Roles are enforced by the backend on every request. Changing a role in the browser cannot grant additional permissions.</p>
      </div>
    </main>
  );
}
