import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  termContainer,
  scrollGradient,
  scrollContainerTop,
  backToList,
  arrowIcon,
} from './glossary-list-container.module.scss';
import GlossaryDefinition from '../glossary-definition/glossary-definition';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IGlossaryTerm } from '../../../models/IGlossaryTerm';
import NoGlossaryMatch from './no-match/no-glossary-match';
import GlossaryDisplayList from './glossary-display-list/glossary-display-list';
import { IGlossaryListSection } from '../../../helpers/glossary-helper/glossary-data';


interface IGlossaryList {
  sortedTermList: IGlossaryListSection[],
  filter: string,
  filterHandler: (e) => void,

  defaultTerm?: IGlossaryTerm,
}

const GlossaryListContainer:FunctionComponent<IGlossaryList> = ({ sortedTermList, filter, filterHandler, defaultTerm}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);
  const [displayList, setDisplayList] = useState(sortedTermList);
  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  const onClickBack = () => {
    setSelectedTerm(null);
    setDisplayList(sortedTermList);
    setScrollTop(true);
    filterHandler('');
  }

  const filterTermsByEntry = (sortedList: IGlossaryListSection[], entry: string) => {
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
    const localFilterOptions = filterTermsByEntry(sortedTermList, filter);
    if (filter) {
      setSelectedTerm(null);
    }
    setDisplayList(localFilterOptions);
  }, [filter])

  useEffect(() => {
    setSelectedTerm(defaultTerm);
  }, [defaultTerm])

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
      {(selectedTerm || displayList.length !== sortedTermList.length) ? (
        <button onClick={onClickBack} className={backToList}>
          <FontAwesomeIcon icon={faArrowLeft as IconProp} className={arrowIcon} />
          Back to list
        </button>
      ) : (
        <span className={title}>All Terms</span>
      )}
      {selectedTerm ? (
        <GlossaryDefinition glossaryTerm={selectedTerm} />
        ) : (
          <>
            <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid={'scrollGradient'} />
            <div className={listContainer}>
              <div className={termContainer} data-testid={'scrollContainer'}>
                {displayList.length ? (
                  <GlossaryDisplayList sortedList={displayList} filter={filter} selectedTermHandler={setSelectedTerm} />
                ) : (
                  <NoGlossaryMatch filter={filter} />
                )
                }
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default GlossaryListContainer;
