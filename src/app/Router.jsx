import { createBrowserRouter } from 'react-router';

import AppLayout from '../shared/ui/AppLayout';
import ProtectedRoute from '../shared/ui/ProtectedRoute';
import UnauthPage from '../pages/UnauthPage';
import LoginPage from '../pages/LoginPage';
import ManagerDashPage from '../pages/ManagerDashPage';
import ReceptionDashPage from '../pages/ReceptionDashPage';
import SchedulerPage from '../pages/SchedulerPage';
import CheckInsPage from '../pages/CheckInsPage';
import CheckOutsPage from '../pages/CheckOutsPage';
import GuestsPage from '../pages/GuestsPage';
import NewReservationPage from '../pages/NewReservationPage';
import ManagerMsgStaffPage from '../pages/ManagerMsgStaffPage';
import ManagerPricesPage from '../pages/ManagerPricesPage';
import ManagerBlockRoomsPage from '../pages/ManagerBlockRoomsPage';
import HouseKeepingDashPage from '../pages/HouseKeepingDashPage';
import RoleBasedRedirect from '../features/authentication/components/RoleBasedRedirect';

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoleBasedRedirect /> },
      {
        element: <ProtectedRoute allowedRoles={'receptionist'} />,
        children: [
          { path: 'reception', element: <ReceptionDashPage /> },
          { path: 'scheduler', element: <SchedulerPage /> },
          { path: 'checkins', element: <CheckInsPage /> },
          { path: 'checkouts', element: <CheckOutsPage /> },
          { path: 'guests', element: <GuestsPage /> },
          { path: 'new-reservation', element: <NewReservationPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={'manager'} />,
        children: [
          { path: 'management', element: <ManagerDashPage /> },
          { path: 'manage-prices', element: <ManagerPricesPage /> },
          { path: 'message-staff', element: <ManagerMsgStaffPage /> },
          { path: 'block-rooms', element: <ManagerBlockRoomsPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={'housekeeper'} />,
        children: [{ path: 'housekeeping', element: <HouseKeepingDashPage /> }],
      },
    ],
  },
  { path: 'login', element: <LoginPage /> },
  { path: 'unauthorized', element: <UnauthPage /> },
]);

export default router;
