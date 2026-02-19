/* eslint-disable */

import React, { useEffect, useState } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import * as Scroll from 'react-scroll';
import { Link } from 'react-scroll';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import PageHelmet from '../../components/page-helmet/page-helmet';
import GettingStarted from '../../components/api-documentation/getting-started/getting-started';
import Endpoints from '../../components/api-documentation/endpoints/endpoints';
import Methods from '../../components/api-documentation/methods/methods';
import Parameters from '../../components/api-documentation/parameters/parameters';
import Responses from '../../components/api-documentation/responses/responses';
import Aggregation from '../../components/api-documentation/aggregation/aggregation';
import Examples from '../../components/api-documentation/examples/examples';
import TOCButton from '../../components/table-of-contents/toc-button/toc-button';
import { tocCont, tocHeader, tocWrapper } from '../../components/table-of-contents/toc.module.scss';
import {
  activeLink,
  apiPageSpacer,
  apiPageWrapper,
  content,
  headingLevel2,
  headingLevel3,
  headingLevel4,
  link,
  sectionList,
  toc,
  tocClosed,
  tocOpen,
} from './api.module.scss';
import DataRegistry from '../../components/api-documentation/data-registry/data-registry';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import { scrollOptionsSmooth } from '../../utils/scroll-config';
import { globalNavOffset } from '../../components/secondary-nav/secondary-nav';
import tocList from './toc-data.json';

const ApiDocumentationPage = ({ location }) => {
  const breadCrumbLinks = [
    {
      name: 'API Documentation',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  const [tocIsOpen, setTocIsOpen] = useState(false);
  const [scrollToId, setScrollToId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleSelectLink = e => {
    const target = e.target;
    const enterKey = 'Enter';
    if (target && e.key === enterKey) {
      const curClass = target.className;
      if (curClass.includes(link)) {
        target.click();
      }
    }
  };

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
  };

  useEffect(() => {
    // Capture keyboard events on the TOC
    window.addEventListener('keyup', handleSelectLink);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleSelectLink);
    };
  }, []);

  useEffect(() => {
    if (scrollToId) {
      Scroll.scroller.scrollTo(scrollToId, {
        smooth: true,
        spy: true,
        duration: 600,
        delay: 200,
        offset: globalNavOffset,
      });
      setScrollToId(null);
    }
  }, [tocIsOpen]);

  function handleToggle(e, id) {
    if (id) {
      setScrollToId(id);
      updateAddressPath(id, location);
    } else {
      if (!tocIsOpen) {
        Scroll.animateScroll.scrollToTop(scrollOptionsSmooth);
      } else {
        Scroll.animateScroll.scrollTo(lastScrollPosition, scrollOptionsSmooth);
      }
    }
    setLastScrollPosition(scrollPosition);
    setTocIsOpen(!tocIsOpen);
  }

  let toggleStyles = tocIsOpen ? tocOpen : tocClosed;

  return (
    <SiteLayout>
      <div className="pageHeader">
        <div className="content">
          <BreadCrumbs links={breadCrumbLinks} />
          <h1 className="title">API Documentation</h1>
        </div>
      </div>
      <div className={`pageWrapper ${apiPageWrapper}`}>
        <aside className={tocWrapper}>
          <nav id={toc} className={`${toggleStyles} ${tocCont}`} data-testid="tocWrapper">
            <ul className={sectionList}>
              <h2 className={tocHeader}>Table of Contents</h2>
              {tocList.map((d, i) => {
                return (
                  <li key={`toc${i}`}>
                    <Link
                      className={`${link} ${d.headingLevel}`}
                      data-testid={`tocLink`}
                      tabIndex={0}
                      activeClass={activeLink}
                      to={d.id}
                      smooth={true}
                      spy={true}
                      duration={600}
                      delay={200}
                      onClick={e => {
                        handleToggle(e, d.id);
                      }}
                      offset={globalNavOffset - 3}
                    >
                      {d.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <div id={content} className={`${toggleStyles} ${apiPageSpacer}`} data-testid="componentWrapper">
          <GettingStarted location={location} />
          <Endpoints />
          <DataRegistry />
          <Methods />
          <Parameters />
          <Responses />
          <Aggregation />
          <Examples />
        </div>
        <TOCButton handleToggle={handleToggle} state={tocIsOpen} />
      </div>
    </SiteLayout>
  );
};

export default ApiDocumentationPage;

export const Head = () => (
  <PageHelmet
    pageTitle="API Documentation"
    description="Detailed instructions for data scientists on how to access Fiscal Data’s datasets using APIs, including information on endpoints, filters, and more."
    keywords="API, US Treasury, HTTP, JSON, API request, open data, U.S. Department of the Treasury, Fiscal Service, government finances"
  />
);
