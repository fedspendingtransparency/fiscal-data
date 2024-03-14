import React, { useEffect, useState } from 'react';
import {
  container,
  listItems,
  scrollContainerTop,
  scrollGradientTop,
  scrollGradientBottom,
  scrollContainerBottom,
} from './scroll-container.module.scss';

const ScrollContainer = ({
  deps = [],
  gradientColor = 'white',
  bottomGradient = false,
  testId = '',
  customChildStyle = null,
  customContainerStyle = null,
  children,
}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [scrollBottom, setScrollBottom] = useState(false);
  const handleScroll = scrollContainer => {
    setScrollTop(scrollContainer.scrollTop === 0);
    if (bottomGradient) {
      setScrollBottom(Math.abs(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight)) <= 1);
    }
  };

  const dataTestId = 'scrollContainer' + testId;

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
        style={scrollTop ? {} : { background: `linear-gradient(${gradientColor}, rgba(255, 255, 255, 0))` }}
        data-testid="scrollGradient"
      />
      <div className={container} style={customContainerStyle}>
        <div className={listItems} style={customChildStyle} data-testid={dataTestId}>
          {children}
        </div>
      </div>
      {bottomGradient && (
        <div
          className={scrollBottom ? scrollContainerBottom : scrollGradientBottom}
          style={scrollBottom ? {} : { background: `linear-gradient( rgba(255, 255, 255, 0), ${gradientColor})` }}
          data-testid="scrollGradient"
        />
      )}
    </>
  );
};

export default ScrollContainer;
