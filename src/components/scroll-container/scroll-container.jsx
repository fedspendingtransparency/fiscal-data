import React, { useEffect } from 'react';
import {
  container,
  listItems,
  scrollContainerTop,
  scrollGradientTop,
  scrollGradientBottom,
  scrollContainerBottom,
} from './scroll-container.module.scss';

const ScrollContainer = ({ list, selection, filter, scrollTop, setScrollTop, customChildStyle, scrollBottom, setScrollBottom, children }) => {
  const handleScroll = scrollContainer => {
    setScrollTop(scrollContainer.scrollTop === 0);
    console.log(Math.abs(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight)) <= 1);
    if (setScrollBottom) {
      setScrollBottom(Math.abs(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight)) <= 1);
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), { passive: true });

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selection, list, filter]);

  return (
    <>
      <div className={scrollTop ? scrollContainerTop : scrollGradientTop} data-testid="scrollGradient" />
      <div className={container}>
        <div className={listItems} style={customChildStyle} data-testid="scrollContainer">
          {children}
        </div>
      </div>
      <div className={scrollBottom ? scrollContainerBottom : scrollGradientBottom} data-testid="scrollGradient" />
    </>
  );
};

export default ScrollContainer;
