import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createCache from '@emotion/cache';
import Persist from './src/components/persist/persist';
import { theme } from './src/theme';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './react-query-client';

const emotionCache = createCache({ key: 'css' });
emotionCache.compat = true;

/** @type {import('@tanstack/react-query-persist-client').Persister} */
const persister = {
  persistClient: throttledClient => {
    window.sessionStorage.setItem('REACT_QUERY_OFFLINE_CACHE', JSON.stringify(throttledClient));
  },
  restoreClient: () => {
    const cache = window.sessionStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
    return cache ? JSON.parse(cache) : undefined;
  },
  removeClient: () => {
    window.sessionStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
  },
};

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 600000 }}>
          <RecoilRoot>
            <Persist element={element} />
          </RecoilRoot>
        </PersistQueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
