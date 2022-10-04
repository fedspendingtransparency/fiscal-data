import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as styles from './info-tip.module.scss';
import { withWindowSize } from "react-fns";
import { pxToNumber } from '../../../src/helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';

const useStyles = makeStyles(theme => ({
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
  primarySvgColor: {
    "& path": {
      fill: '#aeb0b5'
    }
  },
  secondarySvgColor: {
    "& path": {
      fill: '#000'
    }
  },
  popupContainer: {
    padding: theme.spacing(2),
  },
}));

export const infoTipAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Info Button Click'
}

const InfoTip = ({ width, title, secondary, clickEvent, glossaryText, children }) => {
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

  const handleGlossaryClick = (e) => {
    let anchor = e.currentTarget;
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
console.log(timeout);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const label = `More information about ${title}.`;

  return (
    <span data-testid="infoTipContainer">
      {glossaryText ? (
        <span
          className={styles.glossaryButton}
          onMouseEnter={handleGlossaryClick}
          onMouseLeave={handleMouseLeave}
          onClick={handleGlossaryClick}
          onKeyPress={handleGlossaryClick}
          role="button"
          tabIndex={0}
        >
          {glossaryText}
        </span>
      ) : (
        <Button
          aria-describedby={id}
          aria-label={label}
          data-testid="infoTipButton"
          variant="contained"
          className={`${button} ${styles.infoIcon}`}
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className={`${styles.svgStyle} ${secondary ? secondarySvgColor : primarySvgColor}`}
          />
        </Button>
      )}
        <Popover
          id={id}
          className={popOver}
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
          >
            {width < pxToNumber(breakpointLg) ?
              <h6 className={styles.header}>{title} <FontAwesomeIcon icon={faXmark} onClick={handleClose}/></h6> :
              <h6 className={styles.header}>{title}</h6>
            }

            <div className={styles.popoverContents}>
              {children}
            </div>
          </div>
        </Popover>
    </span>
  );
}

export default withWindowSize(InfoTip);
