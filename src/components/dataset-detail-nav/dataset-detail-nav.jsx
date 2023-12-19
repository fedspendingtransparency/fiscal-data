import React, { useEffect, useState, useRef } from 'react';
import { container, menu, activeMenu, desktopLinks, content, hoverMenu } from './dataset-detail-nav.module.scss';
import { Link, scroller } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const scrollOptions = {
  smooth: true,
  spy: true,
  duration: scrollDuration,
  delay: scrollDelay,
  offset: -36,
};

const DDNav = () => {
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
    {
      title: 'Preview & Download',
      id: 'preview-and-download',
    },
    {
      title: 'Dataset Properties',
      id: 'dataset-properties',
    },
    {
      title: 'API Quick Guide',
      id: 'api-quick-guide',
    },
    {
      title: 'Related Datasets',
      id: 'related-datasets',
    },
  ];


  const handleInteraction = (e, id) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    
    if (id) {
      updateAddressPath(id, window.location);
      setHover(null);
      setIsClickInitiatedScroll(true);
      setScrollToId(id);
    }
  };

  const onSetActive = (id) => {
    if (!isClickInitiatedScroll){
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
    if (scrollToId && isClickInitiatedScroll) {
      scroller.scrollTo(scrollToId, scrollOptions);
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
                className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''} ${activeSection === d.id ? activeMenu : ''}`}
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