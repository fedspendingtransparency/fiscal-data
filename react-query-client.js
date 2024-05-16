import { QueryClient } from '@tanstack/react-query';
import { basicFetch } from './src/utils/api-utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 600000, // 10 minutes, for persistent (browser session storage) caching
    },
  },
});

export const getDataFromCacheOrFetch = async (key, url, processFunction) => {
  try {
    const res = await queryClient.ensureQueryData({
      queryKey: [key, url],
      queryFn: () => basicFetch(url),
    });
    return processFunction(res);
  } catch (error) {
    console.log(error);
  }
};
