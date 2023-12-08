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

const DDNav = ({refs}) => {
  const [hover, setHover] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const linksArr = [
    {
      title: 'Introduction',
      id: 'introduction',
      ref: refs.introRefs
    },
    {
      title: 'Preview & Download',
      id: 'preview-and-download',
      ref: refs.dataRef 
    },
    {
      title: 'Dataset Properties',
      id: 'dataset-properties',
      ref: refs.aboutRef 
    },
    {
      title: 'API Quick Guide',
      id: 'api-quick-guide',
      ref: refs.quickGuideRef 
    },
    {
      title: 'Related Datasets',
      id: 'related-datasets',
      ref: refs.relatedRef
    },
  ];
  const handleScroll = () => {
    let currentActive = null;
    linksArr.forEach(link => {
      if (link.ref.current && window.scrollY >= link.ref.current.offsetTop - 100) { // 100 is a tolerance value
        currentActive = link.id;
      }
    });
    setActiveSection(currentActive);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [refs]); 



  const handleInteraction = (e, id) => {
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
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (scrollToId) {
      const targetId = scrollToId;
      setScrollToId(null);
      scroller.scrollTo(targetId, scrollOptions);
    }
  }, [scrollToId]);  

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={menu}>
          {linksArr.map((d, i) => {
            return (
              <Link
              className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''} ${activeSection === d.id ? activeMenu : ''}`}
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
