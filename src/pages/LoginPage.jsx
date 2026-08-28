import { useLogin } from '../features/authentication/hooks/useLogin';
import Button from '../shared/ui/Button';
import Logo from '../shared/ui/Logo';

export default function LoginPage() {
  const { login, isPending } = useLogin();

  function handleClick(email, password) {
    if (!email || !password) return;

    login({ email, password });
  }
  return (
    <main className="bg-bg text-txt font-txt flex h-dvh flex-col items-center justify-start pt-[10%]">
      <Logo />
      <h1 className="text-md mt-5 mb-2 font-bold">LOG IN AS</h1>
      <div className="flex flex-row gap-2">
        <Button
          onClick={() =>
            handleClick(
              import.meta.env.VITE_MANAGER_EMAIL,
              import.meta.env.VITE_MANAGER_PASS,
            )
          }
          color="blue"
          disabled={isPending}
        >
          Manager
        </Button>
        <Button
          onClick={() =>
            handleClick(
              import.meta.env.VITE_RECEPTION_EMAIL,
              import.meta.env.VITE_RECEPTION_PASS,
            )
          }
          color="blue"
          disabled={isPending}
        >
          Receptionist
        </Button>
        <Button
          onClick={() =>
            handleClick(
              import.meta.env.VITE_HOUSEKEEPING_EMAIL,
              import.meta.env.VITE_HOUSEKEEPING_PASS,
            )
          }
          color="blue"
          disabled={isPending}
        >
          HouseKeeper
        </Button>
      </div>
    </main>
  );
}
