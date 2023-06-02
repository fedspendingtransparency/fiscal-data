import React, {useState} from 'react';
import { Link } from 'gatsby';
import * as styles from '../site-header.module.scss';
import Experimental from "../../experimental/experimental";
import MenuDropdown from "../menu-dropdown/menu-dropdown";
import Analytics from "../../../utils/analytics/analytics";
import { menuSections } from "../site-header-helper";

const DesktopMenu = ({ location }) => {
  const [currentDropdown, setDropdown] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedTools, setIsExpandedTools] = useState(false);
  const [isExpandedResources, setIsExpandedResources] = useState(false);
  const [menuExpanding, setMenuExpanding] = useState(false);
  const [toolsMenuExpanding, setToolsMenuExpanding] = useState(false);
  const [resourcesMenuExpanding, setResourcesMenuExpanding] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [toggledTools, setToggledTools] = useState(false);
  const [toggledResources, setToggledResources] = useState(false);

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  const handleMouseOver = (title) => {
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

      setDropdown(title)
    }
  }

  const handleBlur = (event, title) => {
    const currentTarget = event.currentTarget;

    requestAnimationFrame(() => {
      if(!currentTarget.contains(document.activeElement)) {
        // handleMouseLeave(title);
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
      {menuSections.map((pageLink) => {
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

        if (pageLink.children) {
          return (
            <MenuDropdown
              object={pageLink}
              handleMouseOver={() => handleMouseOver(pageLink.title)}
              toggled={currentDropdown}
              handleBlur={handleBlur}
            />
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
                          onMouseEnter={() => setDropdown(pageLink.title)}
                  >
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
