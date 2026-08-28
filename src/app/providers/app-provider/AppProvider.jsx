import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ThemeProvider from '../theme-provider/ThemeProvider';
import UserProvider from '../user-provider/UserProvider';
import { SchedulerProvider } from '../scheduler-provider/SchedulerProvider';

const queryClient = new QueryClient();

export default function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SchedulerProvider>
          <UserProvider>{children}</UserProvider>
        </SchedulerProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
