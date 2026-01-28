import React from 'react';
import { notFoundWrapper, siteNotFound } from './notFound.module.scss';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import PageErrorText from '../../components/pageError/page-error-text';

const NotFoundContent = ({ fallback }) => {
  return (
    <div className={siteNotFound}>
      <div data-testid="notFoundWrapper" className={notFoundWrapper}>
        <PageErrorText fallback={fallback} />
      </div>
    </div>
  );
};

const NotFound = ({ pageContext, data, fallback }) => {
  return (
    <>
      {!fallback && (
        <SiteLayout>
          <NotFoundContent fallback={fallback} />
        </SiteLayout>
      )}
      {fallback && <NotFoundContent fallback={fallback} />}
    </>
  );
};

export default NotFound;

export const Head = ({ fallback }) => {
  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Page Not Found';
  return <PageHelmet pageTitle={pageTitle} />;
};
