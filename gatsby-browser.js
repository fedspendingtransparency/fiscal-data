import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const isBrowser = () => typeof window !== 'undefined';

const persister = createAsyncStoragePersister({
  storage: isBrowser() ? window.sessionStorage : undefined,
  throttleTime: 1000,
});

export const wrapRootElement = ({ element }) => {
  return <Persist element={element} />;
};
