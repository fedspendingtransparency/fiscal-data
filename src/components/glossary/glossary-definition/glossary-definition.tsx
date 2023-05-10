import React from 'react';
import { FunctionComponent } from 'react';
import { IGlossaryTerm } from '../../../models/IGlossaryTerm';
import {
  termName,
  officialDefinition,
  definitionContainer
} from './glossary-definition.module.scss';

interface IGlossaryDefinition {
  glossaryTerm: IGlossaryTerm
}


const GlossaryDefinition:FunctionComponent<IGlossaryDefinition> = ({glossaryTerm}) => {
  const {term, definition} = glossaryTerm;

  return (
    <div className={definitionContainer}>
      <span className={termName}>{term}</span>
      <span className={officialDefinition}>Official Definition</span>
      <span>{definition}</span>
    </div>
  )
}

export default GlossaryDefinition;
