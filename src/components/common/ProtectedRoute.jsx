import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const WORKSPACE_ROLES = ['COMPANY_ADMIN', 'TL', 'SALES', 'SOLO'];

export function homeFor(role) {
  if (role === 'PLATFORM_ADMIN') return '/platform-admin';
  if (WORKSPACE_ROLES.includes(role)) return '/app';
  return '/login';
}

/**
 * `roles` restricts this route tree to a subset of roles (e.g.
 * ['PLATFORM_ADMIN'] for the platform-admin tree). Omit `roles` to allow
 * any authenticated staff user through — used for the shared /app tree,
 * where the backend does the actual per-role data scoping.
 */
export default function ProtectedRoute({ roles }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const accountType = useAuthStore((s) => s.accountType);

  if (!token || !user || accountType !== 'staff') return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }

  return <Outlet />;
}
