import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  termContainer,
  scrollGradient,
  scrollContainerTop,
  backToList,
  arrowIcon,
} from './glossary-list.module.scss';
import GlossaryDefinition from '../glossary-definition/glossary-definition';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IGlossaryTerm } from '../../../models/IGlossaryTerm';
import NoMatch from './no-match/no-match';
import GlossaryDisplayList from './glossary-display-list/glossary-display-list';


interface IGlossaryList {
  termMap?: IGlossaryTerm[],
  termList?: IGlossaryTerm[],
  filter: string,
  filterHandler: (e) => void,

  defaultTerm?: IGlossaryTerm,
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({ termMap, termList, filter, filterHandler, defaultTerm}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);
  const [displayList, setDisplayList] = useState(termMap);

  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  const onClickBack = () => {
    setSelectedTerm(null);
    setDisplayList(termMap);
    filterHandler('');
  }

  const filterTermsByEntry = (sortedList, entry) => {
    const filteredList = [];

    const filterNestedList = (terms) => {
      const matchedTerms = terms.filter(term => term.term.toUpperCase().includes(entry.toUpperCase()))
      if (matchedTerms.length > 0) {
        filteredList.push(matchedTerms);
      }
    }

    if (entry?.length) {
      sortedList.forEach(terms => filterNestedList(terms));
    }

    return entry?.length > 0 ? filteredList : sortedList;
  };

  useEffect(() => {
    const localFilterOptions = filterTermsByEntry(termMap, filter);
    setDisplayList(localFilterOptions);
    setSelectedTerm(null);
  }, [filter])

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');

    if(scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), {passive: true});

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }

  }, [selectedTerm, displayList]);



  return (
    <>
      <>
        {(selectedTerm || displayList.length !== termMap.length) ? (
          <button onClick={onClickBack} className={backToList}>
            <FontAwesomeIcon icon={faArrowLeft as IconProp} className={arrowIcon} />
            Back to list
          </button>
        ) : (
          <span className={title}>All Terms</span>
        )}
      </>
      {selectedTerm ? (
        <GlossaryDefinition glossaryTerm={selectedTerm} />
        ) : (
          <>
            <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid={'scrollGradient'} />
            <div className={listContainer}>
              <div className={termContainer} data-testid={'scrollContainer'}>
                {displayList.length ? (
                  <GlossaryDisplayList displayList={displayList} filter={filter} selectedTermHandler={setSelectedTerm} />
                  ) : (
                    <NoMatch term={filter} />
                )
                }
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default GlossaryList;
