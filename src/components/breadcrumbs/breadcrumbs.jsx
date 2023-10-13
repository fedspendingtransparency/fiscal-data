import React from 'react';
import * as styles from './breadcrumbs.module.scss';
import CustomLink from '../links/custom-link/custom-link';

const BreadCrumbs = ({ links }) => {
  const bcLinks = links && links instanceof Array ? links.slice() : [];
  bcLinks.reverse();
  const currentPage = bcLinks.pop();

  return (
    <div className={styles.container}>
      {bcLinks.map((link, i) => (
        <div key={`breadCrumbLink${i}`} className={styles.linkDiv}>
          <CustomLink url={link.link}>{link.name}</CustomLink>
          <div className={styles.linkSeparator}>/</div>
        </div>
      ))}
      {currentPage && (
        <div className={`${styles.linkDiv} ${styles.currentPage}`} data-test-id="breadCrumbCurrentPage" title={currentPage.name}>
          {currentPage.name}
        </div>
      )}
    </div>
  );
};

export default BreadCrumbs;
