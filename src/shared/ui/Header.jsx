import { NavLink } from 'react-router';

import { useUserSession } from '../../app/providers/user-provider/useUserSession';

import Logo from './Logo';
import ThemeIcon from './ThemeIcon';
import Logout from './Logout';
import UserAvatar from './UserAvatar';
import Button from './Button';
import { useResetDatabase } from '../hooks/useResetDatabase';
import Spinner from './Spinner';

const NavLinkStyle = ({ isActive }) =>
  `block rounded px-4 py-2 duration-300 ease-in  ${isActive ? 'bg-bg3' : 'hover:bg-bg3'}`;
const liStyle = 'flex-1 border-l border-(--color-border2)';

const RECEPTION_NAVLINKS = (
  <ul className="flex flex-row">
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="reception">
        Dashboard
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="scheduler">
        Scheduler
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="checkins">
        Check-ins
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="checkouts">
        Check-outs
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="guests">
        Guests
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="new-reservation">
        New reservation
      </NavLink>
    </li>
  </ul>
);

const MANAGER_NAVLINKS = (
  <ul className="flex flex-row">
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="management">
        Dashboard
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="message-staff">
        Message Staff
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="block-rooms">
        Block Rooms
      </NavLink>
    </li>
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="manage-prices">
        Prices
      </NavLink>
    </li>
  </ul>
);

const HOUSEKEEPER_NAVLINKS = (
  <ul className="flex flex-row">
    <li className={liStyle}>
      <NavLink className={NavLinkStyle} to="housekeeping">
        Dashboard
      </NavLink>
    </li>
  </ul>
);

export default function Header() {
  const { isPending: isPendingReset, handleResetAndSeed } = useResetDatabase();

  const { userProfile } = useUserSession();
  return (
    <header className="flex w-full flex-col items-center gap-2 px-2 pt-2 pb-1">
      <div className="relative flex w-full flex-row items-center justify-start pl-5 md:justify-center md:pl-0">
        <Logo size={'big'} />
      </div>
      <div className="absolute top-4 left-5 hidden h-10 w-35 flex-row items-center justify-center md:block">
        {isPendingReset ? (
          <div>
            <Spinner size="10px" />
            <span className="ml-3 text-xs">Reseting...</span>
          </div>
        ) : (
          <Button
            color="yellow"
            disabled={isPendingReset}
            onClick={handleResetAndSeed}
          >
            Reset Database
          </Button>
        )}
      </div>
      <div className="absolute top-4 right-5 flex flex-row items-center justify-center gap-3 px-2">
        <UserAvatar />
        <ThemeIcon />
        <Logout />
      </div>
      <nav className="w-full text-base font-light">
        {['manager', 'admin'].includes(userProfile?.role) && MANAGER_NAVLINKS}
        {['receptionist', 'admin'].includes(userProfile?.role) &&
          RECEPTION_NAVLINKS}
        {['housekeeper', 'admin'].includes(userProfile?.role) &&
          HOUSEKEEPER_NAVLINKS}
      </nav>
    </header>
  );
}
