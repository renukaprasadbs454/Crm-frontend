import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BriefcaseBusiness, CalendarDays, CheckCircle2,
  ChevronRight, CircleDollarSign, Headphones, Layers3, MessageSquareText,
  ShieldCheck, Sparkles, Target, UsersRound, Zap,
} from 'lucide-react';
import WebsiteChatWidget from '../../components/public/WebsiteChatWidget.jsx';

const features = [
  { icon: Target, title: 'Leads & Pipeline', text: 'Move prospects from first contact to won or lost with a clear sales pipeline.' },
  { icon: UsersRound, title: 'Client Management', text: 'Keep customer details, projects, communication and history together.' },
  { icon: BriefcaseBusiness, title: 'Projects & Tasks', text: 'Create projects, assign work and track progress across your team.' },
  { icon: MessageSquareText, title: 'Communication', text: 'Keep client and team conversations connected to your CRM workflow.' },
  { icon: CircleDollarSign, title: 'Payments & Expenses', text: 'Track received payments, pending amounts, revenue and expenses.' },
  { icon: BarChart3, title: 'Reports & Insights', text: 'Give managers a fast view of business performance and activity.' },
];

const roles = [
  { title: 'Company / Admin', text: 'Full control over clients, staff, projects, finance and reports.', tone: 'from-violet-600 to-indigo-600' },
  { title: 'Staff / Team', text: 'Work on assigned projects, tasks, meetings and client communication.', tone: 'from-emerald-500 to-teal-600' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <section className="relative isolate bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,.15),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(14,165,233,.12),transparent_28%),linear-gradient(180deg,#fbfaff_0%,#fff_72%)]">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[linear-gradient(to_right,rgba(99,102,241,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,.06)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Skill99 CRM home">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"><Sparkles size={21} /></div>
            <div><div className="text-xl font-black tracking-tight">Skill99 <span className="text-violet-600">CRM</span></div><div className="text-[10px] font-bold uppercase tracking-[.22em] text-slate-400">Customer Relationship Management</div></div>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="hover:text-violet-600">Features</a>
            <a href="#how-it-works" className="hover:text-violet-600">How it works</a>
            <a href="#roles" className="hover:text-violet-600">Access</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-violet-300 hover:text-violet-700">Login</Link>
            <Link to="/signup" className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 hover:bg-violet-700 sm:inline-flex">Register</Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-[.95fr_1.05fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm"><Zap size={14} /> One platform for the complete client journey</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.03] tracking-[-.045em] text-slate-950 sm:text-6xl">Build stronger relationships.<span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">Drive real growth.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Skill99 CRM helps your business manage leads, clients, projects, tasks, communication, meetings, payments and reports — all from one secure workspace.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5">Explore the CRM <ArrowRight size={17} /></Link>
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 shadow-sm hover:border-violet-300">Create your workspace <ChevronRight size={17} /></Link>
            </div>
            <div className="mt-9 grid max-w-lg grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="px-3 text-center"><p className="text-2xl font-black text-slate-950">360°</p><p className="mt-1 text-xs font-semibold text-slate-500">Client visibility</p></div>
              <div className="px-3 text-center"><p className="text-2xl font-black text-slate-950">3</p><p className="mt-1 text-xs font-semibold text-slate-500">User experiences</p></div>
              <div className="px-3 text-center"><p className="text-2xl font-black text-slate-950">1</p><p className="mt-1 text-xs font-semibold text-slate-500">Connected workspace</p></div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-violet-200/50 via-indigo-100/50 to-sky-100/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-indigo-200/60">
              <div className="rounded-[1.35rem] bg-slate-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white"><Sparkles size={15} /></div><span className="font-black">Skill99 CRM</span></div><div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">Live workspace</div></div>
                <div className="grid grid-cols-[118px_1fr] gap-3">
                  <aside className="hidden rounded-xl bg-slate-950 p-3 text-white sm:block"><p className="mb-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>{['Dashboard','Pipeline','Clients','Projects','Tasks','Meetings','Messages','Payments','Reports'].map((item, i) => <div key={item} className={`mb-1 rounded-lg px-2.5 py-2 text-[10px] font-semibold ${i === 0 ? 'bg-violet-600' : 'text-slate-300'}`}>{item}</div>)}</aside>
                  <div>
                    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                      {[['Clients','120','+12%'],['Projects','35','+8%'],['Revenue','₹2.45L','+15%'],['Pending','₹72.5K','-5%']].map(([label, value, change]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-lg font-black text-slate-950">{value}</p><p className="text-[9px] font-bold text-emerald-600">{change} this month</p></div>)}
                    </div>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs font-black">Pipeline overview</p><span className="text-[9px] font-bold text-violet-600">View pipeline</span></div><div className="mt-6 flex h-32 items-end gap-3">{[72,55,82,48,35,22].map((h, i) => <div key={i} className="flex-1"><div className="rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-400" style={{ height: `${h}%` }} /><p className="mt-1 text-center text-[8px] text-slate-400">{['New','Contact','Qualify','Demo','Negotiate','Won'][i]}</p></div>)}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-black">Recent activity</p><div className="mt-4 space-y-3">{['New client added','Payment received ₹25,000','Project moved to In Progress','Meeting scheduled'].map((x, i) => <div key={x} className="flex items-center gap-2.5"><div className={`h-2 w-2 rounded-full ${i % 2 ? 'bg-emerald-500' : 'bg-violet-500'}`} /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-bold text-slate-700">{x}</p><p className="text-[8px] text-slate-400">{i + 1} hour ago</p></div></div>)}</div></div>
                    </div>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs font-black">Upcoming meetings</p><CalendarDays size={15} className="text-violet-600" /></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-lg bg-violet-50 p-2.5"><p className="text-[9px] font-black text-violet-800">ABC Solutions</p><p className="text-[9px] text-violet-600">Today · 11:00 AM</p></div><div className="rounded-lg bg-sky-50 p-2.5"><p className="text-[9px] font-black text-sky-800">Project review</p><p className="text-[9px] text-sky-600">Tomorrow · 2:00 PM</p></div></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-violet-600">Everything connected</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">From first lead to completed project.</h2><p className="mt-4 text-slate-600">A CRM should make the customer journey easier to manage. Skill99 brings the important pieces into one workflow.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white"><Icon size={20} /></div><h3 className="mt-5 font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></section>

      <section id="how-it-works" className="bg-slate-950 py-20 text-white"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-violet-300">How it works</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">One customer journey. One source of truth.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-5">{['Lead','Client','Project','Work','Payment & Report'].map((step, i) => <div key={step} className="relative rounded-2xl border border-white/10 bg-white/5 p-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-sm font-black">{i + 1}</div><p className="mt-4 font-black">{step}</p><p className="mt-2 text-xs leading-5 text-slate-400">{['Capture and qualify the opportunity.','Keep customer details and history together.','Turn the relationship into trackable work.','Assign tasks and collaborate with the team.','Track money and measure performance.'][i]}</p>{i < 4 && <ArrowRight className="absolute -right-3 top-1/2 hidden text-violet-300 md:block" size={18} />}</div>)}</div></div></section>

      <section id="roles" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-violet-600">Role-based access</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">The right experience for every user.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{roles.map(({ title, text, tone }) => <div key={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className={`h-2 bg-gradient-to-r ${tone}`} /><div className="p-7"><div className="flex items-center justify-between"><h3 className="font-black text-slate-950">{title}</h3><ShieldCheck className="text-slate-300" size={22} /></div><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p><div className="mt-5 space-y-2 text-sm text-slate-600">{['Secure authentication','Role-specific permissions','Real CRM data'].map((x) => <div key={x} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" />{x}</div>)}</div></div></div>)}</div></section>

      <section className="px-5 pb-20 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-slate-950 p-8 text-white shadow-2xl shadow-indigo-200 sm:p-12"><div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="text-sm font-bold text-violet-200">Ready to see the workspace?</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Turn client management into a clear process.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">Explore the secure login options or create a workspace and start managing the complete client journey.</p></div><Link to="/login" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg">Enter Skill99 CRM <ArrowRight size={17} /></Link></div></div></section>

      <WebsiteChatWidget />

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="font-bold text-slate-700">Skill99 CRM</div><div>Secure client relationship management for modern teams.</div><div className="flex gap-4"><Link to="/login" className="hover:text-violet-600">Login</Link><Link to="/signup" className="hover:text-violet-600">Register</Link></div></div></footer>
    </main>
  );
}
