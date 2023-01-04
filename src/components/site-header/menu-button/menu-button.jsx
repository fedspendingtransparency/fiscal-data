import React from 'react';
import * as styles from "./menu-button.module.scss";
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';


const MenuButton = ({ isOpen, clickHandler }) => (
  <button className={isOpen ? styles.buttonActivated : styles.button} onClick={clickHandler} data-testid='button'>
    <div className={styles.menuText} data-testid='menuText'>Menu</div>
    <div data-testid='menuIcon'>
      {isOpen
        ? <CloseIcon />
        : <MenuIcon />
      }
    </div>
  </button>
);

export default MenuButton;
