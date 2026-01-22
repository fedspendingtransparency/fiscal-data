import React, { FunctionComponent } from 'react';
import { listHeader, citationContainer, iconContainer, citationText, citationList } from './citation-list.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons/faExternalLink';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import Heading from '../heading/heading';
import { analyticsEventHandler } from '../../helpers/insights/insight-helpers';

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

const CitationList: FunctionComponent<ICitationList> = ({ header, citations, headingLevel = 'h2', pageName }: ICitationList) => {
  return (
    <>
      <nav>
        <Heading headingLevel={headingLevel} className={listHeader}>
          {header}
        </Heading>
        <ul className={citationList}>
          {citations.map((citation: ICitation, index: number) => {
            const linkText = `${citation.text} ${!citation?.external ? '| U.S. Treasury Fiscal Data' : ''}`;
            return (
              <li className={citationContainer} key={index}>
                <CustomLink url={citation.url} onClick={() => analyticsEventHandler(pageName, citation.text)}>
                  <div className={citationText} id={citation.text}>
                    <div className={iconContainer}>
                      <FontAwesomeIcon icon={citation?.external ? faExternalLink : faLink} />
                    </div>
                    <>{linkText}</>
                  </div>
                </CustomLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default CitationList;
