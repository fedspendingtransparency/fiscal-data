import { ENV_ID } from 'gatsby-env-variables';
import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import FeaturedContentLanding from '../../layouts/featured-content/featured-content-landing/featured-content-landing';

const FeaturedContentLandingPage = () => (
  <SiteLayout isPreProd={false}>
    <FeaturedContentLanding />
  </SiteLayout>
);

export default FeaturedContentLandingPage;

export const Head = () => (
  <PageHelmet
    pageTitle="Featured Content"
    description="Explore featured content from Fiscal Data, including historical data stories and insights into U.S. government finances."
    keywords="U.S. Treasury, Fiscal Data, featured content, historic data, government financial data"
  />
);
