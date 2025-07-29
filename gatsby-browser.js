import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from './react-query-client';
import {ThemeProvider, CssBaseline} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { StylesProvider } from '@mui/styles';
import { theme} from './src/theme';
import { createCache } from '@emotion/cache';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const muiCache = createCache({ key: 'css', prepend: true});

const persister = typeof window !== 'undefined' ? createSyncStoragePersister({ storage: window.sessionStorage}) : undefined;
// const isBrowser = () => typeof window !== 'undefined';

// const persister = createSyncStoragePersister({
//   storage: isBrowser() && window.sessionStorage,
// });

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={muiCache} >
      <StylesProvider injectFirst >
        <ThemeProvider theme={theme} >
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns} >
            <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister, maxAge: 600000 }}>
              <RecoilRoot>
                <Persist element={element} />
              </RecoilRoot>
            </PersistQueryClientProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StylesProvider>

    </CacheProvider>

  );
};
