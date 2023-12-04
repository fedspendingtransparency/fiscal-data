import React from 'react';
import { bannerCalloutContainer, pageHeader, mainWidth, pageTitle } from './masthead.module.scss';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';
import BannerCallout from '../banner-callout/banner-callout';

const Masthead = ({ title, bannerCallout }) => {
  const breadCrumbLinks = [
    {
      name: title,
    },
    {
      name: 'Dataset Search',
      link: '/datasets/',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  return (
    <section className={pageHeader}>
      <div className={mainWidth}>
        <BreadCrumbs links={breadCrumbLinks} />
        <h1 className={pageTitle}>{title}</h1>
        {bannerCallout && (
          <div className={bannerCalloutContainer} data-testid="callout">
            <BannerCallout
              bannerCallout={bannerCallout}
              bannerType={bannerCallout.banner === 'SavingsBondsDelay' || bannerCallout.banner === 'TreasuryDirectDelay' ? 'warning' : 'info'}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Masthead;
