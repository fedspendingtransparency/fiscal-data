import { findGlossaryTerm } from './glossary-terms';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';
import reactStringReplace from 'react-string-replace';

const customFormatting = {
  'Debt Held by the Public': {
    text: 'not',
    format: 'underline',
    index: 0,
  },
};

export const applyFormatting = (definition, term) => {
  let count = 0;
  const customFormat = customFormatting[term];
  return reactStringReplace(definition, customFormat?.text, (match, index) => {
    count = count + 1;
    if (count === customFormat.index + 1) {
      if (customFormat.format === 'underline') {
        return <u>{match}</u>;
      }
    }
    return match;
  });
};

export const glossaryLookup = (value, glossary, page) => {
  const entry = findGlossaryTerm(value, glossary)?.filter(e => e.site_page.includes(page.split(' ')[0]))[0];
  let glossaryTerm = '';
  let definition = '';
  let definitionFormatted;
  let slug = '';

  if (entry) {
    glossaryTerm = entry.term;
    definition = entry.definition;
    slug = entry.slug;
    definitionFormatted = definition;
    const customFormat = customFormatting[glossaryTerm];
    if (customFormat) {
      definitionFormatted = applyFormatting(definitionFormatted, glossaryTerm);
    }
    if (entry.url_display && entry.url_path) {
      definitionFormatted = reactStringReplace(definitionFormatted, entry.url_display, match => {
        return <CustomLink url={entry.url_path}>{match}</CustomLink>;
      });
    }
  }

  return {
    termName: glossaryTerm,
    definition: definitionFormatted ? definitionFormatted : definition,
    slug: slug,
  };
};
