import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  arrowIcon,
  bookIcon,
  glossaryButton,
  glossaryHover,
  glossaryLink,
  glossaryText,
  header,
  mobileFA,
  popupContainerStyle,
  termNameText,
} from './glossary-popover-definition.module.scss';
import Popover from '@mui/material/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faBook, faXmark } from '@fortawesome/free-solid-svg-icons';
import { glossaryLookup } from '../../../helpers/glossary-helper/glossary-lookup';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { GlossaryContext } from '../glossary-context/glossary-context';
import { searchBarTheme } from '../glossary-header/theme';
import { ThemeProvider } from '@mui/material';

const GlossaryPopoverDefinition = ({ term, page, children, width = null, customFormat = null, handleClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonFocus, setButtonFocus] = useState(false);
  const parentContainer = useRef(null);
  const { setGlossaryClickEvent, glossary } = useContext(GlossaryContext);

  const displayText = children.toString();
  const { termName, definition, slug } = glossaryLookup(term, glossary, page, customFormat);

  const handleScroll = () => {
    const position = window.pageYOffset;
    const previousPosition = scrollPosition;
    setScrollPosition(position);
    if (position !== previousPosition) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  const handleGlossaryClick = e => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      if (handleClick) {
        handleClick();
      }
      setButtonFocus(true);
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setButtonFocus(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const glossaryNavigation = () => {
    if (window.history.pushState) {
      if (setGlossaryClickEvent) {
        const newurl = new URL(window.location.href);
        newurl.searchParams.set('glossary', slug);
        window.history.pushState(null, '', newurl);
        setGlossaryClickEvent(true);
      }
      handleClose();
    }
  };

  return (
    <ThemeProvider theme={searchBarTheme}>
      <span data-testid="infoTipContainer" ref={parentContainer}>
        <span
          className={`${buttonFocus ? glossaryHover : glossaryLink}`}
          onClick={handleGlossaryClick}
          onKeyDown={handleGlossaryClick}
          role="button"
          tabIndex={0}
        >
          <span>{displayText}</span>
          <FontAwesomeIcon icon={faBook} className={bookIcon} />
        </span>
        <Popover
          id={id}
          sx={{ opacity: open ? 1 : 0 }}
          disableScrollLock={true}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: width > pxToNumber(breakpointLg) ? 'left' : 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: width > pxToNumber(breakpointLg) ? 'left' : 'center',
          }}
        >
          <div className={popupContainerStyle} data-testid="popupContainer" role="presentation">
            <div className={glossaryText}>
              <div className={header}>
                <FontAwesomeIcon className={mobileFA} icon={faXmark} onClick={handleClose} onKeyDown={handleClose} tabIndex={0} size="lg" />
                <span>Definition</span>
              </div>
              <div className={termNameText}>{termName}</div>
              <div>{definition}</div>
              <div className={glossaryButton} role="button" onClick={glossaryNavigation} onKeyDown={glossaryNavigation} tabIndex={0}>
                <div>View in glossary</div>
                <FontAwesomeIcon icon={faArrowRightLong} className={arrowIcon} />
              </div>
            </div>
          </div>
        </Popover>
      </span>
    </ThemeProvider>
  );
};

export default withWindowSize(GlossaryPopoverDefinition);
