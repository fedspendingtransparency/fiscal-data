import React, { useEffect, useState, useRef } from 'react';
import { container, menu, activeMenu, desktopLinks, content, hoverMenu } from './dataset-detail-nav.module.scss';
import { Link, scroller } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
import Analytics from '../../utils/analytics/analytics';
import ENV_ID from 'gatsby-env-variables';

const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const scrollOffset = -112;
const scrollOptions = {
  smooth: true,
  spy: true,
  duration: scrollDuration,
  delay: scrollDelay,
};

const scrollOptionsOffset = {
  ...scrollOptions,
  offset: scrollOffset,
};

const DDNav = ({ hasPublishedReports }) => {
  const [hover, setHover] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isClickInitiatedScroll, setIsClickInitiatedScroll] = useState(false);
  const navRef = useRef(null);

  const linksArr = [
    {
      title: 'Introduction',
      id: 'introduction',
    },
    ...(hasPublishedReports
      ? [
          {
            title: 'Reports and Files',
            id: 'reports-and-files',
          },
        ]
      : []),

    {
      title: 'Data Preview',
      id: 'data-table',
    },
    {
      title: 'Dataset Properties',
      id: 'dataset-properties',
    },
    {
      title: 'API Quick Guide',
      id: 'api-quick-guide',
    },
  ];

  const handleInteraction = (e, id) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (id) {
      Analytics.event({
        category: 'Dataset Sub Nav',
        action: 'Dataset Sub Nav Click',
        label: id,
      });
      updateAddressPath(id, window.location);
      setHover(null);
      setIsClickInitiatedScroll(true);
      setScrollToId(id);
    }
  };

  const onSetActive = id => {
    if (!isClickInitiatedScroll) {
      setActiveSection(id);
    }
  };

  const updateScrollBarPosition = () => {
    if (navRef.current && activeSection) {
      const activeLink = navRef.current.querySelector(`.${desktopLinks}.${activeMenu}`);
      if (activeLink) {
        const scrollPosition = activeLink.offsetLeft;
        navRef.current.scrollLeft = scrollPosition;
      }
    }
  };

  useEffect(() => {
    updateScrollBarPosition();
  }, [activeSection]);

  useEffect(() => {
    if (!activeSection && navRef.current) {
      setActiveSection(null);
      navRef.current.scrollLeft = 0;
    }
  }, [activeSection]);

  useEffect(() => {
    if (scrollToId && isClickInitiatedScroll) {
      scroller.scrollTo(scrollToId, scrollOptionsOffset);
      setIsClickInitiatedScroll(false);
    }
  }, [scrollToId, isClickInitiatedScroll]);

  return (
    <section id={container}>
      <div className={content} ref={navRef}>
        <div data-testid="DDNavMenu" className={menu}>
          {linksArr.map((d, i) => {
            return (
              <Link
                className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''}`}
                key={`DDNavDesktopLink${i}`}
                data-testid={`DDNavDesktopLink${i}`}
                aria-label={`Jump to ${d.title} section`}
                to={d.id}
                onSetActive={onSetActive}
                activeClass={activeMenu}
                onClick={() => handleInteraction(null, d.id)}
                onKeyDown={e => handleInteraction(e, d.id)}
                tabIndex={0}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                offset={scrollOffset - 4}
                {...scrollOptions}
              >
                {d.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default DDNav;
