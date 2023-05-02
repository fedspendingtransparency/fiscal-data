import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  termText,
  scrollGradient,
  scrollContainerTop
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';

interface IGlossaryList {
  termMap: IGlossaryMap
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({termMap}) => {
  const [scrollTop, setScrollTop] = useState(true);

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

  return (
    <>
      <span className={title}>All Terms </span>
      <div className={scrollTop ? scrollContainerTop : scrollGradient} />
      <div className={listContainer}>
        <div className={termContainer} data-testid={'scrollContainer'}>
          {keys.map((key) =>
            <>
              <div className={sectionHeader}>{key}</div>
              <div className={sectionTerms}>
                {Reflect.get(termMap, key).map((term) => {
                  return(
                    <div className={termText} key={termText}>
                      {term.term}
                    </div>
                  )
                })
                }
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default GlossaryList;
