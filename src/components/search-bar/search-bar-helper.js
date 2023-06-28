import reactStringReplace from 'react-string-replace';
import React from 'react';
import { matchedSubstring } from './search-bar.module.scss';

export const underlineMatchedString = (term, filter) => {
  const filterString = filter.replace(/[/\\^$*+?.()|[\]{}]/g,'\\$1');
  const regex = new RegExp(`(${filterString})`, 'ig');
  const strReplace = reactStringReplace(term, regex, (match) =>
    <span className={matchedSubstring}>{match}</span>);

  return filter.length ?  <span>{strReplace}</span> : <span>{term}</span>;
}
