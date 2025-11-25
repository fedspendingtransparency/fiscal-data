import React from 'react';
import { siteNotFound, notFoundWrapper } from './notFound.module.scss';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import PageErrorText from '../../components/pageError/page-error-text';

const NotFoundContent = ({ fallback }) => {
  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Page Not Found';

  return (
    <div className={siteNotFound}>
      <PageHelmet data-testid="helmet" pageTitle={pageTitle} />
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
