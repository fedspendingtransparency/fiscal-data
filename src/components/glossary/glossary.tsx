/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useEffect, useState } from 'react';
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
    console.log(window.location);
    console.log(term);

    // window.location.replace(window.location.origin)
    removeAddressPathQuery(window.location);
    return term;
  }

  console.log(window.location);
  const queryParameters = new URLSearchParams(window.location.search);
  const term = getTerm(queryParameters.get("glossary"));
  const [urlTerm, setUrlTerm] = useState(term);
  const [change, setChange] = useState(false);

  // console.log()

  const [activeState, setActiveState] = useState( urlTerm !== null && urlTerm !== undefined);

  console.log(urlTerm);
  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }


  // useEffect( () => {
  //   const queryParameters = new URLSearchParams(window.location.search);
  //   if (urlTerm !== undefined) {
  //     console.log(queryParameters);
  //     console.log('************************');
  //     setUrlTerm(getTerm(queryParameters.get("glossary")))
  //   }
  // }, [window.history])


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
            <GlossaryList termMap={termMap} defaultTerm={urlTerm} />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
