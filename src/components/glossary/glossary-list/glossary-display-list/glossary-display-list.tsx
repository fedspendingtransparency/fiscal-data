import React from 'react';
import { matchedSubstring, sectionHeader, sectionTerms, termText } from '../glossary-list.module.scss';
import reactStringReplace from 'react-string-replace';


const GlossaryDisplayList = ({displayList, filter, selectedTermHandler}) => {

  const onTermClick = (e, term) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      selectedTermHandler(term);
    }
  }

  const underlineMatch = (term, filter) => {
    const filterString = filter.replace(/[/\-\\^$*+?.()|[\]{}]/g,'\\$1');
    const regex = new RegExp(`(${filterString})`, 'ig');
    const strReplace = reactStringReplace(term, regex, (match) =>
      <span className={matchedSubstring}>{match}</span>);

    return (
      filter.length === 0 ? (<span>{term}</span>) : (<span>{strReplace}</span>)
    );
  }

  return (
    <>
      {
        displayList.map((section) => {
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
                        {underlineMatch(term.term, filter)}
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
