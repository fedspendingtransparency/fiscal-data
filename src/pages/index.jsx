import { ENV_ID } from "gatsby-env-variables";

import React from "react";
import "../styles.scss";
import * as styles from "./home.module.scss";
import PageHelmet from "../components/page-helmet/page-helmet";
import SiteLayout from "../components/siteLayout/siteLayout";
import BannerLeadText from '../components/banner/banner-lead-text';
import BannerGraphic from "../components/banner/banner-graphic";
import HomeMainContent from '../components/home-main-content/home-main-content';
import HomeFeatures from '../components/home-features/home-features';
import LocationAware from '../components/location-aware/location-aware';
import { StaticImage } from 'gatsby-plugin-image';
import AnnouncementBanner from "../components/announcement-banner/announcement-banner";
import TopicsSection from "../components/banner/topics-section";

export const Index = () => {
  return (
    <>
      <AnnouncementBanner>
        We are excited to announce that Fiscal Data is realigning with our sister website Data Lab to better serve you
        beginning November 30th! Moving forward, you can find new content here at Fiscal Data.
      </AnnouncementBanner>
      <SiteLayout isPreProd={ENV_ID === "preprod"}>
        {/*<div className={styles.watermark} data-testid="site-watermark">*/}
        {/*  <StaticImage*/}
        {/*    src="../images/hp-watermark.webp"*/}
        {/*    alt="Decorative illustrations including a savings bond, chart and graph to depict*/}
        {/*   information found on Fiscal Data."*/}
        {/*    role="presentation"*/}
        {/*    placeholder="none"*/}
        {/*    quality={95} // needed to preserve quality for image with narrow contrast range*/}
        {/*  />*/}
        {/*</div>*/}
        <div data-testid="site-home" className={styles.siteHome} data-environment={ENV_ID}>
          <PageHelmet
            data-testid="helmet"
            pageTitle=""
            description="With historical and current data, Fiscal Data is your hub for fiscal data.
          Download datasets on topics such as debt, interest rates, and more."
            keywords="U.S. Treasury, Fiscal Data, machine readable data, API, government, government
          financial data, debt, Treasury, US government"
          />
          {/*<div data-testid="banner" className={styles.bannerWrapper}>*/}
            <TopicsSection />
          {/*</div>*/}
          <HomeMainContent />
          <HomeFeatures />
        </div>
      </SiteLayout>
    </>
  )
};

export default LocationAware(Index);
