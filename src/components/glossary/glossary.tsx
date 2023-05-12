/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useState } from 'react';
import {
  glossaryContainer,
  open,
  overlay,
  tray,
  glossaryHeaderContainer
} from './glossary.module.scss';
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
  const getQueryTerm = (termName):IGlossaryTerm => {
    if (termName) {
      const term = termList.find((element:IGlossaryTerm) => {
        if (termName !== null) {
          return element.term.toLowerCase() === termName.toLowerCase()
        }
      });

      removeAddressPathQuery(window.location);
      return term;
    }
  }
  const queryParameters = new URLSearchParams(window.location.search);
  const queryTerm = getQueryTerm(queryParameters.get("glossary"));

  // Active state will default to true for testing purposes
  const [activeState, setActiveState] = useState(true); //queryTerm !== null && queryTerm !== undefined);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }


  return (
    <div
      className={`${glossaryContainer} ${activeState ? open : ''}`}
      data-testid="glossaryContainer"
    >
      <div
        className={overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${tray} ${activeState ? open : ''}`}>
        {activeState && (
          <>
            <div className={glossaryHeaderContainer}>
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
