import React from 'react';
import SiteHeader from '../site-header/site-header';
import SiteFooter from '../site-footer/site-footer';
import { ErrorBoundary } from 'react-error-boundary';
import '../../../src/styles.scss';
import NotFound from '../../pages/404';
import RedirectModalRenderer from '../links/redirect-modal-renderer';

export const preProdEnvMsg = 'Loading metadata and data from endpoints in pre-production environment.';

const SiteLayout = ({ children, isPreProd }) => {
  let lowerEnvMsg;

  if (isPreProd) {
    lowerEnvMsg = preProdEnvMsg;
  }

  return (
    <div>
      <SiteHeader lowerEnvMsg={lowerEnvMsg} />
      <ErrorBoundary FallbackComponent={() => <NotFound fallback="true" />}>{children}</ErrorBoundary>
      <SiteFooter style={{}} />
      <RedirectModalRenderer />
    </div>
  );
};

export default SiteLayout;
