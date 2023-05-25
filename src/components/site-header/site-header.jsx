import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import * as styles from './site-header.module.scss';
import MobileMenu from "./mobile-menu/mobile-menu";
import { withWindowSize } from 'react-fns';
import PageNotice from '../page-notice/page-notice';
import OfficialBanner from "./official-banner/official-banner";
import { isIE } from 'react-device-detect';
import Experimental from "../experimental/experimental";
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import LocationAware from "../location-aware/location-aware";
import Glossary from '../glossary/glossary';
import DesktopMenu from "./desktop-menu/desktop-menu";

const SiteHeader = ({ lowerEnvMsg, location }) => {

  const glossaryCsv = useStaticQuery(
    graphql`
      query {
        allGlossaryCsv {
          nodes {
            term
            definition
            site_page
            id
            url_display
            url_path
          }
        }
      }
    `
  )

  const glossaryData = glossaryCsv?.allGlossaryCsv?.nodes;

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  return (
    <header>
      <OfficialBanner data-testid="officialBanner" />
      <div className={styles.container}>
        <div className={styles.content}>
          <Link
            role="img"
            title="Return to home page"
            alt="Fiscal Data Homepage"
            data-testid="logo"
            className={styles.logo}
            aria-label="Fiscal Data logo - return to home page"
            to="/"
            onClick={() => clickHandler('Logo')}
            // TODO: figure out what is going on with this onMouseOver prop
            // onMouseOver={() => handleMouseEnterNonDropdown("Logo")}
          >
            <StaticImage
              src="../../images/logos/fd-logo.svg"
              loading="eager"
              placeholder="none"
              alt="Fiscal Data logo"
              height={55}
              width={192}
            />
          </Link>
          <DesktopMenu location={location} />
        </div>
        <Experimental featureId={"Glossary"}>
          <Glossary termList={glossaryData} />
        </Experimental>
        <MobileMenu />
      </div>
      {lowerEnvMsg && (
        <PageNotice>
          <span data-testid="lowerEnvMessage">
            <strong>NOTICE: </strong>
            {lowerEnvMsg}
          </span>
        </PageNotice>
      )}
      {
        isIE && (
          <PageNotice warningLevel={1}>
            <strong data-testid="ieDetected">You seem to be using an unsupported browser</strong>
            <div>
              To get the best experience with Fiscal Data please use Chrome, Firefox, Edge, or Safari.
            </div>
          </PageNotice>
        )}
    </header>
  );
};

export default LocationAware(withWindowSize(SiteHeader));
