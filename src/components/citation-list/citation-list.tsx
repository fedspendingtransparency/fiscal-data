import React from 'react';
import { listHeader, citationContainer, iconContainer, citationText } from './citation-list.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faExternalLink } from '@fortawesome/free-solid-svg-icons';

const CitationList = ({ header, citations, headingLevel = '2' }) => {
  const HeaderTag = 'h' + headingLevel;
  return (
    <>
      <HeaderTag className={listHeader}>{header}</HeaderTag>
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
