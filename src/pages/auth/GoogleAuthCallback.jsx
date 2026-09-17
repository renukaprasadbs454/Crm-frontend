import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore.js';
import { useClientAuthStore } from '../../store/clientAuthStore.js';
import { getMe } from '../../services/crm.js';
import { getClientMe } from '../../services/clientPortal.js';

function parseHash(hash) {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(raw);
}

export default function GoogleAuthCallback() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setClientAuth = useClientAuthStore((s) => s.setClientAuth);
  const clearClientAuth = useClientAuthStore((s) => s.clearClientAuth);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = parseHash(window.location.hash);
      const token = params.get('token');
      const type = params.get('type');
      if (!token || !type) {
        toast.error('Google login failed');
        navigate('/login', { replace: true });
        return;
      }

      try {
        if (type === 'client') {
          clearAuth();
          setClientAuth(token, { id: 'loading', name: 'Loading...', email: '' });
          const me = await getClientMe();
          if (cancelled) return;
          setClientAuth(token, me);
          toast.success(`Welcome, ${me.name}`);
          navigate('/client', { replace: true });
        } else {
          clearClientAuth();
          setAuth(token, { id: 'loading', role: 'SALES', name: 'Loading...' }, 'staff');
          const me = await getMe();
          if (cancelled) return;
          setAuth(token, me, 'staff');
          toast.success(`Welcome, ${me.name}`);
          navigate(me.role === 'PLATFORM_ADMIN' ? '/platform-admin' : '/app', { replace: true });
        }
      } catch (err) {
        clearAuth();
        clearClientAuth();
        toast.error(err.response?.data?.message || 'Google login failed');
        navigate('/login', { replace: true });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [clearAuth, clearClientAuth, navigate, setAuth, setClientAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <p className="text-sm text-slate-600">Completing Google sign in…</p>
    </div>
  );
}
