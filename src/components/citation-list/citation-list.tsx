import React from 'react';
import { listHeader, citationContainer, iconContainer } from './citation-list.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
const CitationList = ({ header, citations, headingLevel = 'h2' }) => {
  const HeaderTag = React.createElement(headingLevel, { className: listHeader }, header);
  return (
    <>
      {HeaderTag}
      {citations.map(citation => (
        <CustomLink url={citation.url}>
          <div className={citationContainer}>
            <div className={iconContainer}>
              <FontAwesomeIcon icon={faLink} />
            </div>
            <span>{citation.text}</span>
          </div>
        </CustomLink>
      ))}
    </>
  );
};

export default CitationList;
