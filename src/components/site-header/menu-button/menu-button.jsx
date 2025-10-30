import React from 'react';
import { button, buttonActivated, menuText } from './menu-button.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

const MenuButton = ({ isOpen, clickHandler }) => (
  <button className={isOpen ? buttonActivated : button} onClick={clickHandler} data-testid="button">
    <div className={menuText} data-testid="menuText">
      Menu
    </div>
    <div data-testid="menuIcon">{isOpen ? <CloseIcon /> : <MenuIcon />}</div>
  </button>
);

export default MenuButton;
