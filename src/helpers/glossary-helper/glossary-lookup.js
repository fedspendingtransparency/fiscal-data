import { findGlossaryTerm } from './glossary-terms';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';
export const glossaryLookup = (value, glossary, page) => {
  const entry = findGlossaryTerm(value, glossary)?.filter(e =>
    e.site_page.includes(page.split(' ')[0])
  )[0]
  let glossaryTerm = '';
  let definition = '';
  let definitionSplit = [];
  let definitionFormatted;
  let slug = '';

  if (entry) {
    glossaryTerm = entry.term;
    definition = entry.definition;
    slug = entry.slug;
    if (entry.url_display && entry.url_path) {
      definitionSplit = definition.split(entry.url_display);
      if (definitionSplit[0] !== definition) {
        definitionFormatted = (
          <span>
            {definitionSplit[0]}
            <CustomLink url={entry.url_path}>{entry.url_display}</CustomLink>
            {definitionSplit[1]}
          </span>
        )
      }
    }
  }
  return {
    termName: glossaryTerm,
    definition: definitionFormatted ? definitionFormatted : definition,
    slug: slug
  };
}
