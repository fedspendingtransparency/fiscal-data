import React from 'react';
import InfoTip from "../info-tip/info-tip";
import {findGlossaryTerm} from "../../helpers/glossary-helper/glossary-terms";
import CustomLink from "../links/custom-link/custom-link";

const GlossaryTerm = ({term, page, glossary, children}) => {

  const lookupTerm = (value) => {
    const entry = findGlossaryTerm(value, glossary)
      .filter(e => (e.site_page.includes(page.split(' ')[0])))[0];
    let glossaryTerm = '';
    let definition = '';
    let definitionSplit = [];
    let definitionFormatted;

    if (entry) {
      glossaryTerm = entry.term;
      definition = entry.definition;
      if (entry.url_display && entry.url_path) {
        definitionSplit = definition.split(entry.url_display);
        if(definitionSplit[0] !== definition) {
          definitionFormatted =
            <span>
              {definitionSplit[0]}
              <CustomLink url={entry.url_path}>{entry.url_display}</CustomLink>
              {definitionSplit[1]}
            </span>;
        }
      }
    }
    return [glossaryTerm, definitionFormatted ? definitionFormatted : definition];
  }

  const glossaryDisplayedTerm = children.toString();
  const glossaryEntry = lookupTerm(term);

  return (
    <InfoTip title={glossaryEntry[0]}
             glossaryText={glossaryDisplayedTerm}
    >
      {glossaryEntry[1]}
    </InfoTip>
  )
};

export default GlossaryTerm;

