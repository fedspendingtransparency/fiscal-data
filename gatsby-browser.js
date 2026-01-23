import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryClient } from './react-query-client';

const isBrowser = () => typeof window !== 'undefined';

const persister = createAsyncStoragePersister({
  storage: isBrowser() ? window.sessionStorage : undefined,
  throttleTime: 1000,
});

export const wrapRootElement = ({ element }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000, buster: '' }}>
      <RecoilRoot>
        <Persist element={element} />
      </RecoilRoot>
    </PersistQueryClientProvider>
  );
};
