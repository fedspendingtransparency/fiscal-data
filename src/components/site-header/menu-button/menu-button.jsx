import React from 'react';
import { buttonActivated, button, menuText } from './menu-button.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';

const MenuButton = ({ isOpen, clickHandler }) => (
  <button className={isOpen ? buttonActivated : button} onClick={clickHandler} data-testid="button">
    <div className={menuText} data-testid="menuText">
      Menu
    </div>
    <div data-testid="menuIcon">{isOpen ? <CloseIcon /> : <MenuIcon />}</div>
  </button>
);

export default MenuButton;
