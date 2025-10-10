import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from './react-query-client';
import { ThemeProvider } from '@mui/material';
import { theme } from './src/theme';

const isBrowser = () => typeof window !== 'undefined';

const persister = createSyncStoragePersister({
  storage: isBrowser() && window.sessionStorage,
});

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider theme={theme}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000 }}>
        <RecoilRoot>
          <Persist element={element} />
        </RecoilRoot>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
};
