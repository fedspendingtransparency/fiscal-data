import React from 'react';
import { tableContainer, rowContainer, headerBox, contentBox, singular, bondTitle } from './types-of-savings-bonds.module.scss';

const TypesOfSavingsBonds = ({ tableContent }) => {
  return (
    <>
      <div
        className={tableContainer}
        aria-label={
          'An infographic that explains the differences between I bonds and EE bonds. ' +
          'Series I bonds are savings bonds that help purchasers protect their money from inflation. ' +
          'They are primarily sold in electronic form. I bond interest rates are a combination of a fixed rate and a variable rate based on inflation. ' +
          'EE bonds are guaranteed to double in value in 20 years from their purchase date. ' +
          'They are sold only in electronic form and earn a fixed rate of interest. ' +
          'Both I bonds and EE are redeemable after one year. ' +
          'If redeemed within five years, the interest accumulated in the last three months will be deducted from the final payout.  '
        }
      >
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
