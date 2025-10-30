import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { fallback } from './experimental.module.scss';
import { ErrorBoundary } from 'react-error-boundary';

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
  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <SiteLayout></SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
