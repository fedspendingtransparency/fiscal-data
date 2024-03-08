import { findGlossaryTerm } from './glossary-terms';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';
import reactStringReplace from 'react-string-replace';

export const glossaryLookup = (value, glossary, page, customFormat) => {
  const entry = findGlossaryTerm(value, glossary)?.filter(e => e.site_page.includes(page.split(' ')[0]))[0];
  let glossaryTerm = '';
  let definition = '';
  let definitionFormatted;
  let slug = '';

  if (entry) {
    glossaryTerm = entry.term;
    definition = entry.definition;
    slug = entry.slug;
    if (customFormat) {
      let count = 0;
      definitionFormatted = reactStringReplace(definition, customFormat.text, (match, index) => {
        count = count + 1;
        if (count === customFormat.index + 1) {
          if (customFormat.format === 'underline') {
            return <u>{match}</u>;
          }
        }
        return match;
      });
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
