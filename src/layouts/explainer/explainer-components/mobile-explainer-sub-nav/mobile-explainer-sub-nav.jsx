import React, {useState, useEffect, useRef} from 'react';
import * as styles from './../explainer-sub-nav/explainer-sub-nav.module.scss';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {navigate} from 'gatsby'
import {
  listItems,
  MenuList,
  buttonOverview,
  spending,
  revenue,
  deficit,
  debt,
  carrot,
  faHouse,
  stylingStyledMenu,
  overviewStyle,
  mainContainer,
  mainContainerSticky,
  mainContainerHidden,
  mainContainerShow
} from './mobile-explainer-sub-nav.module.scss';

const StyledMenu = withStyles({
  paper: {
    width: '288px',

  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {},
    },
  },
}))(MenuItem);


export default function MobileExplainerSubNav({hidePosition}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(mainContainerShow);

  const handleScroll = () => {
    let position = window.pageYOffset;
    setPreviousScrollPosition(scrollPosition);
    setScrollPosition(position);

    if (position > hidePosition) {
      //Scrolling Down
      if (previousScrollPosition < scrollPosition) {
        setNavBlockStyle(mainContainerHidden)
      } else {
        setNavBlockStyle(mainContainerSticky)
      }
    } else {
      setNavBlockStyle(mainContainerShow)
    }

    console.log(previousScrollPosition, scrollPosition)
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [scrollPosition]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={mainContainer} data-testid='mobileSubNav'>
      <div className={navBlockStyle} >
      <button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="#0a2f5a"
        onClick={handleClick}
        onKeyPress={handleClick}
        className={buttonOverview}
      >
        <span className={overviewStyle}>
        <FontAwesomeIcon className={faHouse} icon={faHouseChimney}/>
        Overview
        </span>
        <FontAwesomeIcon className={carrot} icon={faCaretDown}/>
      </button>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={stylingStyledMenu}
      >
        <StyledMenuItem className={MenuList}>
          <ListItemText className={revenue} onClick={() => navigate('/americas-finance-guide/government-revenue/')}
                        primary=" Revenue"/>
        </StyledMenuItem>
        <StyledMenuItem className={MenuList}>
          <ListItemText className={spending} onClick={() => navigate('/americas-finance-guide/federal-spending/')}
                        primary="Spending"/>
        </StyledMenuItem>
        <StyledMenuItem className={MenuList}>
          <ListItemText className={deficit} onClick={() => navigate('/americas-finance-guide/national-deficit/')}
                        primary="Deficit"/>
        </StyledMenuItem>
        <StyledMenuItem className={MenuList}>
          <ListItemText className={debt} onClick={() => navigate('/americas-finance-guide/national-debt/')}
                        primary="Debt"/>
        </StyledMenuItem>
      </StyledMenu>
    </div>
    </div>
  );
}
