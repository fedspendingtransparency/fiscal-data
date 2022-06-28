import React, {useState} from 'react';
import InfoTip from "../info-tip/info-tip";
import {findGlossaryTerm} from "../../helpers/glossary-helper/glossary-terms";
import CustomLink from "../links/custom-link/custom-link";

const GlossaryTerm = ({glossaryTerm, page, glossary, children}) => {
  const [hovered, setHovered] = useState(false);

  const getDefinition = (value) => {
    let entry = findGlossaryTerm(value, glossary).filter(e => (e.site_page === page))[0];
    let definition = '';
    let splitDefinition = [];
    let formattedDefinition;

    if (entry) {
      definition = entry.definition;
      if (entry.url_display && entry.url_path) {
        splitDefinition = definition.split(entry.url_display);
        if(splitDefinition[0] !== definition) {
          formattedDefinition =
            <span>
              {splitDefinition[0]}
              <CustomLink url={entry.url_path}>{entry.url_display}</CustomLink>
              {splitDefinition[1]}
            </span>;
        }
      }
    }
    return formattedDefinition ? formattedDefinition : definition;
  }

  const handleMouseOver = () => {
    if(!hovered) {
      setTimeout(() => {
        setHovered(true);
      }, 5000);
    }
  }

  const glossaryDisplayedTerm = children.toString();
  const glossaryDefinition = getDefinition(glossaryTerm);

  return (
    <>
      <InfoTip title={glossaryTerm}
               clickEvent={handleMouseOver}
               glossaryText={glossaryDisplayedTerm}
      >
        {glossaryDefinition}
      </InfoTip>
    </>
  )
};

export default GlossaryTerm;

