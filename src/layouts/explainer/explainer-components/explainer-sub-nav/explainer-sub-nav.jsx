import React, {useState, useEffect} from 'react'
import {Link} from "gatsby"
import * as styles from './explainer-sub-nav.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";

export default function ExplainerSubNav({hidePosition}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(styles.navBlock);

  const handleScroll = () => {
    let position = window.pageYOffset;
    setPreviousScrollPosition(scrollPosition);
    setScrollPosition(position);


    if (position > hidePosition) {
      //Scrolling Down
      if (previousScrollPosition < scrollPosition) {
        setNavBlockStyle(styles.navBlockHidden)
      } else {
        setNavBlockStyle(styles.navBlockSticky)
      }
    } else {
      setNavBlockStyle(styles.navBlock)
    }
  };


  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [scrollPosition]);

  return (
    <div id={styles.navContainer} data-testid="explainerSubNav">
      <ul className={navBlockStyle}>
        <li className={[styles.navItem, styles.noverview, styles.nactive].join(' ')}>
          <Link to='/americas-finance-guide/' className={styles.navLink} activeClassName={styles.active}>
            <FontAwesomeIcon icon={faHouseChimney} className={styles.navIcon}/>
            <span className={styles.navLinkText}>Overview</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.overview].join(' ')}></li>
        <li className={[styles.backChevron, styles.revenue].join(' ')}></li>
        <li className={[styles.navItem, styles.revenue].join(' ')}>
          <Link to='/americas-finance-guide/government-revenue/' className={styles.navLink}
                activeClassName={styles.active}>
            <span className={styles.navLinkText}>Revenue</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.revenue].join(' ')}></li>
        <li className={[styles.backChevron, styles.spending].join(' ')}></li>
        <li className={[styles.navItem, styles.spending].join(' ')}>
          <Link to='/americas-finance-guide/federal-spending/' className={styles.navLink}
                activeClassName={styles.active}>
            <span className={styles.navLinkText}>Spending</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.spending].join(' ')}></li>
        <li className={[styles.backChevron, styles.deficit].join(' ')}></li>
        <li className={[styles.navItem, styles.deficit].join(' ')}>
          <Link to='/americas-finance-guide/national-deficit/' className={styles.navLink}
                activeClassName={styles.active}>
            <span className={styles.navLinkText}>Deficit</span>
          </Link>
        </li>
        <li className={[styles.frontChevron, styles.deficit].join(' ')}></li>
        <li className={[styles.backChevron, styles.debt].join(' ')}></li>
        <li className={[styles.navItem, styles.debt].join(' ')}>
          <Link to='/americas-finance-guide/national-debt/' className={styles.navLink} activeClassName={styles.active}>
            <span className={styles.navLinkText}>Debt</span>
          </Link>
        </li>

      </ul>

    </div>
  )
}
