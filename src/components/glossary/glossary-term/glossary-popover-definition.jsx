import React, { useEffect, useState } from 'react';
import { findGlossaryTerm } from "../../../helpers/glossary-helper/glossary-terms"
import { makeStyles } from '@material-ui/core/styles';
import {
  arrowIcon,
  glossaryButton,
  glossaryLink,
  glossaryText,
  header,
  mobileFA, termNameText,
  bookIcon
} from './glossary-popover-definition.module.scss';
import Popover from '@material-ui/core/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faXmark, faBook } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { glossaryLookup } from '../../../helpers/glossary-helper/glossary-lookup';

const style = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    height: '20px',
    marginLeft: "3px",
    minWidth: '20px',
    top: '-2px',
    width: '20px',
    padding: 0,
    "&:hover, &.Mui-focusVisible, &:active": {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }
  },
  popOver : {
    "& .MuiPopover-paper": {
      backgroundColor: 'rgba(255, 253, 253, 0.96)',
      boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.16)',
      maxWidth: '90%',
      width: '17rem'
    }
  },
  secondarySvgColor: {
    "& path": {
      fill: '#000'
    }
  },
};


const GlossaryPopoverDefinition = ({ term, page, glossary, children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  let timeout;

  const displayText = children.toString();
  const { termName, definition } = glossaryLookup(term, glossary, page);


  const useStyles = makeStyles(theme => (
    {
      ...style,
      popupContainer: {
        padding: theme.spacing(2),
      },
    }
  ))

  const { popOver, popupContainer } = useStyles();
  const handleScroll = () => {
    const position = window.pageYOffset;
    setPreviousScrollPosition(scrollPosition);
    setScrollPosition(position);

    if (scrollPosition !== previousScrollPosition) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  const handleGlossaryClick = (e) => {
    const anchor = e.currentTarget;
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      if (e.type === 'mouseenter') {
        timeout = setTimeout(() => {
          setAnchorEl(anchor);
        }, 500);
      } else {
        setAnchorEl(e.currentTarget);
      }
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <span data-testid="infoTipContainer">
      <span
        className={glossaryLink}
        onMouseEnter={handleGlossaryClick}
        onMouseLeave={handleMouseLeave}
        onClick={handleGlossaryClick}
        onKeyPress={handleGlossaryClick}
        role="button"
        tabIndex={0}
      >
        <span>{displayText}</span>
        <FontAwesomeIcon icon={faBook} className={bookIcon} />
      </span>
      <Popover
        id={id}
        className={popOver}
        disableScrollLock={true}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div
          className={popupContainer}
          data-testid="popupContainer"
          onMouseLeave={handleClose}
          role={'presentation'}
        >
          <div className={glossaryText}>
            <div className={header}>
              <FontAwesomeIcon className={mobileFA} icon={faXmark} onClick={handleClose} />
              <span>Definition</span>
            </div>
            <div className={termNameText}>{termName}</div>
            <div>{definition}</div>
            <div className={glossaryButton}>
              <div>View in glossary</div>
              <FontAwesomeIcon icon={faArrowRight} className={arrowIcon} />
            </div>
          </div>
        </div>
      </Popover>
    </span>
  );
}

export default GlossaryPopoverDefinition;
