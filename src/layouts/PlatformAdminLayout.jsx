import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, LogOut, CreditCard, UserRound, ReceiptText } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import clsx from 'clsx';
import BackButton from '../components/common/BackButton.jsx';

const linkClass = ({ isActive }) =>
  clsx(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  );

/**
 * Deliberately its own layout/nav, entirely separate from WorkspaceLayout.
 * Platform Admin only sees tenant metadata, subscription and billing metadata,
 * never CRM records. See company.service.js for the backend enforcement.
 */
export default function PlatformAdminLayout() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  function logout() {
    clearAuth();
    navigate('/super-admin/login');
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="max-h-screen overflow-y-auto border-b border-slate-200 bg-white p-4 text-slate-900 lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <p className="font-display text-xl font-bold text-brand-900">Skill99 CRM</p>
          <p className="text-xs text-slate-500">Platform Admin</p>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/platform-admin" end className={linkClass}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/platform-admin/companies" className={linkClass}>
            <Building2 size={18} /> Companies
          </NavLink>
          <NavLink to="/platform-admin/plans" className={linkClass}>
            <CreditCard size={18} /> Plans
          </NavLink>
          <NavLink to="/platform-admin/freelancers" className={linkClass}>
            <UserRound size={18} /> Freelancers
          </NavLink>
          <NavLink to="/platform-admin/payment-details" className={linkClass}>
            <ReceiptText size={18} /> Payment Details
          </NavLink>
        </nav>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
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
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
        <BackButton fallback="/platform-admin" />
        <Outlet />
      </main>
    </div>
  );
}
