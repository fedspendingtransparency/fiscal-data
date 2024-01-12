import React, { useEffect, useState } from 'react';
import { breadCrumb, pageHeader, mainWidth, pageTitle, stickyHeader, stickyMainWidth } from './masthead.module.scss';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';

const Masthead = ({ title }) => {
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
    <>
      <div className={breadCrumb}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <section className={pageHeader}>
        <div className={`${mainWidth} ${stickyView ? stickyMainWidth : undefined}`}>
          <h1 className={`${pageTitle} ${stickyView ? stickyHeader : undefined}`}>{title}</h1>
        </div>
      </section>
    </>
  );
};

export default Masthead;
