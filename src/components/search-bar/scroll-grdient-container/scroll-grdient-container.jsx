import React, { useEffect } from 'react';
import {
  container,
  listItems,
  scrollContainerTop,
  scrollGradient,
} from './scroll-grdient-container.module.scss';


const ScrollGradientContainer = ({list, selection, scrollTop, setScrollTop, customChildStyle, children}) => {
  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');

    if(scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), {passive: true});

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selection, list]);

  return (
    <>
      <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid="scrollGradient" />
      <div className={container}  data-testid="scrollContainer">
        <div className={listItems} style={customChildStyle}>
          {children}
        </div>
      </div>
    </>
  );
}

export default ScrollGradientContainer;
