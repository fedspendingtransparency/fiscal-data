import React, { useEffect, useState } from 'react';
import {
  container,
  listItems,
  scrollContainerBottom,
  scrollContainerTop,
  scrollGradientBottom,
  scrollGradientTop,
} from './scroll-container.module.scss';

const ScrollContainer = ({
  deps = [],
  gradientColor = 'white',
  bottomGradient = false,
  testId = '',
  customChildStyle = null,
  customContainerStyle = null,
  customGradientStyle = null,
  children,
}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [scrollBottom, setScrollBottom] = useState(false);
  const [scrollBarWidth, setScrollBarWidth] = useState(0);

  const handleScroll = scrollContainer => {
    setScrollTop(scrollContainer.scrollTop === 0);
    if (bottomGradient) {
      setScrollBottom(Math.abs(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight)) <= 1);
    }
  };

  const dataTestId = 'scrollContainer' + testId;

  useEffect(() => {
    //Get the width of the scroll bar so that the gradient does not overlay that
    const scrollContainer = document.querySelector(`[data-testid=${dataTestId}]`);
    const scrollWidth = scrollContainer?.offsetWidth - scrollContainer?.clientWidth;
    if (scrollWidth) {
      setScrollBarWidth(scrollWidth);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector(`[data-testid=${dataTestId}]`);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), { passive: true });

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [...deps]);

  return (
    <>
      <div
        className={scrollTop ? scrollContainerTop : scrollGradientTop}
        style={
          scrollTop
            ? { ...customGradientStyle }
            : { background: `linear-gradient(${gradientColor}, rgba(255, 255, 255, 0))`, marginRight: scrollBarWidth + 'px', ...customGradientStyle }
        }
        data-testid="topScrollGradient"
      />
      <div className={container} style={customContainerStyle}>
        <div className={listItems} style={{ ...customChildStyle }} data-testid={dataTestId}>
          {children}
        </div>
      </div>
      {bottomGradient && (
        <div
          className={scrollBottom ? scrollContainerBottom : scrollGradientBottom}
          style={scrollBottom ? {} : { background: `linear-gradient( rgba(255, 255, 255, 0), ${gradientColor})`, marginRight: scrollBarWidth + 'px' }}
          data-testid="bottomScrollGradient"
        />
      )}
    </>
  );
};

export default ScrollContainer;
