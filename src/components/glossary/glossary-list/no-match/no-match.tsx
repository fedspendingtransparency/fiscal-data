import React, { FunctionComponent } from 'react';
import {
  unmatchedTerm,
  suggestions,
  noMatchContainer,
  suggestionsList
} from './no-match.module.scss';
interface NoMatchI {
  term: string
}

const NoMatch:FunctionComponent<NoMatchI> = ({term}) => {
  return (
    <div className={noMatchContainer}>
      <div>
        <span>No match found for </span>
        <span className={unmatchedTerm}>'{term}.'</span>
      </div>
      <span className={suggestions}>Suggestions</span>
      <ul className={suggestionsList}>
        <li>Check for spelling errors.</li>
        <li>Try again with a different term.</li>
      </ul>
    </div>
  )
}

export default NoMatch;
