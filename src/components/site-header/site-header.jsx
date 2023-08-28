import React, { useState } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import * as styles from './site-header.module.scss';
import MobileMenu from "./mobile-menu/mobile-menu";
import { withWindowSize } from 'react-fns';
import PageNotice from '../page-notice/page-notice';
import OfficialBanner from "./official-banner/official-banner";
import { isIE } from 'react-device-detect';
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import LocationAware from "../location-aware/location-aware";
import Glossary from '../glossary/glossary';
import DesktopMenu from "./desktop-menu/desktop-menu";
import AnnouncementBanner from '../announcement-banner/announcement-banner';
import {
  NOTIFICATION_BANNER_TEXT,
  NOTIFICATION_BANNER_DISPLAY_PAGES,
  NOTIFICATION_BANNER_DISPLAY_PATHS
} from 'gatsby-env-variables';
import CustomLink from '../links/custom-link/custom-link';

const SiteHeader = ({ lowerEnvMsg, location, glossaryEvent, glossaryClickEventHandler }) => {
  const [openGlossary, setOpenGlossary] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const displayBanner = () => {
    let display = false;
    display = NOTIFICATION_BANNER_DISPLAY_PAGES?.includes(location.pathname);
    NOTIFICATION_BANNER_DISPLAY_PATHS?.forEach(path => {
      if (location.pathname.includes(path)) {
        display = true;
      }
    });
    return display;
  }

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
    window.dataLayer = window.dataLayer || [];
    if (title === 'About Us') {
      window.dataLayer.push({
        'event': `About-click`,
        'eventLabel':document.title
      });
    }
    window.dataLayer.push({
      'event': `${title}-click`,
      'eventLabel':document.title
    });
  }

  return (
    <>
      { displayBanner()  &&
        <AnnouncementBanner closable={false}>
          <div className={styles.bannerHeading}>We're experiencing an issue with the {NOTIFICATION_BANNER_TEXT}</div>
          <div className={styles.bannerContent}>
            Our team is working diligently to address the issue. Please check back later or contact us{' '}
            <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">via email</CustomLink> {' '}
            for further assistance. Thank you.
          </div>
        </AnnouncementBanner>
      }
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
              onFocus={() => setActiveDropdown(null)}
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
            <DesktopMenu
              location={location}
              glossaryClickHandler={setOpenGlossary}
              clickHandler={clickHandler}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          </div>
          <Glossary
            termList={glossaryData}
            activeState={openGlossary}
            setActiveState={setOpenGlossary}
            glossaryEvent={glossaryEvent}
            glossaryClickEventHandler={glossaryClickEventHandler}
          />
          <MobileMenu setOpenGlossary={setOpenGlossary} />
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
    </>
  );
};

export default LocationAware(withWindowSize(SiteHeader));
