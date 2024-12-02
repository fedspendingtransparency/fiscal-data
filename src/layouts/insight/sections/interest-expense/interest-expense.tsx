import React from 'react';
import { InterestExpenseChart } from './interest-expense-chart/interest-expense-chart';
import { BodyCopy } from './body-copy/body-copy';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';

const getCurrentInterestExpData = async () => {
  return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`);
};

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

export const interestExpenseDescriptionGenerator = () => {
  return getCurrentInterestExpData().then(res => {
    const currentFY = res.data[0].record_fiscal_year;
    const interestExpDate = res.data[0].record_date;

    let isHas = true;

    if (interestExpDate.includes('-09-30')) {
      isHas = false;
    }
    return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&filter=record_date:eq:${interestExpDate}`).then(res => {
      const fytdInterestExpense = res.data.reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
      return `In ${currentFY}, the federal government ${isHas ? 'has ' : ''}spent $${getShortForm(
        fytdInterestExpense,
        false,
        false,
        1
      )} on interest expenses on the national debt.`;
    });
  });
};

export default interestExpenseSections;
