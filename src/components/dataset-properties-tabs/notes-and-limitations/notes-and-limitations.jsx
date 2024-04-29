import React, { useState, useEffect, useContext } from 'react';
import { accordion, accordionContainer, bodyContent, heading, wrapper } from './notes-and-limitations.module.scss';
import ReactMarkdown from 'react-markdown';
import Accordion from '../../accordion/accordion';

export const sectionTitle = 'Notes & Known Limitations';

const NotesAndLimitations = ({ apis, bodyText }) => {
  const [tablesNKL, setTablesNKL] = useState([]);

  useEffect(() => {
    if (apis && apis.length) {
      setTablesNKL(
        apis
          .filter(api => api.apiNotesAndLimitations)
          .map(api => {
            const key = `N&KL-${api.apiId}`;
            return (
              <Accordion containerClass={accordion} key={key} title={api.tableName}>
                <ReactMarkdown children={api.apiNotesAndLimitations} />
              </Accordion>
            );
          })
      );
    }
  }, []);

  return (
    <div className={wrapper}>
      <h4 className={heading}>{sectionTitle}</h4>
      <div className={bodyContent}>
        <ReactMarkdown children={bodyText} />
        {!!tablesNKL.length && <div className={accordionContainer}>{tablesNKL}</div>}
      </div>
    </div>
  );
};

export default NotesAndLimitations;
