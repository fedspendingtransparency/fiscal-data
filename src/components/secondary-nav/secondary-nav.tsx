import React, { useState, useEffect, FunctionComponent } from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import * as Scroll from 'react-scroll';
import { Link } from 'react-scroll';
import { withWindowSize } from 'react-fns';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import TOCButton from '../table-of-contents/toc-button/toc-button';
import { breakpointLg } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { ISecondaryNav } from '../../models/ISecondaryNav';

import {
  defaultLink,
  mainContainer,
  navContainer,
  navigableContent,
  sectionLink,
  headingLevel2,
  headingLevel3
} from './secondary-nav.module.scss';
import globalConstants from '../../helpers/constants';

export const scrollDelay: number = globalConstants.config.smooth_scroll.delay;
export const scrollDuration: number = globalConstants.config.smooth_scroll.duration;

export const scrollOptions = {
  smooth: true,
  spy: true,
  duration: 0,
  delay: 0
};

export const SecondaryNav: FunctionComponent<ISecondaryNav> = ({
  sections,
  activeClass,
  hoverClass,
  linkClass,
  width,
  headerComponent,
  children
}) => {
  const [hoveredSection, setHoveredSection] = useState<number>(-1);
  const [tocIsOpen, setTocIsOpen] = useState<boolean>(false);
  const [scrollToId, setScrollToId] = useState<string>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [lastScrollPosition, setLastScrollPosition] = useState<number>(0);

  const handleMouseEnter: (index: number) => void = (index) => {
    setHoveredSection(index);
  }

  const handleMouseLeave: () => void = () => {
    setHoveredSection(-1);
  }

  const handleInteraction = (e, id) => {
    // only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (id) {
      setScrollToId(id);
      updateAddressPath(id, window.location);
    } else if (!tocIsOpen) {
      Scroll.animateScroll.scrollToTop(scrollOptions);
    } else {
      Scroll.animateScroll.scrollTo(lastScrollPosition, scrollOptions);
    }

    setLastScrollPosition(scrollPosition);
    setTocIsOpen((prevState) => !prevState);
  }

  useEffect(() => {
    const handleSelectLink: (e) => void = (e) => {
      const { target, key, className } = e.target;
      if (target && key === 'Enter' && className.includes(sectionLink)) {
        target.click();
      }
    };

    const handleScroll: () => void = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll',  handleScroll);
    window.addEventListener('keyup', handleSelectLink);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleSelectLink);
    };
  }, []);

  useEffect(() => {
    // This is for mobile usage, when switching between toc and page content.
    if (scrollToId) {
      Scroll.scroller.scrollTo(scrollToId, {
        smooth: true,
        spy: true,
        duration: scrollDuration,
        delay: scrollDelay
      });

      setScrollToId(null);
    }
  }, [tocIsOpen]);

  const shouldTocShow: boolean = (
    width >= pxToNumber(breakpointLg) ||
    (width < pxToNumber(breakpointLg) && tocIsOpen)
  );
  const shouldContentShow: boolean = (
    width >= pxToNumber(breakpointLg) ||
    (width < pxToNumber(breakpointLg) && !tocIsOpen)
  );

  return (
    <div className={mainContainer}>
      <div className={`${navContainer} secondaryNavContainer`}>
        {shouldTocShow && headerComponent}
        {shouldTocShow && sections.map((s) => {
          let headingClass = '';
          if (s.headingLevel === 2) {
            headingClass = headingLevel2;
          } else if (s.headingLevel === 3) {
            headingClass = headingLevel3;
          }

          return (
            <div
              key={s.index}
              onMouseEnter={() => handleMouseEnter(s.index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                className={
                  `${sectionLink} navSectionLink ${headingClass} ${linkClass || defaultLink} ${hoveredSection === s.index ? hoverClass : ''}`
                }
                title={s.title}
                activeClass={activeClass}
                tabIndex={0}
                to={s.id}
                smooth
                spy
                duration={scrollDuration}
                delay={scrollDelay}
                onClick={() => handleInteraction(null, s.id)}
                onKeyPress={(e) => handleInteraction(e, s.id)}
              >
                {s.title}
              </Link>
            </div>
          )
        })}
      </div>
      <div className={`${navigableContent} ${shouldContentShow ? '' : 'hidden'}`}>
        {children}
      </div>
      <TOCButton handleToggle={handleInteraction} state={tocIsOpen} />
    </div>
  )
}

export default withWindowSize(SecondaryNav);
