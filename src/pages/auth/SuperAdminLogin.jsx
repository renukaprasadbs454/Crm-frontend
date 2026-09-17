import { useState } from 'react';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginWithPassword } from '../../services/company.js';
import { useAuthStore } from '../../store/authStore.js';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      clearAuth();
      const result = await loginWithPassword({ identifier: email.trim(), password, role: 'PLATFORM_ADMIN' });
      setAuth(result.token, result.user, 'staff');
      toast.success('Platform Admin access granted');
      navigate('/platform-admin', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to sign in');
    } finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,.14),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(16,185,129,.12),transparent_30%),#f4f8fb] p-5 text-slate-900">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-sky-700"><ArrowLeft size={16} /> Back to Skill99</Link>
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/40 sm:p-10">
          <div className="flex items-center justify-between"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm"><ShieldCheck size={27} /></div><LockKeyhole className="text-slate-300" size={22} /></div>
          <p className="mt-8 text-xs font-black uppercase tracking-[.24em] text-sky-700">Skill99 control room</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Super Admin</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Manage workspaces, plans, trials, and platform access from one secure console.</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Admin email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@skill99.com" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" /></label>
            <label className="block text-sm font-semibold text-slate-700">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" /></label>
            <button disabled={loading} className="w-full rounded-xl bg-sky-600 py-3.5 font-black text-white transition hover:bg-sky-700 disabled:opacity-60">{loading ? 'Authenticating…' : 'Enter control room'}</button>
            <Link to="/forgot-password?role=PLATFORM_ADMIN" className="block text-center text-sm font-bold text-sky-700 hover:text-sky-800">Forgot password?</Link>
          </form>
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">Restricted platform access</p>
      </div>
    </main>
  );
}
