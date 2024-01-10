import React, { useEffect, useState } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import MobileMenu from './mobile-menu/mobile-menu';
import { withWindowSize } from 'react-fns';
import PageNotice from '../page-notice/page-notice';
import OfficialBanner from './official-banner/official-banner';
import { isIE } from 'react-device-detect';
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import LocationAware from '../location-aware/location-aware';
import Glossary from '../glossary/glossary';
import DesktopMenu from './desktop-menu/desktop-menu';
import AnnouncementBanner from '../announcement-banner/announcement-banner';
import { NOTIFICATION_BANNER_DISPLAY_PAGES, NOTIFICATION_BANNER_DISPLAY_PATHS } from 'gatsby-env-variables';
import CustomLink from '../links/custom-link/custom-link';
import { bannerHeading, bannerContent, container, content, logo, stickyHeader } from './site-header.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

const SiteHeader = ({ lowerEnvMsg, location, width }) => {
  const defaultLogoWidth = 192;
  const defaultLogoHeight = 55;
  const reducedImageSize = 130;

  const [openGlossary, setOpenGlossary] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [imageWidth, setImageWidth] = useState(defaultLogoWidth);

  const displayBanner = () => {
    let display = false;
    display = NOTIFICATION_BANNER_DISPLAY_PAGES?.includes(location.pathname);
    NOTIFICATION_BANNER_DISPLAY_PATHS?.forEach(path => {
      if (location.pathname.includes(path)) {
        display = true;
      }
    });
    return display;
  };

  const getButtonHeight = imgWidth => (defaultLogoHeight * imgWidth) / defaultLogoWidth;

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
  );

  const glossaryData = glossaryCsv?.allGlossaryCsv?.nodes;

  const clickHandler = title => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title,
    });
    window.dataLayer = window.dataLayer || [];
    if (title === 'About Us') {
      window.dataLayer.push({
        event: `About-click`,
        eventLabel: document.title,
      });
    }
    window.dataLayer.push({
      event: `${title}-click`,
      eventLabel: document.title,
    });
  };

  const handleScroll = () => {
    const position = window.pageYOffset;
    const newWidth = defaultLogoWidth - position;
    setImageWidth(newWidth > reducedImageSize ? newWidth : reducedImageSize);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {displayBanner() && (
        <AnnouncementBanner closable={false}>
          <div className={bannerHeading}> Content Temporarily Unavailable:</div>
          <div className={bannerContent}>
            The Fiscal Data team is working diligently to address the current issue with this page. Please check back later or contact us{' '}
            <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">via email</CustomLink> for further assistance. Thank you.
          </div>
        </AnnouncementBanner>
      )}
      <header className={stickyHeader}>
        <OfficialBanner data-testid="officialBanner" />
        <div className={container}>
          <div className={content}>
            <div style={width > pxToNumber(breakpointLg) ? { width: imageWidth + 8 + 'px' } : null} className={logo}>
              <Link
                role="img"
                title="Return to home page"
                alt="Fiscal Data Homepage"
                data-testid="logo"
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
                  height={defaultLogoHeight}
                  width={defaultLogoWidth}
                />
              </Link>
            </div>
            <DesktopMenu
              location={location}
              glossaryClickHandler={setOpenGlossary}
              clickHandler={clickHandler}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              buttonHeight={getButtonHeight(imageWidth) + 4}
            />
          </div>
          <Glossary termList={glossaryData} activeState={openGlossary} setActiveState={setOpenGlossary} />
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
        {isIE && (
          <PageNotice warningLevel={1}>
            <strong data-testid="ieDetected">You seem to be using an unsupported browser</strong>
            <div>To get the best experience with Fiscal Data please use Chrome, Firefox, Edge, or Safari.</div>
          </PageNotice>
        )}
      </header>
    </>
  );
};

export default LocationAware(withWindowSize(SiteHeader));
