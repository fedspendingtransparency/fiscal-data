import React from 'react';
import { InterestExpenseChart } from './interest-expense-chart/interest-expense-chart';
import CustomLink from '../../../../components/links/custom-link/custom-link';

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

const BodyCopy = () => (
  <div>
    Interest Expense is the interest the government pays on its outstanding loans (Treasury securities). It can be referred to as the cost to the U.S.
    for borrowing money. The amount of interest expense depends on the total federal debt and the interest rates investors charged when they loaned
    the money. Average interest rates are a useful measure for showing general trends in the interest the government pays on its loans, even though
    the true cost of the loans will vary by security type and by the interest rate for those securities when the loan was taken. To see a breakdown of
    average rates by security, visit the{' '}
    <CustomLink url={'/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities'}>
      Average Interest Rates on U.S. Treasury Securities
    </CustomLink>{' '}
    dataset.
  </div>
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
