import React, { useEffect, useState } from 'react';
import {
  breadCrumb,
  pageHeader,
  mainWidth,
  pageTitle,
  stickyHeader,
  breadCrumbBackground,
  stickyMainWidth,
  stickyHeight,
} from './masthead.module.scss';
import BreadCrumbs from '../breadcrumbs/breadcrumbs';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

const Masthead = ({ title, width }) => {
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
    const breakpoint = width >= pxToNumber(breakpointLg) ? 120 : 90;
    setStickyView(position > breakpoint);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={breadCrumbBackground}>
        <div className={breadCrumb}>
          <BreadCrumbs links={breadCrumbLinks} />
        </div>
      </div>
      <section className={`${pageHeader} ${stickyView ? stickyHeight : undefined}`}>
        <div className={`${mainWidth} ${stickyView ? stickyMainWidth : undefined}`}>
          <h1 className={`${pageTitle} ${stickyView ? stickyHeader : undefined}`}>{title}</h1>
        </div>
      </section>
    </>
  );
};

export default withWindowSize(Masthead);
