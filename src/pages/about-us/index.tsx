/* istanbul ignore file */

/* TODO: When MDX POC is no longer useful, remove experimental aspects and
   dependencies, remove above istanbul ignore header above
 */

import React, { FunctionComponent } from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import About from './about-section/about-section';
import FAQ from './faq-section/faq-section';
import Contact from './contact-section/contact-section';
// todo - toc cms
import TOCData from './toc-data.json';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import SecondaryNav from '../../components/secondary-nav/secondary-nav';

import { tocHeader } from '../../components/table-of-contents/toc.module.scss';
import { aboutPageWrapper, activeLink, content, hoverLink } from './about-us.module.scss';

const AboutUsPage: FunctionComponent = () => {
  const breadCrumbLinks = [
    {
      name: 'About Us',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  const tocHeaderComponent = (
    <h2 data-test-id="about-page-header" className={tocHeader}>
      Table of Contents
    </h2>
  );

  return (
    <SiteLayout isPreProd={false}>
      <div className="pageHeader">
        <div className="content">
          <BreadCrumbs links={breadCrumbLinks} />
          <h1 data-test-id="pageTitle" className="title">
            About Us
          </h1>
        </div>
      </div>
      <div data-test-id="about-page-wrapper" className={`pageWrapper  ${aboutPageWrapper}`}>
        <SecondaryNav sections={TOCData} activeClass={activeLink} hoverClass={hoverLink} headerComponent={tocHeaderComponent}>
          <div id={content} className={content} data-test-id="about-content">
            <About />
            <FAQ />
            <Contact />
          </div>
        </SecondaryNav>
      </div>
    </SiteLayout>
  );
};

export default AboutUsPage;

export const Head = () => (
  <PageHelmet
    pageTitle="About Us"
    description="Fiscal Data inspires trust in government by providing access to open federal
          financial data in machine-readable formats with one easy-to-use website."
    keywords="U.S. Treasury, Fiscal Data, machine readable data, API, government, government
          financial data, debt, Treasury, US government"
  />
);
