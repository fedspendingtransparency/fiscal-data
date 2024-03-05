import React from 'react';
import { tableContainer, rowContainer, headerBox, contentBox, singular, bondTitle } from './types-of-savings-bonds.module.scss';

const TypesOfSavingsBonds = ({ tableContent }) => {
  return (
    <>
      <div className={tableContainer}>
        {tableContent.map(column => {
          return (
            <div key={column.name} className={rowContainer}>
              <div className={headerBox}>{column.name}</div>
              {column.name === 'Type' ? (
                column.content.map(content => {
                  return (
                    <div key={content} className={[contentBox, bondTitle].join(' ')}>
                      {content}
                    </div>
                  );
                })
              ) : column.content.length > 1 ? (
                column.content.map(content => {
                  return (
                    <div key={content} className={contentBox}>
                      {content}
                    </div>
                  );
                })
              ) : (
                <div className={[contentBox, singular].join(' ')}>{column.content[0]}</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TypesOfSavingsBonds;
