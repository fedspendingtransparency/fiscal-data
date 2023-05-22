import React, {useState} from 'react';
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
import MenuDropdown from "./menu-dropdown/menu-dropdown";
import Glossary from '../glossary/glossary';
import { getGlossaryMap } from '../../helpers/glossary-helper/glossary-data';

const SiteHeader = ({ lowerEnvMsg, location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedTools, setIsExpandedTools] = useState(false);
  const [isExpandedResources, setIsExpandedResources] = useState(false);
  const [menuExpanding, setMenuExpanding] = useState(false);
  const [toolsMenuExpanding, setToolsMenuExpanding] = useState(false);
  const [resourcesMenuExpanding, setResourcesMenuExpanding] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [toggledTools, setToggledTools] = useState(false);
  const [toggledResources, setToggledResources] = useState(false);
  const [openGlossary, setOpenGlossary] = useState(false);

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

  const pageLinks = [
    {
      title: 'Topics',
      to: '/',
      testId: 'topics',
      featureId: 'topics',
      dropdown: true,
    },
    {
      title: 'Tools',
      to: '/',
      testId: 'tools',
      featureId: 'tools',
      dropdown: true,
    },
    {
      title: 'Dataset Search',
      to: '/datasets/',
      testId: 'search'
    },
    {
      title: 'Resources',
      to: '/',
      testId: 'Resources',
      dropdown: true,
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

  const resourcesPageLinks = [
    {
      title: 'Glossary',
      to: '/',
      testId: 'glossary'
    },
    {
      title: 'API Documentation',
      to: '/api-documentation/',
      testId: 'apiDocs'
    },
    {
      title: 'Release Calendar',
      to: '/release-calendar/',
      testId: 'releaseCalendar'
    }
  ]
  const toolsPageLinks = [
    {
      title: 'Currency Exchange Rates Converter',
      to: '/currency-exchange-rates-converter/',
    },
  ]

  const clickHandler = (title) => {
    if (title === 'Glossary'){
      setOpenGlossary(true);
    }

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

      setResourcesMenuExpanding(false);
      setToggledResources(false);
      setIsExpandedResources(false);
      setResourcesMenuExpanding(false);

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

      setResourcesMenuExpanding(false);
      setToggledResources(false);
      setIsExpandedResources(false);
      setResourcesMenuExpanding(false);

      setToolsMenuExpanding(true);
      setToggledTools(true);
      setIsExpandedTools(true);
      setTimeout( () => {
        setToolsMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseOverResources = () => {
    if(!isExpandedResources) {

      setMenuExpanding(false);
      setToggled(false);
      setIsExpanded(false);
      setMenuExpanding(false);

      setToolsMenuExpanding(false);
      setToggledTools(false);
      setIsExpandedTools(false);
      setToolsMenuExpanding(false);

      setResourcesMenuExpanding(true);
      setToggledResources(true);
      setIsExpandedResources(true);
      setTimeout( () => {
        setResourcesMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseLeave = (title) => {
    if(title === 'Topics') {
      if(isExpanded) {
        setMenuExpanding(true);
        setToggled(false);
        setTimeout(() => {
          setIsExpanded(false);
        }, 500);
      }
    } else if(title === 'Tools') {
      if(isExpandedTools) {
        setToolsMenuExpanding(true);
        setToggledTools(false);
        setTimeout(() => {
          setIsExpandedTools(false);
        }, 500);
      }
    } else if(title === 'Resources') {
      if(isExpandedResources) {
        setResourcesMenuExpanding(true);
        setToggledResources(false);
        setTimeout(() => {
          setIsExpandedResources(false);
        }, 500);
      }
    }
  }

  const handleBlur = (event, title) => {
    const currentTarget = event.currentTarget;

    requestAnimationFrame(() => {
      if(!currentTarget.contains(document.activeElement)) {
        handleMouseLeave(title);
      }
    });
  }

  const handleMouseEnterNonDropdown = (title) => {

    if (title !== 'Topics' && title !== 'Tools' && title !== 'Resources') {
      handleMouseLeave("Topics");
      handleMouseLeave("Tools");
      handleMouseLeave("Resources");
    }
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
            onMouseOver={() => handleMouseEnterNonDropdown("Logo")}
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
                  <MenuDropdown
                    title={pageLink.title}
                    handleMouseOver={handleMouseOver}
                    toggled={toggled}
                    isExpanded={isExpanded}
                    handleMouseLeave={handleMouseLeave}
                    handleBlur={handleBlur}
                    menuExpanding={menuExpanding}
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
                    </div>
                  </MenuDropdown>
                )
              }

              if (pageLink.title === 'Tools') {
                return (
                  <MenuDropdown
                    title={pageLink.title}
                    handleMouseOver={handleMouseOverTools}
                    toggled={toggledTools}
                    isExpanded={isExpandedTools}
                    handleMouseLeave={handleMouseLeave}
                    handleBlur={handleBlur}
                    menuExpanding={toolsMenuExpanding}
                  >
                    <div className={styles.toolsSingleDropDown}>
                      {toolsPageLinks.map((link) => {
                        return (
                          <div className={styles.dropdownListItem}>
                            <Link
                              to={link.to}
                              activeClassName={styles.activeTopicLink}
                              key={link.title}
                              onClick={() => clickHandler(link.title)}
                            >
                              {link.title}
                            </Link>
                          </div>
                        )
                      })
                      }
                    </div>
                  </MenuDropdown>
                )
              }

              if (pageLink.title === 'Resources') {
                return (
                  <MenuDropdown
                    title={pageLink.title}
                    handleMouseOver={handleMouseOverResources}
                    toggled={toggledResources}
                    isExpanded={isExpandedResources}
                    handleMouseLeave={handleMouseLeave}
                    handleBlur={handleBlur}
                    menuExpanding={resourcesMenuExpanding}
                  >
                    <div className={styles.resourcesDropDown}>
                      {resourcesPageLinks.map((link) => {
                        if(link.title === 'Glossary'){
                          return (
                            <div className={styles.dropdownListItem}>
                              <button onClick={() => clickHandler(link.title)}
                                style={{minWidth:`${(link.title.length * 7.5)+28}px`}}
                              >
                                <div>{link.title}</div>
                              </button>
                            </div>
                          )
                        }
                        else {
                          return (
                            <div className={styles.dropdownListItem}>
                              <Link
                                to={link.to}
                                activeClassName={styles.activeTopicLink}
                                key={link.title}
                                onClick={() => clickHandler(link.title)}
                                style={{minWidth:`${(link.title.length * 7.5)+28}px`}}
                              >
                                {link.title}
                              </Link>
                            </div>
                          )
                        }
                      })
                      }
                    </div>
                  </MenuDropdown>
                )
              }
              return (
                <div className={styles.pageLinkButtonContainer} key={pageLink.title}>
                  <div className={styles.pageLinkButtonContent}
                       style={{minWidth:`${(pageLink.title.length * 7.5)+16}px`}}
                  >
                    {pageLink.to === location.pathname ?
                      <button className={`${styles.pageLinkButton} ${styles.pageLinkButtonActive}`}
                              disabled
                      >
                        <span>
                          {pageLink.title}
                        </span>
                      </button> : (
                        <button className={styles.pageLinkButton}
                        onMouseEnter={() => handleMouseEnterNonDropdown(pageLink.title)}>
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
          {openGlossary && 
          <Glossary termList={glossaryData}
          activeState={openGlossary}
          setActiveState={setOpenGlossary} />
          }
        <MobileMenu setOpenGlossary={setOpenGlossary}/>
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
