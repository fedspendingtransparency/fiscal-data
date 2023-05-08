/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useState } from 'react';
import * as styles from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryList from './glossary-list/glossary-list';
import { getGlossaryMap } from '../../helpers/glossary-helper/glossary-data';
import { IGlossaryTerm } from '../../models/IGlossaryTerm';
import { removeAddressPathQuery } from '../../helpers/address-bar/address-bar';

interface IGlossary {
  termList: IGlossaryTerm[]
}

const Glossary:FunctionComponent<IGlossary> = ({ termList }) => {
  const termMap = getGlossaryMap(termList);
  const getTerm = (termName):IGlossaryTerm => {
    const term = termList.find((element:IGlossaryTerm) => {
      if (termName !== null) {
        return element.term.toLowerCase() === termName.toLowerCase()
      }
    });

    removeAddressPathQuery(window.location);
    return term;
  }

  const queryParameters = new URLSearchParams(window.location.search);
  const queryTerm = getTerm(queryParameters.get("glossary"));

  const [activeState, setActiveState] = useState( queryTerm !== null && queryTerm !== undefined);

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
            <GlossaryList termMap={termMap} defaultTerm={queryTerm} />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
