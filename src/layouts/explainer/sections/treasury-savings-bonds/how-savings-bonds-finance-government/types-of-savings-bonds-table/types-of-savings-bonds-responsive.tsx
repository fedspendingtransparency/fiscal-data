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

const TypesOfSavingsBondsResponsive = () => {
  const tableContent = [
    {
      name: 'Type',
      content: ['I Bonds', 'EE Bonds'],
    },
    {
      name: 'Primary Advantage',
      content: ["Protect buyer's money from inflation", 'Guaranteed to double in value in 20 years'],
    },
    {
      name: 'Issuing Method',
      content: ['Primarily Electronic', 'Electronic Only'],
    },
    {
      name: 'Interest Earnings',
      content: ['A fixed interest rate and a variable rate based on inflation', 'A steady interest rate that does not change'],
    },
    {
      name: 'Redemption',
      content: [
        'Redeemable after 1 year; if redeemed in the first five years, the interest accumulated from the last three months will be deducted from the final payout',
      ],
    },
  ];

  const [isShadow, setIsShadow] = useState(false);
  const [isGradient, setIsGradient] = useState(true);

  const scrollHandler = e => {
    if (e.target.scrollLeft + e.target.clientWidth === e.target.scrollWidth) {
      setIsGradient(false);
    } else if (e.target.scrollLeft === 0) {
      setIsShadow(false);
    } else {
      setIsShadow(true);
      setIsGradient(true);
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
        {isShadow && <div className={shadow} />}
        <div className={scrollContainer} onScroll={scrollHandler}>
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
        {isGradient && <div className={gradient} />}
      </div>
    </>
  );
};

export default TypesOfSavingsBondsResponsive;
