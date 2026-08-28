import { Outlet } from 'react-router';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="bg-bg text-txt font-txt mx-auto block h-dvh text-sm font-normal">
      <Header />
      <main className="bg-bg">
        <Outlet />
      </main>
    </div>
  );
}
