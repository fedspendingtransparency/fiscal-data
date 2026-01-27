import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from './react-query-client';
import { CacheProvider } from '@emotion/react';
import { createCache } from '@emotion/cache';

const isBrowser = () => typeof window !== 'undefined';
const cache = createCache({ key: 'css', prepend: true });

const persister = createSyncStoragePersister({
  storage: isBrowser() && window.sessionStorage,
});

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={cache}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000 }}>
        <RecoilRoot>
          <Persist element={element} />
        </RecoilRoot>
      </PersistQueryClientProvider>
    </CacheProvider>
  );
};
