import { Navigate, Outlet } from 'react-router-dom';
import { useClientAuthStore } from '../../store/clientAuthStore.js';

export default function ClientProtectedRoute() {
  const token = useClientAuthStore((s) => s.token);
  const client = useClientAuthStore((s) => s.client);

  if (!token || !client) return <Navigate to="/client/login" replace />;
  return <Outlet />;
}
