import React from "react";
import SiteHeader from "../site-header/site-header";
import SiteFooter from "../site-footer/site-footer";
import { ErrorBoundary } from "react-error-boundary";
import PageErrorText from '../../components/pageError/page-error-text';

export const preProdEnvMsg =
  'Loading metadata and data from endpoints in pre-production environment.';

const SiteLayout = ({ children, isPreProd, glossaryEvent, glossaryClickEventHandler }) => {
  let lowerEnvMsg;

  if (isPreProd) {
    lowerEnvMsg = preProdEnvMsg;
  }

  return (
    <div>
      <SiteHeader lowerEnvMsg={lowerEnvMsg} glossaryEvent={glossaryEvent} glossaryClickEventHandler={glossaryClickEventHandler} />
      <ErrorBoundary FallbackComponent={() => <PageErrorText fallback='true' />}>
        {children}
      </ErrorBoundary>
      <SiteFooter />
    </div>
  )
};

export default SiteLayout;
