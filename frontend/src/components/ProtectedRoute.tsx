import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { LoadingPanel } from './ui.tsx';
import type { UserRole } from '../types/api.ts';

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return <LoadingPanel message="Memeriksa sesi..." />;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}