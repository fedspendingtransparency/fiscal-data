import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as styles from './info-tip.module.scss';
import { withWindowSize } from "react-fns";
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

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

export const infoTipAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Info Button Click'
}

const InfoTip = ({ width, title, secondary, clickEvent, glossaryText, iconStyle, hover, children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);

  const useStyles = makeStyles(theme => (
    {
      ...style,
      popupContainer: {
        padding: theme.spacing(2),
      },
      primarySvgColor: {
        "& path": {
          fill: iconStyle?.color ? iconStyle.color : '#aeb0b5'
        }
      },
    }
  ))
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

  const {
    button,
    primarySvgColor,
    secondarySvgColor,
    popOver,
    popupContainer
  } = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  let timeout;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (clickEvent) {
      clickEvent();
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
  const label = `More information about ${title}.`;

  const getHeader = () => {
    if(title) {
      return (
        <>
          {
            width < pxToNumber(breakpointLg) ?
            <span>
              <FontAwesomeIcon className={styles.mobileFA} icon={faXmark} onClick={handleClose} />
              <h6 className={styles.header}>{title}</h6>
            </span>
            :
            <div>
              <h6 className={styles.header}>{title}</h6>
            </div>
          }
        </>
      )
    }
  }
  return (
    <span data-testid="infoTipContainer">
        <Button
          aria-describedby={id}
          aria-label={title ? label : null}
          data-testid="infoTipButton"
          variant="contained"
          className={`${button} ${styles.infoIcon} infoTipIcon`}
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={hover ? handleClick : null}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className={`${styles.svgStyle} ${secondary ? secondarySvgColor : primarySvgColor}`}
            style={iconStyle}
          />
        </Button>
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
            className={`${popupContainer} ${styles.popupContainer}`}
            data-testid="popupContainer"
            onMouseLeave={handleClose}
            role={'presentation'}
          >
            {getHeader()}
            <div className={`${styles.popoverContents} infoTipPopoverContents`}>
              {children}
            </div>
          </div>
        </Popover>
    </span>
  );
}

export default withWindowSize(InfoTip);
