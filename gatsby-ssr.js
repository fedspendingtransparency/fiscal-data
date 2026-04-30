import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
import Persist from './src/components/persist/persist';

export const wrapRootElement = ({ element }) => {
  return <Persist element={element} />;
};
