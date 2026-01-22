import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const isBrowser = () => typeof window !== 'undefined';

const persister = createAsyncStoragePersister({
  storage: isBrowser() && window.sessionStorage,
});

export const wrapRootElement = ({ element }) => {
  return (
    // <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000 }}>
    <RecoilRoot>
      <Persist element={element} />
    </RecoilRoot>
    // </PersistQueryClientProvider>
  );
};
