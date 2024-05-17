import React from 'react';
import { scroller } from 'react-scroll';
import globalConstants from '../../../helpers/constants';
import { scrollLink } from './page-scroll-link.module.scss';

const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const scrollOffset = -50;
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

const PageScrollLink = ({ url, dataTestId, id, tabindex = 0, children }) => {
  const handleInteraction = (e, url) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (url) {
      scroller.scrollTo(url.substr(1), scrollOptionsOffset);
    }
  };

  return (
    <div
      data-testid={dataTestId}
      onKeyDown={e => handleInteraction(e, url)}
      onClick={() => handleInteraction(null, url)}
      className={scrollLink}
      role="link"
      id={id}
      tabIndex={tabindex}
    >
      {children}
    </div>
  );
};

export default PageScrollLink;
