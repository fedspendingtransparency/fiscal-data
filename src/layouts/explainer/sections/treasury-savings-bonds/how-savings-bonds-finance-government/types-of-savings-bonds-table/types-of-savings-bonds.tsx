import React from 'react';
import { tableContainer, rowContainer, headerBox, contentBox, singular, bondTitle } from './types-of-savings-bonds.module.scss';

const TypesOfSavingsBonds = () => {
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

  return (
    <>
      <div className={tableContainer}>
        {tableContent.map(column => {
          return (
            <div className={rowContainer}>
              <div className={headerBox}>{column.name}</div>
              {column.name === 'Type' ? (
                column.content.map(content => {
                  return <div className={[contentBox, bondTitle].join(' ')}>{content}</div>;
                })
              ) : column.content.length > 1 ? (
                column.content.map(content => {
                  return <div className={contentBox}>{content}</div>;
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
