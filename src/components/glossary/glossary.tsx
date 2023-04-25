/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */


import React, { useState } from 'react';
import MenuButton from '../site-header/menu-button/menu-button';
import * as styles from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryList from './glossary-list/glossary-list';

const Glossary = () => {
  const [activeState, setActiveState] = useState(true);

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
        {activeState && (
          <>
            <div className={styles.linkHeaderContainer}>
              <GlossaryHeader clickHandler={toggleState} />
            </div>
            <GlossaryList />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
