import React, { useState, useEffect, FunctionComponent } from 'react';
import { Link, scrollSpy, Events, animateScroll, Element, scroller } from 'react-scroll';
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
  linkContainer,
  sectionLink,
  headingLevel2,
  headingLevel3,
  comingSoon,
  comingSoonContainer,
  comingSoonLink,
} from './secondary-nav.module.scss';
import globalConstants from '../../helpers/constants';
import Analytics from '../../utils/analytics/analytics';

export const scrollDelay: number = globalConstants.config.smooth_scroll.delay;
export const scrollDuration: number = globalConstants.config.smooth_scroll.duration;

export const scrollOptions = {
  smooth: false,
  spy: false,
  duration: 0,
  delay: 0,
};

export const globalNavOffset = -48;

export const SecondaryNav: FunctionComponent<ISecondaryNav> = ({
  sections,
  activeClass,
  hoverClass,
  linkClass,
  analytics,
  analyticsCategory,
  analyticsPageLabel,
  width,
  headerComponent,
  children,
  tocScrollOffset,
}) => {
  const [hoveredSection, setHoveredSection] = useState<number>(-1);
  const [tocIsOpen, setTocIsOpen] = useState<boolean>(false);
  const [scrollToId, setScrollToId] = useState<string>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [lastScrollPosition, setLastScrollPosition] = useState<number>(0);

  const ScrollTarget = Element;
  const scrollToTop = tocScrollOffset === undefined; // no offset, so scroll to TOP for TOC

  const analyticsClickHandler = section => {
    Analytics.event({
      category: analyticsCategory,
      action: `Left Nav Click`,
      label: `${analyticsPageLabel} - ${section}`,
    });
  };

  const handleMouseEnter: (index: number) => void = index => {
    setHoveredSection(index);
  };

  const handleMouseLeave: () => void = () => {
    setHoveredSection(-1);
  };

  const handleInteraction = (e, id?, title?) => {
    if (analytics) {
      analyticsClickHandler(title);
    }
    // only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (id) {
      // navigate to page section
      setTocIsOpen(false);
      updateAddressPath(id, window.location);
      setScrollToId(id);
    } else if (!tocIsOpen) {
      // scroll to and open TOC
      if (!scrollToTop) {
        // opening TOC on page with TOC scrollTo target (i.e. AFG Explainers)
        setScrollToId('table-of-contents');
      } else {
        // no TOC target element so just scroll to top of page
        setTocIsOpen(true);
        animateScroll.scrollToTop(scrollOptions);
      }
    } else {
      // no target ID and TOC is open so cancel and return to last position
      setTocIsOpen(false);
      animateScroll.scrollTo(lastScrollPosition, scrollOptions);
    }
    setLastScrollPosition(scrollPosition);
  };

  useEffect(() => {
    const handleSelectLink: (e) => void = e => {
      const { target, key, className } = e.target;
      if (target && key === 'Enter' && className.includes(sectionLink)) {
        target.click();
      }
    };

    const handleScroll: () => void = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keyup', handleSelectLink);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleSelectLink);
    };
  }, []);

  // The below useEffect block handles the active section scroll interaction.
  // When the user clicks on a section to scroll to in the nav, all sections save for the selected one have target set to false.
  // This ensures that the active class is only applied to the selected section. The current selected section is also tracked via the 'current'
  // property. This property ensures the active styling can be applied to the section BEFORE the scroll to that section has completed.
  // Finally, on scroll end the target property is set to true for all sections, ensuring the active class is properly applied when the
  // user scrolls normally.
  // TODO: Turn the below code into a custom hook?
  useEffect(() => {
    Events.scrollEvent.register('begin', to => {
      sections.forEach(s => {
        s.target = false;
      });

      if (to) {
        const section = sections.find(s => s.id === to);
        if (section) {
          section.target = true;
          section.current = true;
        }
      }
    });

    Events.scrollEvent.register('end', () => {
      setTimeout(() => {
        sections.forEach(section => {
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

  useEffect(() => {
    // This is for mobile usage, when switching between toc and page content.

    if (scrollToId) {
      const targetId = scrollToId; // local variable not impacted by state change
      setScrollToId(null);

      //TODO: Find out if this conditional block is needed (if we are calling scrollTo when we don't need to)
      if (scrollToId === 'table-of-contents') {
        // configure instant scroll for opening TOC
        scroller.scrollTo(targetId, {
          offset: tocScrollOffset - 5,
          ...scrollOptions,
        });
        // don't toggle TOC/Content until scrolling starts to prevent jarring UX
        setTimeout(() => {
          setTocIsOpen(true);
        });
        // set a minimal delay then scroll down to clear scroll-up-sticky that gets in the way
        setTimeout(() => {
          const scroll = animateScroll;
          scroll.scrollMore(5);
        }, 10);
      } else {
        // scroll with animation duration to navigate away from TOC
        scroller.scrollTo(targetId, {
          smooth: true,
          spy: true,
          duration: scrollDuration,
          delay: scrollDelay,
          offset: globalNavOffset,
        });
        setTocIsOpen(false);
      }
    }
  }, [scrollToId]);

  const shouldTocShow: boolean = width >= pxToNumber(breakpointLg) || (width < pxToNumber(breakpointLg) && tocIsOpen);
  const shouldContentShow: boolean = width >= pxToNumber(breakpointLg) || (width < pxToNumber(breakpointLg) && !tocIsOpen);

  return (
    <div className={mainContainer}>
      <div className={`${navContainer} secondaryNavContainer`}>
        {!scrollToTop && <ScrollTarget name="table-of-contents" />}
        {shouldTocShow && headerComponent}
        {shouldTocShow &&
          sections.map(s => {
            let headingClass = '';
            if (s.headingLevel === 2) {
              headingClass = headingLevel2;
            } else if (s.headingLevel === 3) {
              headingClass = headingLevel3;
            }

            return (
              <div key={s.index}>
                {s.comingSoon ? (
                  <div className={comingSoonContainer}>
                    <i className={comingSoon}>COMING SOON!</i>
                  </div>
                ) : (
                  undefined
                )}
                <div
                  role="button"
                  tabIndex={-1}
                  onMouseEnter={() => handleMouseEnter(s.index)}
                  onMouseLeave={handleMouseLeave}
                  className={`${linkContainer} ${hoveredSection === s.index ? hoverClass : ''}`}
                >
                  <Link
                    className={`${sectionLink} navSectionLink ${headingClass} ${linkClass || defaultLink}
                    ${s.comingSoon ? comingSoonLink : undefined} ${s.target && s.current && activeClass}`}
                    title={s.title}
                    activeClass={s.target ? activeClass : ''}
                    tabIndex={0}
                    to={s.id}
                    smooth
                    spy
                    duration={scrollDuration}
                    delay={scrollDelay}
                    onClick={() => handleInteraction(null, s.id, s.title)}
                    onKeyPress={e => handleInteraction(e, s.id, s.title)}
                    offset={globalNavOffset}
                  >
                    {s.title}
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
      <div className={`${navigableContent} ${shouldContentShow ? '' : 'hidden'}`}>{children}</div>
      <TOCButton handleToggle={handleInteraction} state={tocIsOpen} />
    </div>
  );
};

export default withWindowSize(SecondaryNav);
