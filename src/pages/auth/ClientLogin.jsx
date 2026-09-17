import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clientLogin, getGoogleStartUrl } from '../../services/clientPortal.js';
import { useClientAuthStore } from '../../store/clientAuthStore.js';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const setClientAuth = useClientAuthStore((s) => s.setClientAuth);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, client } = await clientLogin(email, password);
      setClientAuth(token, client);
      toast.success(`Welcome, ${client.name}`);
      navigate('/client');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      const url = await getGoogleStartUrl('client');
      window.location.href = url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login is not available');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="font-display text-3xl font-bold text-brand-900">Skill99</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-800">Client portal sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Access your project and payment updates.</p>
        <button
          type="button"
          onClick={onGoogle}
          disabled={googleLoading}
          className="mt-6 w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <Link to="/client/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Create account
          </Link>
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Staff login
          </Link>
        </div>
      </div>
    </div>
  );
}
