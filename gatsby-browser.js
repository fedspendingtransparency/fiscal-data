import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { queryClient } from './react-query-client';
import { QueryClientProvider } from '@tanstack/react-query';

// const isBrowser = () => typeof window !== 'undefined';

// const persister = createSyncStoragePersister({
//   storage: isBrowser() && window.sessionStorage,
// });

export const wrapRootElement = ({ element }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Persist element={element} />
      </RecoilRoot>
    </QueryClientProvider>
  );
};
