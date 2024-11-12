import React from 'react';

export const InterestExpenseChartHeader = ({ fiscalYear, interestExpenseAmount, rateAmount }) => {
  return (
    <div>
      <div>
        <div>
          <span> {fiscalYear} </span>
          <span> FYTD </span>
        </div>
        <div>
          <span> {interestExpenseAmount} </span>
          <span> Interest Expense </span>
        </div>
        <div>
          <span> {rateAmount} </span>
          <span> Avg. Interest Rate </span>
        </div>
      </div>
    </div>
  );
};
