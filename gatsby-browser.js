import '@fortawesome/fontawesome-svg-core/styles.css';
// import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { createAsyncStoragePersister } from '@tanstack/query-as';

const isBrowser = () => typeof window !== 'undefined';

const persister = createAsyncStoragePersister({
  storage: isBrowser() && window.sessionStorage,
});

export const wrapRootElement = ({ element }) => {
  return element;
};
