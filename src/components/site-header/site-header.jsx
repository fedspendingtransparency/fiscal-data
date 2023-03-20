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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import LocationAware from "../location-aware/location-aware";

const SiteHeader = ({ lowerEnvMsg, location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedTools, setIsExpandedTools] = useState(false);
  const [menuExpanding, setMenuExpanding] = useState(false);
  const [toolsMenuExpanding, setToolsMenuExpanding] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [toggledTools, setToggledTools] = useState(false);

  const pageLinks = [
    {
      title: 'Topics',
      to: '/',
      testId: 'topics',
      featureId: 'topics'
    },
    {
      title: 'Tools',
      to: '/currency-exchange-rates-converter/',
      testId: 'tools',
      featureId: 'tools'
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
    }
  ]

  const topicsPageLinks = [
    {
      title: 'Overview',
      to: '/americas-finance-guide/',
      testId: 'overview'
    },{
      title: 'Revenue',
      to: '/americas-finance-guide/government-revenue/',
      testId: 'revenue'
    },{
      title: 'Spending',
      to: '/americas-finance-guide/federal-spending/',
      testId: 'spending'
    },{
      title: 'Deficit',
      to: '/americas-finance-guide/national-deficit/',
      testId: 'deficit'
    },{
      title: 'Debt',
      to: '/americas-finance-guide/national-debt/',
      testId: 'debt'
    }
  ]

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  const topicsClickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Topics Click`,
      label: title
    });
  }

  const analyticsEventMap = {
    "national-debt": "Debt",
    "national-deficit": "Deficit",
    "federal-spending": "Spending",
    "government-revenue": "Revenue"
  };

  const handleMouseOver = () => {
    if(!isExpanded) {
      const thisurl = typeof window !== 'undefined' ? window.location.href : '';
      const urlSplit = thisurl.split('/');
      const pageName = urlSplit[urlSplit.length-2];
      const explainerPageName = analyticsEventMap[pageName];
      Analytics.event({
        category: 'Sitewide Navigation',
        action: `Topics Click`,
        label: explainerPageName
      })

      setToolsMenuExpanding(false);
      setToggledTools(false);
      setIsExpandedTools(false);
      setToolsMenuExpanding(false);

      setMenuExpanding(true);
      setToggled(true);
      setIsExpanded(true);
      setTimeout( () => {
        setMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseOverTools = () => {
    if(!isExpandedTools) {

      setMenuExpanding(false);
      setToggled(false);
      setIsExpanded(false);
      setMenuExpanding(false);

      setToolsMenuExpanding(true);
      setToggledTools(true);
      setIsExpandedTools(true);
      setTimeout( () => {
        setToolsMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseLeave = () => {
    if(isExpanded) {
      setMenuExpanding(true);
      setToggled(false);
      setTimeout(() => {
        setIsExpanded(false);
      }, 500);
    }
  }

  const handleMouseLeaveTools = () => {
    if(isExpandedTools) {
      setToolsMenuExpanding(true);
      setToggledTools(false);
      setTimeout(() => {
        setIsExpandedTools(false);
      }, 500);
    }
  }

  const handleBlur = (e) => {
    const currentTarget = e.currentTarget;

    requestAnimationFrame(() => {
      if(!currentTarget.contains(document.activeElement)) {
        handleMouseLeave();
      }
    });
  }

  const dropdownTempText = 'Coming soon! — Short analyses on federal finance topics';


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
                    <div className={styles.pageLinkButtonContainer}>
                      <div className={styles.pageLinkButtonContent}
                           style={{minWidth:`${(pageLink.title.length * 8)+16}px`}}
                      >
                        <button className={styles.pageLinkButton}>
                          <Link
                            to={pageLink.to}
                            activeClassName={styles.activeLink}
                            data-testid={pageLink.testId}
                          >
                            {pageLink.title}
                          </Link>
                        </button>
                      </div>
                    </div>
                  </Experimental>
                )
              }

              if (pageLink.title === 'Topics') {
                return (
                  <div className={styles.dropdown}
                       style={{transition:'opacity 1s ease'}}
                       key={pageLink.title}
                  >
                    <button
                      className={toggled ? styles.dropdownButtonExpanded : styles.dropdownButton}
                      onMouseEnter={handleMouseOver}
                      onFocus={handleMouseOver}
                      data-testid={'topicsButton'}
                    >
                      {pageLink.title}
                      {toggled
                        ? <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                        : <FontAwesomeIcon icon={faCaretRight} className={styles.caret} />
                      }
                    </button>
                    {isExpanded && (
                      <div
                        className={`${styles.dropdownContent} ${menuExpanding ? styles.dropdownHidden : ''}`}
                        onMouseOver={handleMouseOver}
                        onMouseLeave={handleMouseLeave}
                        onFocus={handleMouseOver}
                        onBlur={handleBlur}
                        role={'button'}
                        tabIndex={'0'}
                        data-testid={'dropdownContent'}
                      >
                        <div className={styles.dropdownRow}>
                          <div className={styles.dropdownColumnOne}>
                            <div className={styles.dropdownTitle} >
                              AMERICA'S FINANCE GUIDE
                            </div>
                            <div>
                              {topicsPageLinks.map((topicPageLink) => {
                                return (
                                  <div key={topicPageLink.title}
                                       className={styles.dropdownListItem}
                                  >
                                    <Link
                                      to={topicPageLink.to}
                                      activeClassName={styles.activeTopicLink}
                                      onClick={() => topicsClickHandler(topicPageLink.title)}
                                    >
                                      {topicPageLink.title}
                                    </Link>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className={styles.dropdownColumnTwo}>
                            <div className={styles.dropdownTitle} >
                              INSIGHTS
                            </div>
                            <div className={styles.dropdownTempText} >
                              <em>{dropdownTempText}</em>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              if (pageLink.title === 'Tools') {
                return (
                  <div className={styles.dropdown}
                       style={{transition:'opacity 1s ease'}}
                       key={pageLink.title}
                  >
                    <button
                      className={toggledTools ? styles.dropdownButtonExpanded : styles.dropdownButton}
                      onMouseEnter={handleMouseOverTools}
                      onFocus={handleMouseOverTools}
                      data-testid={'topicsButton'}
                    >
                      {pageLink.title}
                      {toggledTools
                        ? <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                        : <FontAwesomeIcon icon={faCaretRight} className={styles.caret} />
                      }
                    </button>
                    {isExpandedTools && (
                      <div
                        className={`${styles.dropdownContent} ${toolsMenuExpanding ? styles.dropdownHidden : ''}`}
                        onMouseOver={handleMouseOverTools}
                        onMouseLeave={handleMouseLeaveTools}
                        onFocus={handleMouseOverTools}
                        onBlur={handleBlur}
                        role={'button'}
                        tabIndex={'0'}
                        data-testid={'dropdownContent'}
                      >
                        <div className={styles.toolsSingleDropDown}>
                          <Link
                            to={pageLink.to}
                            activeClassName={styles.activeTopicLink}
                            // onClick={() => topicsClickHandler(topicPageLink.title)}
                          >
                            Currency Exchange Rates Converter
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div className={styles.pageLinkButtonContainer} key={pageLink.title}>
                  <div className={styles.pageLinkButtonContent}
                       style={{minWidth:`${(pageLink.title.length * 8)+16}px`}}
                  >
                    {pageLink.to === location.pathname ?
                      <button className={`${styles.pageLinkButton} ${styles.pageLinkButtonActive}`}
                              disabled
                      >
                        <span>
                          {pageLink.title}
                        </span>
                      </button> : (
                        <button className={styles.pageLinkButton}>
                          <Link
                            key={pageLink.title}
                            to={pageLink.to}
                            activeClassName={styles.activeLink}
                            data-testid={pageLink.testId}
                            onClick={() => clickHandler(pageLink.title)}
                          >
                            {pageLink.title}
                          </Link>
                        </button>
                      )
                    }
                  </div>
                </div>
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

export default LocationAware(withWindowSize(SiteHeader));
