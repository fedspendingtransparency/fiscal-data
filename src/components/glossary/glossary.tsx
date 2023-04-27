/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */


import React, { FunctionComponent, useState } from 'react';
import * as styles from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryList from './glossary-list/glossary-list';

const Glossary:FunctionComponent = () => {
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
      <div
        className={styles.overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${styles.tray} ${activeState ? styles.open : ''}`}>
        {activeState && (
          <>
            <div className={styles.linkHeaderContainer}>
              <GlossaryHeader clickHandler={() => toggleState} />
            </div>
            <GlossaryList />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
