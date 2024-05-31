import React from 'react';
import { siteUnavailable, unavailableWrapper } from './unavailable.module.scss';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageUnavailableText from '../../components/page-unavailable/page-unavailable-text';

const UnavailableContent = ({ fallback }) => {
  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Site Outage Page';

  return (
    <div className={siteUnavailable}>
      <PageHelmet data-testid="helmet" pageTitle={pageTitle} />
      <div data-testid="unavailableWrapper" className={unavailableWrapper}>
        <PageUnavailableText fallback={fallback} />
      </div>
    </div>
  );
};

const Unavailable = ({ pageContext, data, fallback }) => {
  return (
    <>
      {!fallback && (
        <SiteLayout>
          <UnavailableContent fallback={fallback} />
        </SiteLayout>
      )}
      {fallback && <UnavailableContent fallback={fallback} />}
    </>
  );
};

export default Unavailable;
