import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useClientAuthStore } from '../store/clientAuthStore.js';
import BackButton from '../components/common/BackButton.jsx';

const linkClass = ({ isActive }) =>
  clsx(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  );

export default function ClientLayout() {
  const client = useClientAuthStore((s) => s.client);
  const clear = useClientAuthStore((s) => s.clearClientAuth);
  const navigate = useNavigate();

  function logout() {
    clear();
    navigate('/client/login');
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="mb-8">
          <p className="font-display text-xl font-bold text-brand-900">Skill99 Portal</p>
          <p className="text-xs text-slate-500">Client</p>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/client" end className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </nav>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-medium">{client?.name}</p>
          <p className="truncate text-xs text-slate-500">{client?.email}</p>
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
        <BackButton fallback="/client" />
        <Outlet />
      </main>
    </div>
  );
}
