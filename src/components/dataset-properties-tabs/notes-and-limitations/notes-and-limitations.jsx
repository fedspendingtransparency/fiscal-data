import React, { useEffect, useState } from 'react';
import { accordion, accordionContainer, bodyContent, heading, wrapper } from './notes-and-limitations.module.scss';
import Accordion from '../../accordion/accordion';
import { MarkdownTransform } from '../../markdown-transform/markdown-transform';

export const sectionTitle = 'Notes & Known Limitations';

const NotesAndLimitations = ({ apis, bodyText, hideRawDataTable }) => {
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
                <MarkdownTransform content={api.apiNotesAndLimitations} isBanner={false} />
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
        <MarkdownTransform content={bodyText} isBanner={false} />
        {!!tablesNKL.length && !hideRawDataTable && <div className={accordionContainer}>{tablesNKL}</div>}
      </div>
    </div>
  );
};

export default NotesAndLimitations;
