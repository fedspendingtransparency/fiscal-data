import React from 'react';
import * as styles from './masthead.module.scss';
import DetailPills from '../detail-pills/detail-pills';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';
import BannerCallout from '../banner-callout/banner-callout';

const Masthead = ({title, tagLine, techSpecs, dictionary, bannerCallout}) => {
  const breadCrumbLinks = [
    {
      name: title
    },
    {
      name: 'Dataset Search',
      link: '/datasets/'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  return (
    <section className={styles.pageHeader}>
      <div className={styles.mainWidth}>
        <BreadCrumbs links={breadCrumbLinks} />
        <h1 className={styles.pageTitle}>{title}</h1>
        <DetailPills techSpecs={techSpecs} dictionary={dictionary} />
        <p className={styles.tagLine} data-test-id="tagLine">{tagLine}</p>
        {bannerCallout &&
        <div data-testid="callout">
          <BannerCallout bannerCallout={bannerCallout} />
        </div>
      }
      </div>
    </section>
  )
};

export default Masthead;
