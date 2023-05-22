/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  glossaryContainer,
  open,
  overlay,
  tray,
  glossaryHeaderContainer
} from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryListContainer from './glossary-list/glossary-list-container';
import { getSortedGlossaryList } from '../../helpers/glossary-helper/glossary-data';
import { IGlossaryTerm } from '../../models/IGlossaryTerm';
import { removeAddressPathQuery } from '../../helpers/address-bar/address-bar';

interface IGlossary {
  termList: IGlossaryTerm[],
  glossaryEvent: boolean,
  glossaryEventHandler: (boolean) => void,
}
  const getQueryTerm = (termList):IGlossaryTerm => {
    const queryParameters= new URLSearchParams(window.location.search);
    console.log(queryParameters);
    const termName = queryParameters.get("glossary");
    if (termName) {
      console.log(termName);
      const term = termList.find((element:IGlossaryTerm) => {
        if (termName !== null) {
          return element.term.toLowerCase() === termName.toLowerCase()
        }
      });

      removeAddressPathQuery(window.location);
      return term;
    }
  }

const Glossary:FunctionComponent<IGlossary> = ({ termList, glossaryEvent, glossaryEventHandler }) => {
  const [filter, setFilter] = useState('');

  const sortedTermList = getSortedGlossaryList(termList);
  const [queryTerm, setQueryTerm] = useState(getQueryTerm(termList));
  const [activeState, setActiveState] = useState(queryTerm !== null && queryTerm !== undefined);


  useEffect(() => {
    console.log(glossaryEvent);
    if (glossaryEvent) {
      const term = getQueryTerm(termList);
      setQueryTerm(term);
      setTimeout(() => {
        setActiveState(true);
        glossaryEventHandler(false);
      }, 500);
    }
  }, [glossaryEvent]);

  // useEffect(() => {
  //   console.log('queryTerm', queryTerm);
  // }, [queryTerm])

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
              <GlossaryHeader clickHandler={toggleState} filter={filter} filterHandler={setFilter} />
            </div>
            <GlossaryListContainer
              sortedTermList={sortedTermList}
              filter={filter}
              filterHandler={setFilter}
              defaultTerm={queryTerm ? queryTerm : null}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
