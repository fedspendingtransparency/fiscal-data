/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useState } from 'react';
import * as styles from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryList from './glossary-list/glossary-list';
import { IGlossaryMap } from '../../helpers/glossary-helper/glossary-data';

interface IGlossary {
  termList: IGlossaryMap
}

const Glossary:FunctionComponent<IGlossary> = ({termList}) => {
  const [activeState, setActiveState] = useState(true);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }


  return (
    <div
      className={`${styles.glossaryContainer} ${activeState ? styles.open : ''}`}
      data-testid="glossaryContainer"
    >
      <div
        className={styles.overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${styles.tray} ${activeState ? styles.open : ''}`}>
        {activeState && (
          <>
            <div className={styles.glossaryHeaderContainer}>
              <GlossaryHeader clickHandler={toggleState} />
            </div>
            <GlossaryList termList={termList} />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
