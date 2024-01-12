import React, { useEffect, useState } from 'react';
import { bannerCalloutContainer, pageHeader, mainWidth, pageTitle, stickyHeader, stickyMainWidth } from './masthead.module.scss';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';
import BannerCallout from '../banner-callout/banner-callout';

const Masthead = ({ title, bannerCallout }) => {
  const [stickyView, setStickyView] = useState(false);

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

  const handleScroll = () => {
    const position = window.pageYOffset;
    setStickyView(position > 120);
    console.log(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={pageHeader}>
      <div className={`${mainWidth} ${stickyView ? stickyMainWidth : undefined}`}>
        <BreadCrumbs links={breadCrumbLinks} />
        <h1 className={`${pageTitle} ${stickyView ? stickyHeader : undefined}`}>{title}</h1>
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
