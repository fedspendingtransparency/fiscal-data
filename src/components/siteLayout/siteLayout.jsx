import React from 'react';
import SiteHeader from '../site-header/site-header';
import SiteFooter from '../site-footer/site-footer';
import { ErrorBoundary } from 'react-error-boundary';
import NotFound from '../../pages/404/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { loadingIcon } from './site-layout.module.scss';

export const preProdEnvMsg = 'Loading metadata and data from endpoints in pre-production environment.';

const SiteLayout = ({ children, isPreProd, loading }) => {
  let lowerEnvMsg;

  if (isPreProd) {
    lowerEnvMsg = preProdEnvMsg;
  }

  return (
    <div>
      <SiteHeader lowerEnvMsg={lowerEnvMsg} />
      {loading && (
        <div className={loadingIcon}>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!loading && <ErrorBoundary FallbackComponent={() => <NotFound fallback="true" />}>{children}</ErrorBoundary>}
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
