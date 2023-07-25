import React, { FunctionComponent } from 'react';
import {
  sectionHeader,
  sectionTerms,
  termText
} from './glossary-display-list.module.scss';
import { IGlossaryListSection } from '../../../../helpers/glossary-helper/glossary-data';
import { underlineMatchedString } from '../../../search-bar/search-bar-helper';

interface IGlossaryDisplayList {
  sortedList: IGlossaryListSection[],
  filter: string,
  selectedTermHandler: (e) => void,
  setTabReset: (reset: boolean) => void,
}
const GlossaryDisplayList:FunctionComponent<IGlossaryDisplayList> = ({sortedList, filter, selectedTermHandler, setTabReset }) => {

  const onTermClick = (e, term) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      selectedTermHandler(term);
    }
    setTabReset(true);
  }

  return (
    <>
      {
        sortedList.map((section) => {
          const header = section[0]?.term?.charAt(0);
          return (
            <React.Fragment key={header}>
              <div className={sectionHeader}>
                {header}
              </div>
              <div className={sectionTerms}>
                {
                  section.map((term) => {
                    return (
                      <div
                        className={termText}
                        tabIndex={0}
                        role={'button'}
                        key={term.term}
                        onClick={(e) => onTermClick(e, term)}
                        onKeyPress={(e) => onTermClick(e, term)}
                      >
                        {underlineMatchedString(term.term, filter)}
                      </div>
                    );
                  })
                }
              </div>
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default GlossaryDisplayList;
