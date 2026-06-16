import React, { FunctionComponent } from 'react';
import FeaturedContentLandingPage from '../../layouts/featured-content/featured-content-landing-page/featured-content-landing-page';
import { graphql, useStaticQuery } from 'gatsby';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';

const FeaturedContentLandingPage: FunctionComponent = () => {

  const allFile = useStaticQuery(
    graphql`
      query {
        allFile(filter: { extension: { eq: "png" } }) {
          topicsImages: nodes {
            name
            childImageSharp {
              gatsbyImageData(quality: 100, placeholder: BLURRED)
            }
          }
        }
      }
    `
  );

  return (
    <SiteLayout isPreProd={false}>
      <FeaturedContentLandingPage images={allFile}/>
    </SiteLayout>
  );
}

export default FeaturedContentLandingPage;

export const Head = () => (
  <PageHelmet
    pageTitle=""
    description="With historical and current data, Fiscal Data is your hub for fiscal data.
          Download datasets on topics such as debt, interest rates, and more."
    keywords="U.S. Treasury, Fiscal Data, machine readable data, API, government, government
          financial data, debt, Treasury, US government"
  />
);
