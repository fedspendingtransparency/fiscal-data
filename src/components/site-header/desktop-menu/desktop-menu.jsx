import React, {useState} from 'react';
import { Link } from 'gatsby';
import * as styles from '../site-header.module.scss';
import Experimental from "../../experimental/experimental";
import MenuDropdown from "../menu-dropdown/menu-dropdown";
import Analytics from "../../../utils/analytics/analytics";
import { menuSections } from "../site-header-helper";

const DesktopMenu = ({ location }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Top ${title} Click`,
      label: document.title
    });
  }

  const analyticsEventMap = {
    "national-debt": "Debt",
    "national-deficit": "Deficit",
    "federal-spending": "Spending",
    "government-revenue": "Revenue"
  };

  const handleMouseOver = (title) => {
    if (title === 'Topics') {
      const thisurl = typeof window !== 'undefined' ? window.location.href : '';
      const urlSplit = thisurl.split('/');
      const pageName = urlSplit[urlSplit.length - 2];
      const explainerPageName = analyticsEventMap[pageName];

      Analytics.event({
        category: 'Sitewide Navigation',
        action: `Topics Click`,
        label: explainerPageName
      })
    }
  }

  return (
    <div className={styles.pageLinks} data-testid="pageLinks">
      {menuSections.map((pageLink, index) => {
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
              content={pageLink}
              handleMouseOver={() => handleMouseOver(pageLink.title)}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              key={index}
            />
          )
        }

        return (
          <div className={styles.pageLinkButtonContainer} key={pageLink.title}>
            <div className={styles.pageLinkButtonContent}
                 style={{minWidth: `${(pageLink.title.length * 7.5) + 16}px`}}
            >
              {pageLink.to === location.pathname ?
                <button
                  className={`${styles.pageLinkButton} ${styles.pageLinkButtonActive}`}
                  disabled
                >
                  <span>
                    {pageLink.title}
                  </span>
                </button> : (
                  <button className={styles.pageLinkButton}
                          onMouseEnter={() => setActiveDropdown(pageLink.title)}
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
