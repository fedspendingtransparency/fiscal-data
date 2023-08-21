import React, {useState, useEffect} from 'react'
import {Link} from "gatsby"
import * as styles from './explainer-sub-nav.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";
import Analytics from "../../../../utils/analytics/analytics";

export default function ExplainerSubNav({hidePosition}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(styles.navBlock);

  const handleScroll = () => {
    const prevScrollPosition = scrollPosition
    const currPosition = window.pageYOffset; //TODO: Look into replacing
    setScrollPosition(currPosition);

    if (currPosition > hidePosition) {
      //Scrolling Down
      if (prevScrollPosition < currPosition) {
        setNavBlockStyle(styles.navBlockHidden)
      } else {
        setNavBlockStyle(styles.navBlockSticky)
      }
    } else {
      setNavBlockStyle(styles.navBlock)
    }
  };

  const analyticsEvent = (title) => {
    Analytics.event({
      category: 'Fiscal Data - Explainers',
      action: `Sub Nav Click`,
      label: title
    });
  }


  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [scrollPosition]);
  return (
    <div id={styles.navContainer} data-testid="explainerSubNav">
      <ul className={navBlockStyle} data-testid="explainerSubNavList">
        <li className={[styles.navItem, styles.noverview, styles.nactive].join(' ')}>
          <Link to='/americas-finance-guide/' className={`${styles.navLink} explainerSubNav`}
                activeClassName={styles.active} onClick={() => analyticsEvent('Overview')}
          >
            <FontAwesomeIcon icon={faHouseChimney} className={styles.navIcon} />
            <span className={styles.navLinkText}>Overview</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.overview].join(' ')} />
        <li className={[styles.backChevron, styles.revenue].join(' ')} />
        <li className={[styles.navItem, styles.revenue].join(' ')}>
          <Link to='/americas-finance-guide/government-revenue/' className={`${styles.navLink} explainerSubNav`}
                activeClassName={styles.active}  onClick={() => analyticsEvent('Revenue')}
          >
            <span className={styles.navLinkText}>Revenue</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.revenue].join(' ')} />
        <li className={[styles.backChevron, styles.spending].join(' ')} />
        <li className={[styles.navItem, styles.spending].join(' ')}>
          <Link to='/americas-finance-guide/federal-spending/' className={`${styles.navLink} explainerSubNav`}
                activeClassName={styles.active} onClick={() => analyticsEvent('Spending')}
          >
            <span className={styles.navLinkText}>Spending</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.spending].join(' ')} />
        <li className={[styles.backChevron, styles.deficit].join(' ')} />
        <li className={[styles.navItem, styles.deficit].join(' ')}>
          <Link to='/americas-finance-guide/national-deficit/' className={`${styles.navLink} explainerSubNav`}
                activeClassName={styles.active} onClick={() => analyticsEvent('Deficit')}
          >
            <span className={styles.navLinkText}>Deficit</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.deficit].join(' ')} />
        <li className={[styles.backChevron, styles.debt].join(' ')} />
        <li className={[styles.navItem, styles.debt].join(' ')}>
          <Link to='/americas-finance-guide/national-debt/' className={`${styles.navLink} explainerSubNav`}
                activeClassName={styles.active} onClick={() => analyticsEvent('Debt')}
          >
            <span className={styles.navLinkText}>Debt</span>
          </Link>
        </li>

      </ul>

    </div>
  )
}
