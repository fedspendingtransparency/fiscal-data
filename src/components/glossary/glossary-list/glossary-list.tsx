import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  termText,
  scrollGradient,
  scrollContainerTop,
  backToList,
  arrowIcon
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';
import GlossaryDefinition from '../glossary-definition/glossary-definition';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IGlossaryList {
  termMap: IGlossaryMap
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({termMap}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const keys = Reflect.ownKeys(termMap);

  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }


  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');

    scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), {passive: true});

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };

  }, []);

  const onTermClick = (e, term) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      setSelectedTerm(term);
    }
  }

  const onClickBack = () => {
    setSelectedTerm(null);
  }

  return (
    <>
      {selectedTerm ? (
        <>
          <button onClick={onClickBack} className={backToList}>
            <FontAwesomeIcon icon={faArrowLeft as IconProp} className={arrowIcon} />
            Back to list
          </button>
          <GlossaryDefinition glossaryTerm={selectedTerm} />
        </>
        ) : (
          <>
            <span className={title}>All Terms </span>
            <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid={'scrollGradient'} />
            <div className={listContainer}>
              <div className={termContainer} data-testid={'scrollContainer'}>
                {keys.map((letter) =>
                  <React.Fragment key={letter.toString()}>
                    <div className={sectionHeader}>{letter}</div>
                    <div className={sectionTerms}>
                      {Reflect.get(termMap, letter).map((term) => {
                        return(
                          <div
                            className={termText}
                            tabIndex={0}
                            role={'button'}
                            key={term.term}
                            onClick={(e) => onTermClick(e, term)}
                            onKeyPress={(e) => onTermClick(e, term)}
                          >
                            {term.term}
                          </div>
                        )
                      })
                      }
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default GlossaryList;
