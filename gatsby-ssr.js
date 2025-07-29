import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import {ThemeProvider} from '@mui/material';
import { ServerStyleSheets, StylesProvider } from '@mui/styles';
import { theme} from './src/theme';
import { createCache } from '@emotion/cache';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const sheets = new ServerStyleSheets();
export const wrapRootElement = ({ element }) =>
  sheets.collect(
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme} >
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <RecoilRoot>
              <Persist element={element} />
            </RecoilRoot>
        </LocalizationProvider>
      </ThemeProvider>
    </StylesProvider>
);

  export const OnRenderBody = ({ setHeadComponents }) => {
    setHeadComponents([
      <style key="jss-server-side" id="jss-server-side" dangerouslySetInnerHTML={{ __html: sheets.toString()}} />
    ]);
    sheets.reset();
};
