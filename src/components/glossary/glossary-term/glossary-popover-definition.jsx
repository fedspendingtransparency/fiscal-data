import React, { useContext, useEffect, useState } from 'react';
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

const style = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    height: '20px',
    marginLeft: '3px',
    minWidth: '20px',
    top: '-2px',
    width: '20px',
    padding: 0,
    '&:hover, &.Mui-focusVisible, &:active': {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
  },
  popOver: {
    '& .MuiPopover-paper': {
      backgroundColor: 'rgba(255, 253, 253, 0.96)',
      boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.16)',
      maxWidth: '90%',
      width: '17rem',
      margin: '0.5rem 0',
    },
  },
  secondarySvgColor: {
    '& path': {
      fill: '#000',
    },
  },
};

const GlossaryPopoverDefinition = ({ term, page, children, width = null, customFormat = null, handleClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonFocus, setButtonFocus] = useState(false);

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
    <span data-testid="infoTipContainer">
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
        sx={style.popOver}
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
  );
};

export default withWindowSize(GlossaryPopoverDefinition);
