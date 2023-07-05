import React, { useEffect } from 'react';
import {
  container,
  listItems,
  scrollContainerTop,
  scrollGradient,
} from './scroll-container.module.scss';


const ScrollContainer = ({list, selection, filter, scrollTop, setScrollTop, customChildStyle, children}) => {
  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), {passive: true});

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selection, list, filter]);

  return (
    <>
      <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid="scrollGradient" />
      <div className={container}>
        <div className={listItems} style={customChildStyle} data-testid="scrollContainer">
          {children}
        </div>
      </div>
    </>
  );
}

export default ScrollContainer;
