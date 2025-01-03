import React, { FunctionComponent } from 'react';
import { listHeader, citationContainer, iconContainer, citationText } from './citation-list.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import Heading from '../heading/heading';

interface ICitation {
  url: string;
  text: string;
  external?: boolean;
}

interface ICitationList {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  header: string;
  citations: ICitation[];
}

const CitationList: FunctionComponent<ICitationList> = ({ header, citations, headingLevel = 'h2' }: ICitationList) => {
  return (
    <>
      <Heading headingLevel={headingLevel} className={listHeader}>
        {header}
      </Heading>
      {citations.map((citation: { url: string; text: string; external?: boolean }, index: number) => (
        <div className={citationContainer} key={index}>
          <CustomLink url={citation.url}>
            <div className={citationText}>
              <div className={iconContainer}>
                <FontAwesomeIcon icon={citation?.external ? faExternalLink : faLink} />
              </div>
              <span>{citation.text}</span>
            </div>
          </CustomLink>
        </div>
      ))}
    </>
  );
};

export default CitationList;
