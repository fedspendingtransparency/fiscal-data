import React, {useEffect, useState} from 'react';
import {SmoothScroll} from '../smooth-scroll/smooth-scroll';
import * as styles from './dataset-detail-nav.module.scss';
import { select, selectAll } from "d3-selection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";

const d3 = { select, selectAll };

const breakpoint = {
  desktop: 992,
  tablet: 600
};

const DDNav = ({title}) => {
  const [links, setLinks] = useState([]);
  const [isMobile, setIsMobile] = useState(true);
  const [scrollInstance] = useState(new SmoothScroll());
  const [mobileIdx, setMobileIdx] = useState(0);
  const [offsetHeight, setOffsetHeight] = useState(0);
  let debounce, previousWidth;

  const linksArr = [
    {
      title: 'About This Dataset',
      href: '#about-this-dataset'
    },
    {
      title: 'Preview & Download',
      href: '#preview-and-download'
    },    {
      title: 'API Quick Guide',
      href: '#api-quick-guide'
    },    {
      title: 'Related Datasets',
      href: '#related-datasets'
    }
  ];

  const linksCnt = linksArr.length;

  const setMobileLinks = idx => {
    const mobileLinks = [];

    if(idx <= 0 || idx >= linksCnt - 1){
      const disabledObject = {
        disabled: true
      };

      if(idx <= 0){
        mobileLinks.push(disabledObject,linksArr[1]);
      } else {
        mobileLinks.push(linksArr[linksCnt - 2],disabledObject)
      }
    } else {
      mobileLinks.push(linksArr[idx - 1],linksArr[idx + 1]);
    }

    setMobileIdx(idx);
    setLinks(mobileLinks);
  };

  const updateMobileLinks = i => {
    const idxAdjust = (i === 1) ? 1 : -1;
    const newIdx = mobileIdx + idxAdjust;
    setMobileLinks(newIdx);
  };

  useEffect(() => {
    d3.select('.' + styles.menu)
      .selectAll('a')
      .each(function(){
        const el = d3.select(this).node();
        scrollInstance.attachClickHandlers(el, offsetHeight);
      });
  }, [links]);

  useEffect(() => {
    if(isMobile){
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

  useEffect(() => {
    const header = d3.select(`#${styles.container}`);
    let headerHeight = 0;

    if(!header.empty()){
      headerHeight = header.node().getBoundingClientRect().height;
    }
    setOffsetHeight(headerHeight, 10);


    window.addEventListener('resize', function () {
      if (previousWidth === window.innerWidth) {
        return;
      }

      if (debounce) {
        clearTimeout(debounce);
      }

      previousWidth = window.innerWidth;

      debounce = setTimeout(responsiveLinks, 50);
    });
  }, []);

  useEffect(() => {
    responsiveLinks();
  });

  return (
    <section id={styles.container}>
      <div className={styles.content}>
        <div data-testid="DDNavTitle" className={styles.title} title={title}>
          {title}
        </div>
        <div data-testid="DDNavMenu" className={`${styles.menu} ${isMobile ? styles.mobile : ''}`}>
          {
            !isMobile
              ?
                links.map((d, i) => {
                  return <a className={styles.desktopLinks}
                            key={`DDNavDesktopLink${i}`}
                            data-testid={`DDNavDesktopLink${i}`}
                            aria-label={`Jump to ${d.title} section`}
                            href={d.href}
                         >{d.title}
                         </a>
                })
            :
                links.map((d,i) => {
                  return d.disabled ?
                      <FontAwesomeIcon key={`DDDisabledNavMobileLink${i}`} icon={i === 1 ? faArrowDown : faArrowUp}
                                       className={`${styles.mobileIcon} ${styles.disabledLink}`}
                      />
                    :
                      <a key={`DDNavMobileLink${i}`}
                         data-testid={`DDNavMobileLink${i}`}
                         aria-label={`Jump to ${d.title} section`}
                         title={d.title}
                         onClick={() => {
                          updateMobileLinks(i)
                         }}
                         href={d.href}
                      >
                            <FontAwesomeIcon className={styles.mobileIcon} icon={i === 1 ? faArrowDown : faArrowUp} />
                      </a>
                  })
          }
        </div>
      </div>
    </section>
  );
};
export default DDNav;
