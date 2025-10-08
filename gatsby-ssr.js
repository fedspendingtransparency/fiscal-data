import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
export const wrapRootElement = ({ element }) => {
  return (
    <RecoilRoot>
      <Persist element={element} />
    </RecoilRoot>
  );
};
