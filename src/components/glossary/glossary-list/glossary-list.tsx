import React, { FunctionComponent, useEffect, useRef } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  termText,
  scrollGradient,
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';

interface IGlossaryList {
  termList: IGlossaryMap
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({termList}) => {
  const scrollableRef = useRef();
  const keys = Reflect.ownKeys(termList);

  // const handleScroll = () => {
  //   if(scrollableRef.current !== undefined) {
  //     const currPosition = scrollableRef.current.scrollTop;
  //     console.log(currPosition);
  //
  //   }
  //
  // }
  //
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, {passive: true});
  //
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  //
  // }, []);

  return (
    <>
      <span className={title}>All Terms </span>
      <div className={scrollGradient} />
      <div className={listContainer}>
        <div className={termContainer} ref={scrollableRef}>
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
