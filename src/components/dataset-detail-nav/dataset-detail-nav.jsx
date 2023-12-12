import React, { useEffect, useState, useRef } from 'react';
import { container, menu, activeMenu, desktopLinks, content, hoverMenu } from './dataset-detail-nav.module.scss';
import { Link } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
import { scroller } from 'react-scroll';
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

  const getCurrentSection = () => {
    let currentSection = '';

    linksArr.forEach(link => {
        const section = document.getElementById(link.id);
        if(section) {        
        const sectionTop = section.offsetTop;
        const sectionHeigh = section.clientHeight;
        const scrollPosition = window.scrollY + window.innerWidth / 10000;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeigh) {
          currentSection = link.id;
        }
      }
    });
    return currentSection;
  };
  

  const handleScroll = () => {
    if (window.innerWidth < 992) {
      const currentSection = getCurrentSection();
      if (currentSection){
}
    }
  };


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [linksArr])

  const handleInteraction = (e, id) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    
    if (id) {
      updateAddressPath(id, window.location);
      setHover(null);
      setScrollToId(id);
    }
  };
  useEffect(() => {
    const updateScrollBarPosition = () => {

      if (navRef.current && hover || navRef.current && activeSection) {
        const activeLink = navRef.current.querySelector(`.${desktopLinks}.${activeMenu}`);
        if (activeLink) {
          const scrollPosition = activeLink.offsetLeft + activeLink.offsetWidth  - navRef.current.offsetWidth;
          navRef.current.scrollLeft = scrollPosition;
        }
      }
    };
    updateScrollBarPosition();
  }, [hover, activeSection]); 



  useEffect(() => {
    if (scrollToId) {
      const targetId = scrollToId;
      setScrollToId(null);
      scroller.scrollTo(targetId, scrollOptions);
      navRef.current.scrollLeft = scroller.scrollTo(targetId, scrollOptions);
    }
  }, [scrollToId,]);

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
                onSetActive={setActiveSection}
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