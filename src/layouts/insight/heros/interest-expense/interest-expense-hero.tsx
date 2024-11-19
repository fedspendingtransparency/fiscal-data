import { ReactElement } from 'react';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';

export const InterestExpenseHero = (): ReactElement => {
  const constructInterestPageHeader = async () => {
    const result = await basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`);
    const currentFY = result.data[result.data.length - 1].record_fiscal_year;
    const recordFY = result.data[0].record_fiscal_year;
    let start;
    if (currentFY - 20 > recordFY) {
      start = currentFY - 20;
    } else {
      start = recordFY;
    }
    return `Interest Expense and Average Interest Rates on the National Debt FY ${start} – ${currentFY}`;
  };

  return <div>{constructInterestPageHeader()}</div>;
};
