import React, { useEffect, useState } from 'react';
import * as styles from './sticky-footer.module.scss';
import LocationAware from '../location-aware/location-aware';

// slow slide down transition, so the user can interrupt
export const stickySlideDownTransitionMillis = 3000;

export const StickyFooterComponent = ({children, hideAfterTime, hidden, location, onClosed}) => {

  const [closing, setClosing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activityTimeout, setActivityTimeout] = useState(null);
  const [navSpacer, setNavSpacer] = useState(null);
  const [closerTimeout, setCloserTimeout] = useState(null);
  const [callbackTimer, setCallbackTimer] = useState(null);

  const startCloserTimer = () => {
    let mounted = true;
    if (hideAfterTime && !closing) {
      setCloserTimeout(setTimeout(() => {
        if (mounted) {
          setClosing(true);
        }
      }, 1));
    }
    return () => {
      mounted = false;
      if (closerTimeout) {
        clearTimeout(closerTimeout);
      }
    }
  };

  useEffect(() => {
    return () => {
      // if the onClosed callback timer is running at dismount, clear the timeout and run the
      // onClosed function
      if (callbackTimer) {
        clearTimeout(callbackTimer);
      }
      if (onClosed) {
        onClosed();
      }
      // run the function returned from startCloserTimer
      startCloserTimer()();
    }
  }, []);

  useEffect(() => {
    return startCloserTimer();
  }, [hideAfterTime]);

  useEffect(() => {
    if (closing && !hovered && onClosed && hideAfterTime) {
      // shortly
      // after the hide delay and the transition have completed, run the onClosed callback
      setCallbackTimer(
        setTimeout(onClosed, (hideAfterTime + stickySlideDownTransitionMillis + 1000))
      );
    } else {
      if (callbackTimer) {
        clearTimeout(callbackTimer);
        setCallbackTimer(null);
      }
    }
  }, [closing, hovered]);

  useEffect(() => {
    if (location && location.pathname) {
      const segments = location.pathname.split(/[/?]+/).filter(part => part.length > 0);
      // url paths with only one segment represent the pages that need spacers
      setNavSpacer(segments.length === 1);
    } else {
      setNavSpacer(false);
    }
  }, [location]);

  const closingTransition = {
    transition: `max-height ${
      stickySlideDownTransitionMillis
    }ms linear ${hideAfterTime}ms, visibility 0ms linear ${
      stickySlideDownTransitionMillis + hideAfterTime
    }ms`
  };

  const reactivate = () => {
    setClosing(false);
    if (activityTimeout) {
      clearTimeout(activityTimeout);
    }
    setActivityTimeout(setTimeout(() => {
      setClosing(true);
      setActivityTimeout(null);
    }, 500));
  };

  // don't render at all if empty or hidden is set to true
  // only render component with multiple event handlers when hideAfterTime is present
  return (hidden || !children) ? null : (
      hideAfterTime ? (
        <div
          className={`${styles.stickyFooterContainer} ${closing ? styles.closing : ''}`}
          style={closing && !hovered ? closingTransition : {}}
          data-testid="sticky-footer-container"
          role="button"
          tabIndex={0}
          onFocus={reactivate}
          onClick={reactivate}
          onKeyPress={reactivate}
          onTouchStart={reactivate}
          onMouseEnter={() => { setHovered(true); }}
          onMouseLeave={() => { setHovered(false); }}
        >
          <div className={styles.stickyFooterContent}
               data-testid="sticky-footer-content"
          >
            {children}
          </div>
          {navSpacer && (<div className={styles.floatingNavSpacer}>&nbsp;</div>)}
        </div>
      )
      :
      (
        <div className={styles.stickyFooterContainer}
             data-testid="sticky-footer-container"
        >
          <div className={styles.stickyFooterContent}
               data-testid="sticky-footer-content"
          >
            {children}
          </div>
          {navSpacer && (<div className={styles.floatingNavSpacer}>&nbsp;</div>)}
        </div>
      )
    );
};

export default LocationAware(StickyFooterComponent);
