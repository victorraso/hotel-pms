import { Navigate } from 'react-router';

import { useUserSession } from '../../../app/providers/user-provider/useUserSession';
import Spinner from '../../../shared/ui/Spinner';

export default function RoleBasedRedirect() {
  const { userProfile, isLoading } = useUserSession();

  if (isLoading) return <Spinner fullScreen={true} />;

  if (userProfile?.role === 'receptionist') {
    return <Navigate to="/reception" replace />;
  }

  if (userProfile?.role === 'manager') {
    return <Navigate to="/management" replace />;
  }

  if (userProfile?.role === 'housekeeper') {
    return <Navigate to="/housekeeping" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}
