import React from 'react';
import * as styles from './masthead.module.scss';
import DetailPills from '../detail-pills/detail-pills';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';

const Masthead = ({title, tagLine, techSpecs, dictionary}) => {
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
        <p className={styles.tagLine} data-test-id='tagLine'>{tagLine}</p>
      </div>
    </section>
  )
};

export default Masthead;
