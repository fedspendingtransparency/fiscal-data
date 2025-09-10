import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { fallback } from './experimental.module.scss';
import { ErrorBoundary } from 'react-error-boundary';
import { renderPDF } from '../../workers/pdfWorker';
// import pdfWorker from '../../workers/pdf.worker'
const fallbackComponent = () => {
  return <div className={fallback}>Something went wrong. Please refresh the page to try again.</div>;
};

/**
 * This page exists primarily for testing functionality that does not have a spot on the site at the time of development.
 * The content on this page should be regularly cleaned up.
 * @returns {*}
 * @constructor
 */
const ExperimentalPage = () => {
  const testfn = async () => {
    return renderPDF?.renderPDFInWorker();
  };
  testfn();

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <SiteLayout>
        <h2>PDF Generation POC</h2>
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
