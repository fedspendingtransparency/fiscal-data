import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';
import { RecoilRoot } from 'recoil';

export const wrapRootElement = ({ element }) => {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <Persist element={element} />
      </RecoilRoot>
    </React.StrictMode>
  );
};
