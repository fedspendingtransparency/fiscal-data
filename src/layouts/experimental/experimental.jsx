import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { fallback } from './experimental.module.scss';
import { ErrorBoundary } from 'react-error-boundary';
import TestingGuide from './testing-guide/testing-guide';

const fallbackComponent = () => {
  return <div className={fallback}>Something went wrong. Please refresh the page to try again.</div>;
};

/**
 * This page exists primarily for testing functionality that does not have a spot on the site at the time of development.
 * The content on this page should be regularly cleaned up.
 * @returns {*}
 * @constructor
 */
const ExperimentalPage = ({ pageContext }) => {
  const { config } = pageContext;

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <SiteLayout>
        <TestingGuide config={config} />
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
