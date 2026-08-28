import { NavLink } from 'react-router';

export default function UnauthPage() {
  return (
    <div className="bg-bg text-txt flex h-dvh flex-col items-center justify-center">
      <span>unauthorized access</span>
      <NavLink to="/login" className="text-blue-400">
        Back to login
      </NavLink>
    </div>
  );
}
