import React from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageUnavailableText from '../../components/page-unavailable/page-unavilable-text';

const UnavailableContent = ({ fallback }) => {
  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Site Outage Page';

  return (
    <>
      <div>
        <PageHelmet data-testid="helmet" pageTitle={pageTitle} />
        <div data-testid="unavailableWrapper">
          <PageUnavailableText fallback={fallback} />
        </div>
      </div>
    </>
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
