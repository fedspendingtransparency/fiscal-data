import React, { useEffect, useState } from 'react';
import { SmoothScroll } from '../smooth-scroll/smooth-scroll';
import { container, mobileIcon, menu, mobile, activeMenu, disabledLink, desktopLinks, content } from './dataset-detail-nav.module.scss';
import { select, selectAll } from 'd3-selection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as Scroll from 'react-scroll';
import { Link } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
import { sectionLink } from '../secondary-nav/secondary-nav.module.scss';

// const d3 = { select, selectAll };

const breakpoint = {
  desktop: 992,
  tablet: 600,
};
const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

// const scrollOptions = {
//   smooth: false,
//   spy: false,
//   duration: 0,
//   delay: 0,
// };

const DDNav = ({ title }) => {
  const [links, setLinks] = useState([]);
  const [isMobile, setIsMobile] = useState(true);
  // const [scrollInstance] = useState(new SmoothScroll());
  const [mobileIdx, setMobileIdx] = useState(0);
  // const [offsetHeight, setOffsetHeight] = useState(0);
  // const [scrollToId, setScrollToId] = useState(null);
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [lastScrollPosition, setLastScrollPosition] = useState(0);

  // let debounce, previousWidth;

  const linksArr = [
    {
      title: 'Introduction',
      href: 'introduction',
    },
    {
      title: 'About This Dataset',
      href: 'about-this-dataset',
    },
    {
      title: 'Preview & Download',
      href: 'preview-and-download',
    },
    {
      title: 'API Quick Guide',
      href: 'api-quick-guide',
    },
    {
      title: 'Related Datasets',
      href: 'related-datasets',
    },
  ];

  const linksCnt = linksArr.length;

  const setMobileLinks = idx => {
    const mobileLinks = [];

    if (idx <= 0 || idx >= linksCnt - 1) {
      const disabledObject = {
        disabled: true,
      };

      if (idx <= 0) {
        mobileLinks.push(disabledObject, linksArr[1]);
      } else {
        mobileLinks.push(linksArr[linksCnt - 2], disabledObject);
      }
    } else {
      mobileLinks.push(linksArr[idx - 1], linksArr[idx + 1]);
    }

    setMobileIdx(idx);
    setLinks(mobileLinks);
  };

  const updateMobileLinks = i => {
    const idxAdjust = i === 1 ? 1 : -1;
    const newIdx = mobileIdx + idxAdjust;
    setMobileLinks(newIdx);
  };

  const handleInteraction = (e, id) => {
    // only proceed on mouse click or Enter key press
    // if (e?.key && e.key !== 'Enter') {
    //   return;
    // }

    if (id) {
      // navigate to page section
      // setTocIsOpen(false);
      updateAddressPath(id, window.location);
      // setScrollToId(id);
    }
    // setLastScrollPosition(scrollPosition);
  };

  // useEffect(() => {
  //   const handleSelectLink = e => {
  //     const { target, key, className } = e.target;
  //     if (target && key === 'Enter' && className.includes(sectionLink)) {
  //       target.click();
  //     }
  //   };
  //
  //   const handleScroll = () => {
  //     setScrollPosition(window.pageYOffset);
  //   };
  //
  //   window.addEventListener('scroll', handleScroll);
  //   window.addEventListener('keyup', handleSelectLink);
  //
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     window.removeEventListener('keyup', handleSelectLink);
  //   };
  // }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileLinks(mobileIdx);
    } else {
      setLinks(linksArr);
    }
  }, [isMobile]);

  const responsiveLinks = () => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // useEffect(() => {
  //   const header = d3.select(`#${container}`);
  //   let headerHeight = 0;
  //
  //   if (!header.empty()) {
  //     headerHeight = header.node().getBoundingClientRect().height;
  //   }
  //   setOffsetHeight(headerHeight, 10);
  //
  //   window.addEventListener('resize', function() {
  //     if (previousWidth === window.innerWidth) {
  //       return;
  //     }
  //
  //     if (debounce) {
  //       clearTimeout(debounce);
  //     }
  //
  //     previousWidth = window.innerWidth;
  //
  //     debounce = setTimeout(responsiveLinks, 50);
  //   });
  // }, []);

  useEffect(() => {
    responsiveLinks();
  });

  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={`${menu} ${isMobile ? mobile : ''}`}>
          {!isMobile
            ? links.map((d, i) => {
                return (
                  <Link
                    className={desktopLinks}
                    key={`DDNavDesktopLink${i}`}
                    data-testid={`DDNavDesktopLink${i}`}
                    aria-label={`Jump to ${d.title} section`}
                    to={d.href}
                    activeClass={activeMenu}
                    smooth
                    spy
                    duration={scrollDuration}
                    delay={scrollDelay}
                    onClick={() => handleInteraction(null, d.href)}
                    tabIndex={0}
                  >
                    {d.title}
                  </Link>
                );
              })
            : links.map((d, i) => {
                return d.disabled ? (
                  <FontAwesomeIcon
                    key={`DDDisabledNavMobileLink${i}`}
                    icon={i === 1 ? faArrowDown : faArrowUp}
                    className={`${mobileIcon} ${disabledLink}`}
                  />
                ) : (
                  <a
                    key={`DDNavMobileLink${i}`}
                    data-testid={`DDNavMobileLink${i}`}
                    aria-label={`Jump to ${d.title} section`}
                    title={d.title}
                    onClick={() => {
                      updateMobileLinks(i);
                    }}
                    href={d.href}
                  >
                    <FontAwesomeIcon className={mobileIcon} icon={i === 1 ? faArrowDown : faArrowUp} />
                  </a>
                );
              })}
        </div>
      </div>
    </section>
  );
};
export default DDNav;
