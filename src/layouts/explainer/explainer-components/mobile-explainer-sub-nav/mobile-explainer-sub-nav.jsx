import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  listItems,
  MenuList2,
  buttonOverview,
  spending,
  revenue,
  deficit,
  debt,
  MenuList,
  carrot
} from './mobile-explainer-sub-nav.module.scss';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #999999',
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
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {

      },
    },
  },
}))(MenuItem);

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <a
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="#0a2f5a"
        href='#'
        onClick={handleClick}
        className={buttonOverview}
      >
        <FontAwesomeIcon icon={faHouseChimney} />
         Overvirew
        <FontAwesomeIcon className={carrot} icon={faCaretDown} />
      </a>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{root: buttonOverview}}
      >
        <StyledMenuItem className={MenuList2}>
          <ListItemText className={revenue} primary=" Revenue" />
        </StyledMenuItem>
        <StyledMenuItem className={MenuList2}>
          <ListItemText className={spending} primary="Spending" />
        </StyledMenuItem>
        <StyledMenuItem className={MenuList2}>
          <ListItemText className={deficit} primary="Deficit" />
        </StyledMenuItem>
        <StyledMenuItem className={MenuList2}>
          <ListItemText className={debt} primary="Debt" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
