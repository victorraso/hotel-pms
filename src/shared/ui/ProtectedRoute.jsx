import { Navigate, Outlet } from 'react-router';

import { useUserSession } from '../../app/providers/user-provider/useUserSession';

import Spinner from './Spinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userProfile, isLoading } = useUserSession();

  if (isLoading) {
    return <Spinner fullScreen={true} />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userProfile?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ?? <Outlet />;
}
