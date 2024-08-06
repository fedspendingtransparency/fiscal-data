import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import PersistScrollPosition from './src/components/persist-scroll-position/persist-scroll-position';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from './react-query-client';

const isBrowser = () => typeof window !== 'undefined';

const persister = createSyncStoragePersister({
  storage: isBrowser() && window.sessionStorage,
});

export const wrapRootElement = ({ element }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000 }}>
      <RecoilRoot>
        <PersistScrollPosition element={element}>
          <Persist element={element} />
        </PersistScrollPosition>
      </RecoilRoot>
    </PersistQueryClientProvider>
  );
};
