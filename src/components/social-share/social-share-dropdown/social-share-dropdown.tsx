import {
  icon,
  shareButton,
  listContainer
} from './social-share-dropdown.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareNodes} from '@fortawesome/free-solid-svg-icons';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {SocialShareComponent} from "../social-share";
import Popover from "@material-ui/core/Popover";
import {makeStyles} from "@material-ui/core/styles";
import {withWindowSize} from "react-fns";
import {breakpointLg} from "../../../variables.module.scss";
import {pxToNumber} from "../../../helpers/styles-helper/styles-helper";
import {ISocialShareDropdown} from "../../../models/ISocialShareDropdown";
import SocialMetaData from "../social-metadata/social-metadata";

const SocialShareDropdown: FunctionComponent<ISocialShareDropdown> =
  ({copy, pageName, width}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [socialButtonClick, setSocialButtonClick] = useState(false);
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

  const useStyles = makeStyles(theme => ({
    popOver : {
      "& .MuiPopover-paper": {
        backgroundColor: 'rgba(255, 253, 253, 0.96)',
        width: '144px',
        marginTop: width >= pxToNumber(breakpointLg) ? '11px' : '0px',
        borderRadius: '2px',
        boxShadow: '1px 1px 2px 0 rgba(0, 0, 0, 0.5)',
        border: 'solid 1px var(--d-6-d-7-d-9-background-grey-lighter)',
      }
    },
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { popOver } = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
    setSocialButtonClick(false);

  };

  const handleSocialButtonClick = () => {
    setSocialButtonClick(true);
    handleClose();
  }

  const open = Boolean(anchorEl) && !socialButtonClick;
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);


  return (
    <>
      <SocialMetaData
        image={copy.image}
        title={copy.title}
        description={copy.description}
        url={copy.url}
      />
        <button
          className={shareButton}
          tabIndex={0}
          onClick={handleClick}
          onKeyPress={handleClick}
        >
          <FontAwesomeIcon icon={faShareNodes as IconProp} className={icon} />
          <span>Share</span>
        </button>
        <Popover
          id={id}
          open={open}
          disableScrollLock={true}
          anchorEl={anchorEl}
          onClose={handleClose}
          className={popOver}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div className={listContainer}>
            <SocialShareComponent
              copy={copy}
              pageName={pageName}
              displayStyle={'list'}
              clickEvent={handleSocialButtonClick}
            />
          </div>
        </Popover>
    </>
  );
}

export default withWindowSize(SocialShareDropdown);
