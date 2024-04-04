import React from 'react';
import { FunctionComponent } from 'react';
import { IGlossaryTerm } from '../../../models/IGlossaryTerm';
import { termName, officialDefinition, definitionContainer } from './glossary-definition.module.scss';
import { applyFormatting } from '../../../helpers/glossary-helper/glossary-lookup';

interface IGlossaryDefinition {
  glossaryTerm: IGlossaryTerm;
}

const GlossaryDefinition: FunctionComponent<IGlossaryDefinition> = ({ glossaryTerm }) => {
  const { term } = glossaryTerm;
  const definitionDisplay = applyFormatting(glossaryTerm);
  return (
    <div className={definitionContainer}>
      <span className={termName}>{term}</span>
      <span className={officialDefinition}>Official Definition</span>
      <span>{definitionDisplay}</span>
    </div>
  );
};

export default GlossaryDefinition;
