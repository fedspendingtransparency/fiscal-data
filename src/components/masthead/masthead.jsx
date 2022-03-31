import React, {useState} from 'react';
import configStore from "../../layouts/dataset-detail/redux/config/config";
import * as styles from './masthead.module.scss';
import DetailPills from '../detail-pills/detail-pills';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';

const Masthead = ({title, tagLine, dictionary}) => {
  const [techSpecs, setTechSpecs] = useState({});
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

  configStore.subscribe(() => setTechSpecs(configStore.getState().techSpecs));

  return (
    <section className={styles.pageHeader}>
      <div className={styles.mainWidth}>
        <BreadCrumbs links={breadCrumbLinks}/>
        <h1 className={styles.pageTitle}>{title}</h1>
        <DetailPills techSpecs={techSpecs} dictionary={dictionary}/>
        <p className={styles.tagLine} data-test-id="tagLine">{tagLine}</p>
      </div>
    </section>
  )
};

export default Masthead;

