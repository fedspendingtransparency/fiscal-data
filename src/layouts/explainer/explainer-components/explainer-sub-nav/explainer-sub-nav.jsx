import React, {useState, useEffect} from 'react';
import {Link} from 'gatsby';
import {
  backChevron,
  frontChevron,
  navItem,
  overview,
  revenue,
  active,
  navLink,
  navIcon,
  navContainer,
  navBlock,
  navBlockHidden,
  navBlockSticky,
  deficit,
  spending,
  debt,
} from './explainer-sub-nav.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHouseChimney} from '@fortawesome/free-solid-svg-icons';
import Analytics from '../../../../utils/analytics/analytics';

export default function ExplainerSubNav({hidePosition}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(navBlock);

  const handleScroll = () => {
    const prevScrollPosition = scrollPosition;
    const currPosition = window.pageYOffset; //TODO: Look into replacing
    setScrollPosition(currPosition);

    if (currPosition > hidePosition) {
      //Scrolling Down
      if (prevScrollPosition < currPosition) {
        setNavBlockStyle(navBlockHidden);
      } else {
        setNavBlockStyle(navBlockSticky);
      }
    } else {
      setNavBlockStyle(navBlock);
    }
  };

  const analyticsEvent = (title) => {
    Analytics.event({
      category: 'Explainers',
      action: `Sub Nav Click`,
      label: title
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'Sub Nav Click',
      'eventLabel': title,
    });
  }


  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [scrollPosition]);
  return (
    <div className={navContainer} data-testid="explainerSubNav">
      <ul className={navBlockStyle} data-testid="explainerSubNavList">
        <li className={navItem}>
          <Link to='/americas-finance-guide/' className={navLink}
                activeClassName={active} onClick={() => analyticsEvent('Overview')}
          >
            <FontAwesomeIcon icon={faHouseChimney} className={navIcon} />
            <span>Overview</span>
          </Link>
        </li>
        <li className={[frontChevron, overview].join(' ')} />
        <li className={[backChevron, revenue].join(' ')} />
        <li className={[navItem, revenue].join(' ')}>
          <Link to='/americas-finance-guide/government-revenue/' className={navLink}
                activeClassName={active}  onClick={() => analyticsEvent('Revenue')}
          >
            <span>Revenue</span>
          </Link>
        </li>
        <li className={[frontChevron, revenue].join(' ')} />
        <li className={[backChevron, spending].join(' ')} />
        <li className={[navItem, spending].join(' ')}>
          <Link to='/americas-finance-guide/federal-spending/' className={navLink}
                activeClassName={active} onClick={() => analyticsEvent('Spending')}
          >
            <span>Spending</span>
          </Link>
        </li>
        <li className={[frontChevron, spending].join(' ')} />
        <li className={[backChevron, deficit].join(' ')} />
        <li className={[navItem, deficit].join(' ')}>
          <Link to='/americas-finance-guide/national-deficit/' className={navLink}
                activeClassName={active} onClick={() => analyticsEvent('Deficit')}
          >
            <span>Deficit</span>
          </Link>
        </li>
        <li className={[frontChevron, deficit].join(' ')} />
        <li className={[backChevron, debt].join(' ')} />
        <li className={[navItem, debt].join(' ')}>
          <Link to='/americas-finance-guide/national-debt/' className={navLink}
                activeClassName={active} onClick={() => analyticsEvent('Debt')}
          >
            <span>Debt</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
