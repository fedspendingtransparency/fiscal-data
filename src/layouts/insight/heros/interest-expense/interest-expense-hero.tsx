import React from 'react';
import { ReactElement } from 'react';
import { sectionHeading } from '../../insight.module.scss';
import { useGetInterestExpenseData } from '../../sections/interest-expense/useGetInterestExpenseData';

export const InterestExpenseHero = (): ReactElement => {
  const { startFY, currentFY } = useGetInterestExpenseData();

  return (
    <h1 className={sectionHeading}>
      {startFY && currentFY ? `Interest Expense and Average Interest Rates on the National Debt FY ${startFY} – FYTD ${currentFY}` : ''}
    </h1>
  );
};
