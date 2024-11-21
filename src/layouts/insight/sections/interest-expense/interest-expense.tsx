import React from 'react';
import { InterestExpenseChart } from './interest-expense-chart/interest-expense-chart';
import { BodyCopy } from './body-copy/body-copy';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';

export const getCurrentInterestExpData = async () => {
  return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`);
};

export const getOlderInterestExpData = async () => {
  return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`);
};

export const interestExpenseDataSources = (
  <>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
    quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur
    aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
    quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
    voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
    voluptas nulla pariatur?
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

    console.log(currentFY, interestExpDate);

    let isHas = false;

    if (interestExpDate.includes('-09-30')) {
      isHas = true;
    }
    return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&filter=record_date:eq:${interestExpDate}`).then(res => {
      const fytdInterestExpense = res.data.reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
      console.log(fytdInterestExpense);
      return `In ${currentFY}, the federal government ${isHas ? 'has ' : ''}spent ${getShortForm(
        fytdInterestExpense,
        false,
        false,
        1
      )} on interest expenses on the national debt.`;
    });
  });
};

export default interestExpenseSections;
