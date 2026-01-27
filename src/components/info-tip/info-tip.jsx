import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { buttonContainer, header, infoIcon, mobileFA, svgStyle } from './info-tip.module.scss';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

const style = {
  popOver: {
    '& .MuiPopover-paper': {
      backgroundColor: 'rgba(255, 253, 253, 0.96)',
      boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.16)',
      maxWidth: '90%',
      width: '17rem',
    },
  },
};

export const infoTipAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Info Button Click',
};

const InfoTip = ({ width, title, secondary, clickEvent, iconStyle, hover, children, displayTitle }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setPreviousScrollPosition(scrollPosition);
    setScrollPosition(position);

    if (scrollPosition !== previousScrollPosition) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  let timeout;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    if (clickEvent) {
      clickEvent();
    }
    return false;
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const id = open ? 'simple-popover' : undefined;
  const label = `More information about ${title}.`;

  const getHeader = () => {
    if (title && displayTitle) {
      return (
        <>
          {width < pxToNumber(breakpointLg) ? (
            <span>
              <FontAwesomeIcon className={mobileFA} icon={faXmark} onClick={handleClose} />
              <h6 className={header}>{title}</h6>
            </span>
          ) : (
            <div>
              <h6 className={header}>{title}</h6>
            </div>
          )}
        </>
      );
    }
  };

  const getIconColor = () => {
    if (secondary) return '#000';
    return iconStyle?.color ? iconStyle.color : '#aeb0b5';
  };

  return (
    <span data-testid="infoTipContainer" className={buttonContainer}>
      <button
        aria-describedby={id}
        aria-label={title ? label : null}
        data-testid="infoTipButton"
        className={`${infoIcon} infoTipIcon`}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={hover ? handleClick : null}
      >
        <FontAwesomeIcon icon={faInfoCircle} className={svgStyle} style={{ ...iconStyle, color: getIconColor() }} />
      </button>
      {/*<Popover*/}
      {/*  id={id}*/}
      {/*  sx={{ ...style.popOver, opacity: open ? 1 : 0 }}*/}
      {/*  disableScrollLock={true}*/}
      {/*  open={open}*/}
      {/*  anchorEl={anchorEl}*/}
      {/*  onClose={handleClose}*/}
      {/*  anchorOrigin={{*/}
      {/*    vertical: 'bottom',*/}
      {/*    horizontal: 'center',*/}
      {/*  }}*/}
      {/*  transformOrigin={{*/}
      {/*    vertical: 'top',*/}
      {/*    horizontal: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <div className={` ${popupContainerStyle}`} data-testid="popupContainer" onMouseLeave={handleClose} role="presentation">*/}
      {/*    {getHeader()}*/}
      {/*    <div className={`${popoverContents} infoTipPopoverContents`}>{children}</div>*/}
      {/*  </div>*/}
      {/*</Popover>*/}
    </span>
  );
};

export default withWindowSize(InfoTip);
