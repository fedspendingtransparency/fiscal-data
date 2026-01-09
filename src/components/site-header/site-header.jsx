import React, { useEffect, useMemo, useState } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { withWindowSize } from 'react-fns';
import { StaticImage } from 'gatsby-plugin-image';
import { isIE } from 'react-device-detect';
import { useRecoilValueLoadable } from 'recoil';

import PageNotice from '../page-notice/page-notice';
import OfficialBanner from './official-banner/official-banner';
import MobileMenu from './mobile-menu/mobile-menu';
import DesktopMenu from './desktop-menu/desktop-menu';
import Glossary from '../glossary/glossary';
import LocationAware from '../location-aware/location-aware';
import AnnouncementBanner from '../announcement-banner/announcement-banner';
import BannerContent from './banner-content/banner-content';

import Analytics from '../../utils/analytics/analytics';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

import { dynamicBannerLastCachedState, dynamicBannerState } from '../../recoil/dynamicBannerState';
import useShouldRefreshCachedData from '../../recoil/hooks/useShouldRefreshCachedData';

import { container, content, logo, stickyHeader } from './site-header.module.scss';

export const SiteHeader = ({ lowerEnvMsg, location, width }) => {
  const data = useRecoilValueLoadable(dynamicBannerState);

  const defaultLogoWidth = 192;
  const defaultLogoHeight = 55;
  const reducedImageSize = 130;

  const [openGlossary, setOpenGlossary] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [imageWidth, setImageWidth] = useState(defaultLogoWidth);
  const [bannersContent, setBannersContent] = useState(null);

  useShouldRefreshCachedData(Date.now(), dynamicBannerState, dynamicBannerLastCachedState);

  const isDesktop = width > pxToNumber(breakpointLg);
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

  useEffect(() => {
    if (data.state !== 'hasValue') return;

    const res = data.contents?.payload || [];
    const path = location?.pathname || '';

    const refinedBanners = res.filter(announcement => {
      if (!announcement?.path) return false;
      if (path === announcement.path) return true;
      if (announcement.recursive_path === 'true' && path.includes(announcement.path)) return true;
      return false;
    });

    setBannersContent(refinedBanners);
  }, [data.state, data.contents, location?.pathname]);

  useEffect(() => {
    if (!isDesktop) return;

    const handleScroll = () => {
      const position = window.pageYOffset;
      const newWidth = defaultLogoWidth - position;
      setImageWidth(newWidth > reducedImageSize ? newWidth : reducedImageSize);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDesktop]);

  useEffect(() => {
    setActiveDropdown(null);
  }, [isDesktop]);

  const logoContainerStyle = useMemo(() => {
    if (!isDesktop) return null;
    return { width: `${imageWidth}px` };
  }, [isDesktop, imageWidth]);

  return (
    <>
      {bannersContent &&
        bannersContent.map(announcement => (
          <AnnouncementBanner closable={false} key={announcement.path}>
            <BannerContent content={announcement.announcement_description} />
          </AnnouncementBanner>
        ))}

      <OfficialBanner data-testid="officialBanner" />

      <header className={stickyHeader}>
        <div className={container}>
          <div className={content}>
            <div style={logoContainerStyle} className={logo} data-testid="logoContainer">
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

            {/* Desktop menu is always rendered; CSS controls visibility */}
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

          {/* Mobile menu is always rendered; CSS controls visibility.
              IMPORTANT: overlay must be pointer-events:none when closed (Fix A in SCSS) */}
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
