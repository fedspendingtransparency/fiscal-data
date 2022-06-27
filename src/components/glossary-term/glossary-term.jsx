import React, {useState} from 'react';
import {
  term
} from "./glossary-term.module.scss";
import InfoTip from "../info-tip/info-tip";
import {findGlossaryTerm} from "../../helpers/glossary-helper/glossary-terms";
import CustomLink from "../links/custom-link/custom-link";

const GlossaryTerm = ({glossaryTerm, page, children}) => {
  const [hovered, setHovered] = useState(false);
  const glossaryExample = [
    {
      id: 1,
      term: 'Marketable Securities',
      site_page: 'Debt Explainer',
      definition: 'These securities (Treasury Bills, Treasury Bonds, Treasury Notes, and Treasury Inflation Protected Securities) can be traded on the secondary market and have ownership transferred from one person or entity to another.',
      urlDisplay: '',
      urlPath: ''
    },
    {
      id: 2,
      term: 'Non-Marketable Securities',
      site_page: 'Debt Explainer',
      definition: 'Test',
      urlDisplay: '',
      urlPath: ''
    },
    {
      id: 3,
      term: 'Bills',
      site_page: 'Debt explainer',
      definition: 'Bills are short-term government securities with maturities ranging from a few days to 52 weeks. For more information on Treasury bills visit Treasury Direct.',
      urlDisplay: 'Treasury Direct',
      urlPath: 'https://www.treasurydirect.gov/indiv/products/prod_tbills_glance.htm'
    }
  ]


  const getDefinition = (value) => {
    let entry = findGlossaryTerm(value, glossaryExample);
    let definition = '';
    let splitDefinition = [];
    let formattedDefinition;

    if (entry[0]) {
      definition = entry[0].definition;
      if (entry[0].urlDisplay && entry[0].urlPath) {
        splitDefinition = definition.split(entry[0].urlDisplay);
        formattedDefinition =
          <span>
            {splitDefinition[0]}
            <CustomLink url={entry[0].urlPath}>{entry[0].urlDisplay}</CustomLink>
            {splitDefinition[1]}
          </span>;
      }
    }
    return formattedDefinition ? formattedDefinition : definition;
  }

  const handleMouseOver = () => {
    if(!hovered) {
      setTimeout(() => {
        setHovered(true);
      }, 500);
    }
  }

  const glossaryDisplayedTerm = children.toString();
  const glossaryDefinition = getDefinition(glossaryTerm);

  return (
    <>
      {hovered ? (
        <>
          <InfoTip title={glossaryTerm}
                   secondary={"Hello again"}
                   clickEvent={handleMouseOver}
                   textButton={glossaryDisplayedTerm}
          >
            {glossaryDefinition}
          </InfoTip>
        </>
      ) : (
        <>
         <span className={term}
               onMouseEnter={handleMouseOver}
               onFocus={handleMouseOver}
         >
           {glossaryDisplayedTerm}
        </span>
        </>
      )}
    </>
  )
};

export default GlossaryTerm;

