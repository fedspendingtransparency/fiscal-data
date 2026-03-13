import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './react-query-client';

/** @type {import('@tanstack/react-query-persist-client').Persister} */
const noopPersister = {
  persistClient: async () => {},
  restoreClient: async () => undefined,
  removeClient: async () => {},
};

export const wrapRootElement = ({ element }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: noopPersister, maxAge: 600000 }}>
      <RecoilRoot>
        <Persist element={element} />
      </RecoilRoot>
    </PersistQueryClientProvider>
  );
};
