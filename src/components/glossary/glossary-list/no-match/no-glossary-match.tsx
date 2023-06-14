import React, { FunctionComponent } from 'react';
import {
  unmatchedTerm,
  suggestions,
  noMatchContainer,
  suggestionsList
} from './no-glossary-match.module.scss';
interface NoMatchI {
  filter: string
}

const NoGlossaryMatch:FunctionComponent<NoMatchI> = ({filter}) => {
  return (
    <div className={noMatchContainer}>
      <div>
        <span>No match found for </span>
        <span className={unmatchedTerm}>'{filter}.'</span>
      </div>
      <span className={suggestions}>Suggestions</span>
      <ul className={suggestionsList}>
        <li>Check for spelling errors.</li>
        <li>Try again with a different term.</li>
      </ul>
    </div>
  )
}

export default NoGlossaryMatch;
