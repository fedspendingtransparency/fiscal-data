import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  title,
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
import ScrollContainer from '../../scroll-container/scroll-container';


interface IGlossaryList {
  sortedTermList: IGlossaryListSection[],
  filter: string,
  filterHandler: (e) => void,
  defaultTerm?: IGlossaryTerm,
  setTabReset: (reset: boolean) => void,
}

const GlossaryListContainer:FunctionComponent<IGlossaryList> = ({ sortedTermList, filter, filterHandler, defaultTerm, setTabReset }) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);
  const [displayList, setDisplayList] = useState(sortedTermList);

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
            <ScrollContainer
              list={displayList}
              selection={selectedTerm}
              scrollTop={scrollTop}
              setScrollTop={setScrollTop}
              customChildStyle={{marginBottom: '12.825rem', paddingRight: '1rem'}}
            >
              {displayList.length ? (
                <GlossaryDisplayList
                  sortedList={displayList}
                  filter={filter}
                  selectedTermHandler={setSelectedTerm}
                  setTabReset={setTabReset}
                />
              ) : (
                <NoGlossaryMatch filter={filter} />
              )
              }
            </ScrollContainer>
          </>
        )}
    </>
  )
}

export default GlossaryListContainer;
