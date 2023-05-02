import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  termText,
  scrollGradient,
  scrollNonGradient
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';

interface IGlossaryList {
  termList: IGlossaryMap
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({termList}) => {
  const [scrollTop, setScrollTop] = useState(true);

  const keys = Reflect.ownKeys(termList);

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
      <div className={scrollTop ? scrollNonGradient : scrollGradient} />
      <div className={listContainer}>
        <div className={termContainer} data-testid={'scrollContainer'}>
          {keys.map((key) =>
            <>
              <div className={sectionHeader}>{key}</div>
              <div className={sectionTerms}>
                {Reflect.get(termList, key).map((term) => {
                  return(
                    <div className={termText}>
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
