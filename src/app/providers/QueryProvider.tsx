import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

// Refetch when app comes to foreground
const onAppStateChange = (status: AppStateStatus) => {
  focusManager.setFocused(status === 'active');
};

export const QueryProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { queryClient };
