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
  termList: IGlossaryTerm[],
  activeState: boolean;
  setActiveState: any;
}

const Glossary:FunctionComponent<IGlossary> = ({ termList, activeState, setActiveState }) => {
  const termMap = getGlossaryMap(termList);
  let currentState = activeState;
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

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      currentState = !currentState;
      setActiveState(currentState);
    }
  }

  return (
    <div
      className={`${glossaryContainer} ${currentState ? open : ''}`}
      data-testid="glossaryContainer"
    >
      <div
        className={overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${tray} ${currentState ? open : ''}`}>
        {currentState && (
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
