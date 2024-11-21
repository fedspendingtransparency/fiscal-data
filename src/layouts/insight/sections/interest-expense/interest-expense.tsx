import React from 'react';
import { InterestExpenseChart } from './interest-expense-chart/interest-expense-chart';
import { BodyCopy } from './body-copy/body-copy';
import CustomLink from '../../../../components/links/custom-link/custom-link';

export const interestExpenseDataSources = (
  <>
    Visit the{' '}
    <CustomLink url={'/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding'}>
      Interest Expense on the Debt Outstanding
    </CustomLink>{' '}
    and{' '}
    <CustomLink url={'/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities'}>
      Average Interest Rates on U.S. Treasury Securities
    </CustomLink>{' '}
    datasets to explore and download this data. The interest expense reflects the sum of all interest paid on the debt for each fiscal year or through
    the latest month of the latest fiscal year. The average interest rate is the average of all interest rates on outstanding securities for the last
    month of each fiscal year or the most recent month with available data. Because this rate is an average of rates paid on various security types,
    the interest expense cannot be determined by multiplying the average interest rate by the outstanding debt.
  </>
);

const interestExpenseSections = [
  {
    index: 0,
    component: <BodyCopy />,
  },
  {
    index: 1,
    component: <InterestExpenseChart />,
  },
];

export default interestExpenseSections;
