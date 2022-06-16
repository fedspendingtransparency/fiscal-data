import React, {useState} from 'react';
import { Link } from 'gatsby';
import * as styles from './site-header.module.scss';
import MobileMenu from "./mobile-menu/mobile-menu";
import { withWindowSize } from 'react-fns';
import PageNotice from '../page-notice/page-notice';
import OfficialBanner from "./official-banner/official-banner";
import { isIE } from 'react-device-detect';
import Experimental from "../experimental/experimental";
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import AnnouncementBanner from "../announcement-banner/announcement-banner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const SiteHeader = ({ lowerEnvMsg }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pageLinks = [
    {
      title: 'Topics',
      to: '/',
      testId: 'topics'
    },
    {
      title: 'Dataset Search',
      to: '/datasets/',
      testId: 'search'
    },
    {
      title: 'API Documentation',
      to: '/api-documentation/',
      testId: 'apiDocs'
    },
    {
      title: 'About Us',
      to: '/about-us/',
      testId: 'about'
    },
    {
      title: 'Experimental',
      to: '/experimental/',
      testId: 'experimental',
      isExperimental: true,
      featureId: 'experimental-page'
    },
  ]

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  const handleMouseOver = () => {
    setIsExpanded(true);
  }

  const handleMouseLeave = () => {
    setIsExpanded(false);
  }

  const dropdownTempText = 'Coming soon! - Short analyses on federal finance topics';

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
          <div className={styles.pageLinks} data-testid="pageLinks">
            {pageLinks.map((pageLink) => {
              if (pageLink.isExperimental) {
                return (
                  <Experimental featureId={pageLink.featureId} key={pageLink.title}>
                    <Link
                      to={pageLink.to}
                      activeClassName={styles.activeLink}
                      data-testid={pageLink.testId}
                    >
                      {pageLink.title}
                    </Link>
                  </Experimental>
                )
              }

              if (pageLink.title === 'Topics') {
                return (
                  <div className={styles.dropdown}>
                    <button
                      className={isExpanded ? styles.dropdownButtonExpanded : styles.dropdownButton}
                      onMouseOver={handleMouseOver}
                      onFocus={handleMouseOver}
                      data-testid={'topicsButton'}
                    >
                      {pageLink.title}
                      {isExpanded
                      ? <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                      : <FontAwesomeIcon icon={faCaretRight} className={styles.caret} />
                      }
                    </button>
                    {isExpanded && (
                      <div
                        className={styles.dropdownContent}
                        onMouseOver={handleMouseOver}
                        onMouseLeave={handleMouseLeave}
                        onFocus={handleMouseOver}
                        data-testid={'dropdownContent'}
                      >
                        <div className={styles.dropdownRow}>
                          <div className={styles.dropdownColumnOne}>
                            <div className={styles.dropdownTitle}>
                              AMERICA'S FINANCE GUIDE
                            </div>
                              <Link href={'/'} className={styles.dropdownListItem}>Debt</Link>
                          </div>
                          <div className={styles.dropdownColumnTwo}>
                            <div className={styles.dropdownTitle}>
                              INSIGHTS
                            </div>
                              <div className={styles.dropdownTempText}>
                                <em>{dropdownTempText}</em>
                              </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={pageLink.title}
                  to={pageLink.to}
                  activeClassName={styles.activeLink}
                  data-testid={pageLink.testId}
                  onClick={() => clickHandler(pageLink.title)}
                >
                  {pageLink.title}
                </Link>
              )
            })}
          </div>
        </div>
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

export default withWindowSize(SiteHeader);
