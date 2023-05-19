import React, { FunctionComponent } from 'react';
import {
  matchedSubstring,
  sectionHeader,
  sectionTerms,
  termText
} from './glossary-display-list.module.scss';
import reactStringReplace from 'react-string-replace';
import { IGlossaryListSection } from '../../../../helpers/glossary-helper/glossary-data';

interface IGlossaryDisplayList {
  sortedList: IGlossaryListSection[],
  filter: string,
  selectedTermHandler: (e) => void,

}
const GlossaryDisplayList:FunctionComponent<IGlossaryDisplayList> = ({sortedList, filter, selectedTermHandler}) => {

  const onTermClick = (e, term) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      selectedTermHandler(term);
    }
  }

  const underlineMatchedString = (term, filter) => {
    const filterString = filter.replace(/[/\-\\^$*+?.()|[\]{}]/g,'\\$1');
    const regex = new RegExp(`(${filterString})`, 'ig');
    const strReplace = reactStringReplace(term, regex, (match) =>
      <span className={matchedSubstring}>{match}</span>);

    return filter.length ?  <span>{strReplace}</span> : <span>{term}</span>;
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
