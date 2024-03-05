import React, { useState } from 'react';
import {
  tableContainer,
  headerBox,
  contentBox,
  singular,
  bondTitle,
  typeBox,
  typeContainer,
  scrollContainer,
  columnContainer,
  gradient,
  shadow,
} from './types-of-savings-bonds-responsive.module.scss';

const TypesOfSavingsBondsResponsive = ({ tableContent }) => {
  const [isShadow, setIsShadow] = useState(false);
  const [isGradient, setIsGradient] = useState(true);

  const scrollHandler = e => {
    if (e.target.scrollLeft + e.target.clientWidth === e.target.scrollWidth) {
      setIsGradient(false);
    } else {
      setIsShadow(true);
      setIsGradient(true);
    }
    if (e.target.scrollLeft === 0) {
      setIsShadow(false);
    }
  };

  return (
    <>
      <div className={tableContainer}>
        {tableContent.map(column => {
          if (column.name === 'Type') {
            return (
              <div key={column.name} className={typeContainer}>
                {column.name === 'Type' && <div className={[headerBox, typeBox].join(' ')}>{column.name}</div>}
                {column.name === 'Type' &&
                  column.content.map(content => {
                    return (
                      <div key={content} className={[contentBox, bondTitle].join(' ')}>
                        {content}
                      </div>
                    );
                  })}
              </div>
            );
          }
        })}
        {isShadow && <div className={shadow} data-testid={'shadow'} />}
        <div className={scrollContainer} onScroll={scrollHandler} data-testid={'scroll-container'}>
          {tableContent.map(column => {
            return (
              <div key={column.name} className={columnContainer}>
                {column.name !== 'Type' && <div className={headerBox}>{column.name}</div>}
                {column.name !== 'Type' && column.content.length > 1
                  ? column.content.map(content => {
                      return (
                        <div key={content} className={contentBox}>
                          {content}
                        </div>
                      );
                    })
                  : column.name !== 'Type' && <div className={[contentBox, singular].join(' ')}>{column.content[0]}</div>}
              </div>
            );
          })}
        </div>
        {isGradient && <div className={gradient} data-testid={'gradient'} />}
      </div>
    </>
  );
};

export default TypesOfSavingsBondsResponsive;
