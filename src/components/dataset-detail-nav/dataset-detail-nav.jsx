import React, { useEffect, useRef, useState } from 'react';
import { activeMenu, container, content, desktopLinks, hoverMenu, menu } from './dataset-detail-nav.module.scss';
import { Events, Link, scroller, scrollSpy } from 'react-scroll';
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
    current: false,
  },
  {
    title: 'Preview & Download',
    id: 'preview-and-download',
    target: true,
    current: false,
  },
  {
    title: 'Dataset Properties',
    id: 'dataset-properties',
    target: true,
    current: false,
  },
  {
    title: 'API Quick Guide',
    id: 'api-quick-guide',
    target: true,
    current: false,
  },
  {
    title: 'Related Datasets',
    id: 'related-datasets',
    target: true,
    current: false,
  },
];

const DDNav = () => {
  const [hover, setHover] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isClickInitiatedScroll, setIsClickInitiatedScroll] = useState(false);
  const navRef = useRef(null);
  const [sections, setSections] = useState(linksArr);

  // For more info on the below useEffect, refer to comments made in secondary-nav.tsx
  useEffect(() => {
    Events.scrollEvent.register('begin', to => {
      if (to) {
        const newArr = linksArr.map(s => (s.id === to ? { ...s, target: true, current: true } : { ...s, target: false, current: false }));
        setSections(newArr);
      }
    });

    Events.scrollEvent.register('end', () => {
      setTimeout(() => {
        const newArr = linksArr.map(section => {
          return {
            ...section,
            target: !section.target ? true : section.target,
          };
        });

        setSections(newArr);
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
          {sections.map((d, i) => {
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
