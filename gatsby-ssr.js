import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { queryClient } from './react-query-client';
import { CasheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
const cache = createCache({ key: 'css', prepend: true });
export const wrapRootElement = ({ element }) => {
  return (
    <CasheProvider client={queryClient}>
      <RecoilRoot>
        <Persist element={element} />
      </RecoilRoot>
    </CasheProvider>
  );
};

export const onRenderBody = ({ setHeadComponents }) => {
  const { extraCriticalToChunks } = createEmotionServer(cache);
};
