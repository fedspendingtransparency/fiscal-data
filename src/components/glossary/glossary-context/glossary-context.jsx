import React, { createContext, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

export const GlossaryContext = createContext({});

const GlossaryProvider = ({ children }) => {
  const [glossaryClickEvent, setGlossaryClickEvent] = useState(false);

  const allGlossary = useStaticQuery(
    graphql`
      query {
        allGlossaryCsv {
          glossaryCsv: nodes {
            term
            definition
            site_page
            id
            url_display
            url_path
          }
        }
      }
    `
  );
  const glossary = allGlossary.allGlossaryCsv.glossaryCsv;
  glossary.map(
    term =>
      (term.slug = term.term
        .toLowerCase()
        .split(' ')
        .join('-'))
  );

  return <GlossaryContext.Provider value={{ glossaryClickEvent, setGlossaryClickEvent, glossary }}>{children}</GlossaryContext.Provider>;
};

export default GlossaryProvider;
