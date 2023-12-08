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
  const [activeSection, setActiveSection] = useState(null);
  const [hover, setHover] = useState(null);
  const [orderedLinks, setOrderedLinks] = useState([    {
    title: 'Introduction',
    id: 'introduction',
    ref: refs.introRef
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
  },])

  const linksArr = [
    {
      title: 'Introduction',
      id: 'introduction',
      ref: refs.introRef
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
    for (let link of orderedLinks) {
      if(link.ref.current && window.scrollY >= link.ref.currentoffsetTop - 100) {
        setActiveSection(link.id);
        break;
      }
    }
  };

  useEffect(() => {
    if (activeSection) {
      setOrderedLinks(prevLinks => {
        let newList = prevLinks.filter(link => link.id !==activeSection);
        newList.push(prevLinks.find(link => link.id === activeSection));
        return newList;
      });
    }
  }, [activeSection])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [orderedLinks]);


  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={menu}>
          {orderedLinks.map((link, i) => (
            <Link
              className={`${desktopLinks} ${hover === link.id ? hoverMenu : ''}`}
              key={`DDNavDesktopLink${i}`}
              data-testid={`DDNavDesktopLink${i}`}
              aria-label={`Jump to ${link.title} section`}
              activeClass={activeMenu}
              to={link.id}
              {...scrollOptions}
              onMouseEnter={() => setHover(link.id)}
              onMouseLeave={() => setHover(null)}
            >
              {link.title}
              {console.log('order: ', orderedLinks)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DDNav;
