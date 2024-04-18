import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 600000, // 10 minutes, for persistent (browser session storage) caching
    },
  },
});
