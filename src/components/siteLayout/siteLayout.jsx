import React from 'react';
import SiteHeader from '../site-header/site-header';
import SiteFooter from '../site-footer/site-footer';
import { ErrorBoundary } from 'react-error-boundary';
import '../../../src/styles.scss';
import Unavailable from '../../pages/unavailable';

export const preProdEnvMsg = 'Loading metadata and data from endpoints in pre-production environment.';

const SiteLayout = ({ children, isPreProd }) => {
  let lowerEnvMsg;

  if (isPreProd) {
    lowerEnvMsg = preProdEnvMsg;
  }

  return (
    <div>
      <SiteHeader lowerEnvMsg={lowerEnvMsg} />
      <ErrorBoundary FallbackComponent={() => <Unavailable fallback="true" />}>{children}</ErrorBoundary>
      <SiteFooter style={{}} />
    </div>
  );
};

export default SiteLayout;
