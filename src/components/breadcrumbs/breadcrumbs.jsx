import React from 'react';
import { container, currentEvent, linkDiv, linkSeparator } from './breadcrumbs.module.scss';
import CustomLink from '../links/custom-link/custom-link';

const BreadCrumbs = ({ links }) => {
  const bcLinks = links && links instanceof Array ? links.slice() : [];
  bcLinks.reverse();
  const currentPage = bcLinks.pop();

  return (
    <div className={container} data-testid="breadcrumbs">
      {bcLinks.map((link, i) => (
        <div key={`breadCrumbLink${i}`} className={linkDiv}>
          <CustomLink url={link.link}>{link.name}</CustomLink>
          <div className={linkSeparator}>/</div>
        </div>
      ))}
      {currentPage && (
        <div className={`${linkDiv} ${currentEvent}`} data-test-id="breadCrumbCurrentPage" title={currentPage.name}>
          {currentPage.name}
        </div>
      )}
    </div>
  );
};

export default BreadCrumbs;
