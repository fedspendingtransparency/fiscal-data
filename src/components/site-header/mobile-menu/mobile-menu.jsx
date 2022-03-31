/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import * as styles from './mobile-menu.module.scss';
import { Link } from "gatsby";
import MenuButton from "../menu-button/menu-button";

const MobileMenu = () => {
  const [activeState, setActiveState] = useState(false);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }

  return (
    <div
      className={`${styles.menuContainer} ${activeState ? styles.open : ''}`}
      data-testid="menuContainer"
    >
      {/*
        * TODO: use some kind of onClickOutside event instead of having a clickable overlay.
        * A React hook is an easy way to handle this (ex. https://usehooks.com/useOnClickOutside/)
        */}
      <div
        className={styles.overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${styles.tray} ${activeState ? styles.open : ''}`}>
          <MenuButton clickHandler={toggleState} isOpen={activeState} />
          {activeState && (
            <>
              <Link to="/" data-testid="logo">
                <img
                  src="/logos/fd-logo-mobile.svg"
                  alt="Fiscal Data logo"
                  className={styles.logo}
                />
              </Link>
              <div className={styles.pageLinks}>
                <Link to="/datasets/" data-testid="datasets">Dataset Search</Link>
                <Link to="/api-documentation/" data-testid="apiDocs">API Documentation</Link>
                <Link to="/about-us/" data-testid="about">About Us</Link>
              </div>
            </>
          )}
      </div>
    </div>
  );
};
export default MobileMenu;
