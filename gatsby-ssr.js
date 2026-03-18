import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import { renderToString } from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createCache from '@emotion/cache';
import Persist from './src/components/persist/persist';
import { theme } from './src/theme';
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
    <ThemeProvider theme={theme}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: noopPersister, maxAge: 600000 }}>
        <RecoilRoot>
          <Persist element={element} />
        </RecoilRoot>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
};

export const replaceRenderer = ({ bodyComponent, setHeadComponents, replaceBodyHTMLString }) => {
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const emotionStyles = extractCriticalToChunks(renderToString(<CacheProvider value={cache}>{bodyComponent}</CacheProvider>));

  setHeadComponents(
    emotionStyles.styles
      .filter(style => style.css.length > 0)
      .map(style => <style data-emotion={`${style.key} ${style.ids.join(' ')}`} key={style.key} dangerouslySetInnerHTML={{ __html: style.css }} />)
  );

  replaceBodyHTMLString(emotionStyles.html);
};
