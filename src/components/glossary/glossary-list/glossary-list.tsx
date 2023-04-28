import React, { FunctionComponent } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  gradientRectangle
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';

interface IGlossaryList {
  termList: IGlossaryMap
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({termList}) => {

  const keys = Reflect.ownKeys(termList);
  return (
    <div className={listContainer}>
      <span className={title}>All Terms </span>
      {/*<div className={gradientRectangle} />*/}
        <div className={termContainer}>
          {keys.map((key) =>
            <>
              <div className={sectionHeader}>{key}</div>
                <div className={sectionTerms}>
                  {Reflect.get(termList, key).map((term) => {
                    return(
                      <div>{term.term}</div>
                    )
                  })
                }
                </div>
            </>
          )}
        </div>
    </div>
  )
}

export default GlossaryList;
