import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  UsersRound,
  LogOut,
  KanbanSquare,
  BarChart3,
  Briefcase,
  FolderKanban,
  RefreshCw,
  Wallet,
  MessageSquare,
  Calendar,
  CheckSquare,
  Settings,
  Building2,
  PhoneCall,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import clsx from 'clsx';
import BackButton from '../components/common/BackButton.jsx';
import { getMe } from '../services/crm.js';
import { checkoutSubscription, listPublicPlans, payForSignup } from '../services/company.js';

const linkClass = ({ isActive }) =>
  clsx(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  );

const ROLE_LABEL = {
  COMPANY_ADMIN: 'Company Admin',
  TL: 'Team Lead',
  SALES: 'Sales',
  SOLO: 'Solo',
};

/**
 * One shared workspace layout for every non-platform-admin role. The nav
 * is identical CRM-feature-wise for everyone (the backend already scopes
 * what each role actually sees/can touch) — the only role-specific
 * additions are the "Team" link for Company Owner/TL and Settings only
 * being editable for Company Owner/Solo (enforced server-side too).
 */
export default function WorkspaceLayout() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    getMe().then((profile) => setSubscription(profile.subscription)).catch(() => {});
    listPublicPlans().then(setPlans).catch(() => {});
  }, []);

  const expired = subscription && (['CANCELLED', 'EXPIRED', 'PAST_DUE'].includes(subscription.status) || new Date(subscription.currentPeriodEnd) <= new Date());
  async function subscribe(plan) {
    setPurchasing(true);
    try {
      const payment = await payForSignup(plan.tier, { name: user?.name, email: user?.email, contact: user?.phone });
      const updated = await checkoutSubscription({ planTier: plan.tier, ...payment });
      setSubscription(updated);
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || 'Could not activate subscription');
    } finally { setPurchasing(false); }
  }

  function logout() {
    clearAuth();
    navigate('/login');
  }

  const base = '/app';
  const showTeamManagement = ['COMPANY_ADMIN', 'TL'].includes(user?.role);
  const showCompanyDashboard = ['COMPANY_ADMIN'].includes(user?.role);
  const showTLDashboard = user?.role === 'TL';

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="max-h-screen overflow-y-auto border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <p className="font-display text-xl font-bold text-brand-900">Skill99 CRM</p>
          <p className="text-xs text-slate-500">{ROLE_LABEL[user?.role] || user?.role}</p>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to={base} end className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          {showCompanyDashboard && (
            <NavLink to={`${base}/company`} className={linkClass}>
              <Building2 size={18} /> Company Overview
            </NavLink>
          )}
          {showTLDashboard && (
            <NavLink to={`${base}/team`} className={linkClass}>
              <Building2 size={18} /> My Team
            </NavLink>
          )}
          <NavLink to={`${base}/leads`} className={linkClass}>
            <UsersRound size={18} /> Leads
          </NavLink>
          <NavLink to={`${base}/calls`} className={linkClass}>
            <PhoneCall size={18} /> Calls
          </NavLink>
          <NavLink to={`${base}/pipeline`} className={linkClass}>
            <KanbanSquare size={18} /> Pipeline
          </NavLink>
          <NavLink to={`${base}/clients`} className={linkClass}>
            <Briefcase size={18} /> Clients
          </NavLink>
          <NavLink to={`${base}/projects`} className={linkClass}>
            <FolderKanban size={18} /> Projects
          </NavLink>
          <NavLink to={`${base}/retainers`} className={linkClass}>
            <RefreshCw size={18} /> Retainers
          </NavLink>
          <NavLink to={`${base}/payments`} className={linkClass}>
            <Wallet size={18} /> Payments
          </NavLink>
          <NavLink to={`${base}/messages`} className={linkClass}>
            <MessageSquare size={18} /> Messages
          </NavLink>
          <NavLink to={`${base}/meetings`} className={linkClass}>
            <Calendar size={18} /> Meetings
          </NavLink>
          <NavLink to={`${base}/tasks`} className={linkClass}>
            <CheckSquare size={18} /> Tasks
          </NavLink>
          {['COMPANY_ADMIN', 'TL'].includes(user?.role) && (
            <NavLink to={`${base}/reports`} className={linkClass}>
              <BarChart3 size={18} /> Reports
            </NavLink>
          )}
          {showTeamManagement && (
            <NavLink to={`${base}/members`} className={linkClass}>
              <UsersRound size={18} /> Team Members
            </NavLink>
          )}
          <NavLink to={`${base}/settings`} className={linkClass}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="p-4 sm:p-6 lg:p-8">
        <BackButton fallback="/app" />
        <div className={`mb-6 flex flex-col gap-3 rounded-xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${expired ? 'border-rose-200 bg-rose-50 text-rose-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
          <div>
            <p className="font-bold">{expired ? 'Your subscription has expired' : subscription?.status === 'TRIALING' ? 'Your 7-day free trial is active' : 'Subscription status'}</p>
            <p className="mt-1 text-xs">{subscription?.currentPeriodEnd ? `Access through ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.` : 'Choose a subscription to keep CRM access active.'}</p>
          </div>
          <a href="/mobilecaller.apk" download className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">Download Android caller</a>
        </div>
        {expired ? (
          <section className="max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-brand-900">Choose a subscription plan</h1>
            <p className="mt-1 text-sm text-slate-500">Select a {user?.role === 'SOLO' ? 'Solo' : 'Company'} plan to restore CRM access.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{plans.filter((plan) => plan.workspaceType === (user?.role === 'SOLO' ? 'SOLO' : 'COMPANY')).map((plan) => <div key={plan.tier} className="rounded-xl border border-slate-200 p-4"><h2 className="font-bold text-slate-900">{plan.name}</h2><p className="mt-2 text-xl font-bold text-brand-600">₹{Number(plan.priceMonthly).toLocaleString()}<span className="text-xs text-slate-500">/month</span></p><button type="button" disabled={purchasing} onClick={() => subscribe(plan)} className="mt-4 w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{purchasing ? 'Processing…' : 'Subscribe'}</button></div>)}</div>
          </section>
        ) : <Outlet />}
      </main>
    </div>
  );
}
