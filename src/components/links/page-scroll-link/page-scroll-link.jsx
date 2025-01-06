import React from 'react';
import { scroller } from 'react-scroll';
import globalConstants from '../../../helpers/constants';
import { scrollLink } from './page-scroll-link.module.scss';

const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const scrollOffset = -150;
const scrollOptions = {
  smooth: true,
  spy: true,
  duration: scrollDuration,
  delay: scrollDelay,
};

const scrollOptionsOffset = {
  ...scrollOptions,
  offset: scrollOffset,
};

const PageScrollLink = ({ url, dataTestId, id, tabindex = 0, children, handleClick }) => {
  const handleInteraction = (e, url) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (url) {
      const footnoteElem = document.getElementById(url.substr(1));
      scroller.scrollTo(url.substr(1), scrollOptionsOffset);
      setTimeout(() => {
        footnoteElem?.focus({ preventScroll: true });
      }, 500);
    }
  };

  return (
    <span
      data-testid={dataTestId}
      onKeyDown={e => handleInteraction(e, url)}
      onClick={() => handleInteraction(null, url)}
      className={scrollLink}
      id={`${id}-footnote`}
      tabIndex={tabindex}
      role="link"
      // href={url}
    >
      {children}
    </span>
  );
};

export default PageScrollLink;
