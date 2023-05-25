import React, {useState} from 'react';
import { Link } from 'gatsby';
import * as styles from '../site-header.module.scss';
import Experimental from "../../experimental/experimental";
import MenuDropdown from "../menu-dropdown/menu-dropdown";
import Analytics from "../../../utils/analytics/analytics";
import { menuSections } from "../site-header-helper";

const DesktopMenu = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedTools, setIsExpandedTools] = useState(false);
  const [isExpandedResources, setIsExpandedResources] = useState(false);
  const [menuExpanding, setMenuExpanding] = useState(false);
  const [toolsMenuExpanding, setToolsMenuExpanding] = useState(false);
  const [resourcesMenuExpanding, setResourcesMenuExpanding] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [toggledTools, setToggledTools] = useState(false);
  const [toggledResources, setToggledResources] = useState(false);

  const resourcesPageLinks = [
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
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  const handleMouseOver = () => {
    if (!isExpanded) {
      const thisurl = typeof window !== 'undefined' ? window.location.href : '';
      const urlSplit = thisurl.split('/');
      const pageName = urlSplit[urlSplit.length - 2];
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
      setTimeout(() => {
        setMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseOverTools = () => {
    if (!isExpandedTools) {

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
      setTimeout(() => {
        setToolsMenuExpanding(false);
      }, 10);
    }
  }

  const handleMouseOverResources = () => {
    if (!isExpandedResources) {

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
      setTimeout(() => {
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

  const handleMouseEnterNonDropdown = (title) => {

    if (title !== 'Topics' && title !== 'Tools' && title !== 'Resources') {
      handleMouseLeave("Topics");
      handleMouseLeave("Tools");
      handleMouseLeave("Resources");
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

  return (
    <div className={styles.pageLinks} data-testid="pageLinks">
      {pageLinks.map((pageLink) => {
        if (pageLink.isExperimental) {
          return (
            <Experimental featureId={pageLink.featureId} key={pageLink.title}>
              <div className={styles.pageLinkButtonContainer}>
                <div className={styles.pageLinkButtonContent}
                     style={{minWidth: `${(pageLink.title.length * 8) + 16}px`}}
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

        if (pageLink.largeDropdown === true) {
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
                  <div className={styles.dropdownTitle}>
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
                    <Link
                      to={link.to}
                      activeClassName={styles.activeTopicLink}
                      key={link.title}
                      onClick={() => clickHandler(link.title)}
                    >
                      {link.title}
                    </Link>
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
                  return (
                    <Link
                      to={link.to}
                      activeClassName={styles.activeTopicLink}
                      key={link.title}
                      onClick={() => clickHandler(link.title)}
                    >
                      {link.title}
                    </Link>
                  )
                })
                }
              </div>
            </MenuDropdown>
          )
        }
        return (
          <div className={styles.pageLinkButtonContainer} key={pageLink.title}>
            <div className={styles.pageLinkButtonContent}
                 style={{minWidth: `${(pageLink.title.length * 7.5) + 16}px`}}
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
  );
};

export default DesktopMenu;
