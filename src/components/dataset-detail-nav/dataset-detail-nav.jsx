import React, { useEffect, useState, useRef } from 'react';
import { container, menu, activeMenu, desktopLinks, content, hoverMenu } from './dataset-detail-nav.module.scss';
import { Link, scrollSpy, Events, scroller } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const scrollOptions = {
  smooth: true,
  spy: true,
  duration: scrollDuration,
  delay: scrollDelay,
  offset: -112,
};

const linksArr = [
  {
    title: 'Introduction',
    id: 'introduction',
    target: true,
  },
  {
    title: 'Preview & Download',
    id: 'preview-and-download',
    target: true,
  },
  {
    title: 'Dataset Properties',
    id: 'dataset-properties',
    target: true,
  },
  {
    title: 'API Quick Guide',
    id: 'api-quick-guide',
    target: true,
  },
  {
    title: 'Related Datasets',
    id: 'related-datasets',
    target: true,
  },
];

const DDNav = () => {
  const [hover, setHover] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isClickInitiatedScroll, setIsClickInitiatedScroll] = useState(false);
  const navRef = useRef(null);

  // For more info on the below useEffect, refer to comments made in secondary-nav.tsx
  useEffect(() => {
    Events.scrollEvent.register('begin', to => {
      linksArr.forEach(s => {
        s.target = false;
      });

      if (to) {
        const section = linksArr.find(s => s.id === to);
        section.target = true;
        section.current = true;
      }
    });

    Events.scrollEvent.register('end', () => {
      setTimeout(() => {
        linksArr.forEach(section => {
          if (!section.target) {
            section.target = true;
          }
          if (section.current) {
            section.current = false;
          }
        });
      }, 100);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

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
                className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''} ${d.target && d.current && activeMenu}`}
                key={`DDNavDesktopLink${i}`}
                data-testid={`DDNavDesktopLink${i}`}
                aria-label={`Jump to ${d.title} section`}
                to={d.id}
                onSetActive={onSetActive}
                activeClass={d.target ? activeMenu : ''}
                onClick={() => handleInteraction(null, d.id)}
                onKeyDown={e => handleInteraction(e, d.id)}
                tabIndex={0}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                offset={scrollOptions.offset + 4}
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
