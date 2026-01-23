import { findGlossaryTerm } from './glossary-terms';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';
import reactStringReplace from 'react-string-replace';
import { getFiscalYearByDate } from '../dates/date-helpers';

const customFormatting = {
  'Debt Held by the Public': {
    text: 'not',
    format: 'underline',
    index: 0,
  },
};

export const applyFormatting = entry => {
  let count = 0;
  const customFormat = customFormatting[entry.term];
  let definition = entry.definition;

  definition = reactStringReplace(definition, customFormat?.text, (match, index) => {
    count = count + 1;
    if (count === customFormat.index + 1) {
      if (customFormat.format === 'underline') {
        return <u key={index}>{match}</u>;
      }
    }
    return match;
  });

  if (entry.url_display && entry.url_path) {
    definition = urlFormat(entry, definition);
  }

  definition = handleFiscalYearCase(entry.term, definition);
  return definition;
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
      definitionFormatted = applyFormatting(entry);
    }
    if (!customFormat && entry.url_display && entry.url_path) {
      definitionFormatted = urlFormat(entry, definitionFormatted);
    }
    definitionFormatted = handleFiscalYearCase(entry, definitionFormatted);
  }

  return {
    termName: glossaryTerm,
    definition: definitionFormatted ? definitionFormatted : definition,
    slug: slug,
  };
};

export const urlFormat = (entry, definitionFormatted) => {
  return reactStringReplace(definitionFormatted, entry.url_display, (match, i) => {
    return (
      <CustomLink url={entry.url_path} key={i}>
        {match}
      </CustomLink>
    );
  });
};

const handleFiscalYearCase = (entry, definition) => {
  if (entry.term === 'Fiscal Year') {
    const fiscalYear = getFiscalYearByDate();
    const yearRgx = /(\d{4})/g;
    let index = 0;
    definition = reactStringReplace(definition, yearRgx, (match, i) => {
      const yearOffset = index++ === 2 ? 2 : 1;
      return <React.Fragment key={i}>{fiscalYear - yearOffset}</React.Fragment>;
    });
  }
  return definition;
};
