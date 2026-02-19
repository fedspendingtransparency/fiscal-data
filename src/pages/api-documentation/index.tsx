import React, { FunctionComponent } from 'react';
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
import { tocCont, tocHeader, tocWrapper } from '../../components/table-of-contents/toc.module.scss';
import { activeLink, hoverLink, content, aboutPageWrapper } from './api.module.scss';
import DataRegistry from '../../components/api-documentation/data-registry/data-registry';
import tocList from './toc-data.json';
import SecondaryNav from '../../components/secondary-nav/secondary-nav';

const ApiDocumentationPage: FunctionComponent = () => {
  const breadCrumbLinks = [
    {
      name: 'API Documentation',
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
          <h1 className="title">API Documentation</h1>
        </div>
      </div>
      <div className={`pageWrapper ${aboutPageWrapper}`}>
        <SecondaryNav sections={tocList} activeClass={activeLink} hoverClass={hoverLink} headerComponent={tocHeaderComponent}>
          <div id={content} className={content} data-testId="componentWrapper">
            <GettingStarted />
            <Endpoints />
            <DataRegistry />
            <Methods />
            <Parameters />
            <Responses />
            <Aggregation />
            <Examples />
          </div>
        </SecondaryNav>
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
