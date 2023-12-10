import React, { useEffect, useState } from 'react';
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

  const initialLinks = [
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
  const [linksArr, setLinksArr] = useState(initialLinks);

  const updateLinksArr = (currentSection) => {
    const currentIndex = linksArr.findIndex(link => link.id === currentSection);
    if (currentIndex === -1) return linksArr;
    console.log(currentIndex);
    return [
      ...linksArr.slice(currentIndex),
      ...linksArr.slice(0, currentIndex)
    ];
  };

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
      const updatedLinks = updateLinksArr(currentSection);
      setLinksArr(updatedLinks);}
    }
  };

  const handleResize = () => {
    if (window.innerHeight >= 992){
      setLinksArr(initialLinks);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
    if (scrollToId) {
      const targetId = scrollToId;
      setScrollToId(null);
      scroller.scrollTo(targetId, scrollOptions);
    }
  }, [scrollToId]);

  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={menu}>
          {linksArr.map((d, i) => {
            return (
              <Link
                className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''}`}
                key={`DDNavDesktopLink${i}`}
                data-testid={`DDNavDesktopLink${i}`}
                aria-label={`Jump to ${d.title} section`}
                to={d.id}
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