import { ENV_ID } from "gatsby-env-variables";

import React from "react";
import "../styles.scss";
import * as styles from "./home.module.scss";
import PageHelmet from "../components/page-helmet/page-helmet";
import SiteLayout from "../components/siteLayout/siteLayout";
import HomeMainContent from '../components/home-main-content/home-main-content';
import HomeFeatures from '../components/home-features/home-features';
import LocationAware from '../components/location-aware/location-aware';
import TopicsSection from "../components/topics-section/topics-section";
import {graphql, useStaticQuery} from "gatsby";

export const Index = () => {
  const allFile = useStaticQuery(
    graphql`
        query {
          allFile(filter: {extension: {eq: "png"}}) {
            topicsImages: nodes {
              name
              childImageSharp {
                gatsbyImageData(
                  quality: 100,
                  placeholder: BLURRED
                )
              }
            }
          }
        }
      `,
  );

  return (
    <>
      <SiteLayout isPreProd={ENV_ID === "preprod"}>
        <div data-testid="site-home" className={styles.siteHome} data-environment={ENV_ID}>
          <PageHelmet
            data-testid="helmet"
            pageTitle=""
            description="With historical and current data, Fiscal Data is your hub for fiscal data.
          Download datasets on topics such as debt, interest rates, and more."
            keywords="U.S. Treasury, Fiscal Data, machine readable data, API, government, government
          financial data, debt, Treasury, US government"
          />
          <TopicsSection images={allFile} data-testid="topics-section" />
          <HomeMainContent />
          <HomeFeatures />
        </div>
      </SiteLayout>
    </>
  )
};

export default LocationAware(Index);
