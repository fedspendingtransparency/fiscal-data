import React, { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { sectionHeading } from '../../insight.module.scss';

export const InterestExpenseHero = (): ReactElement => {
  const [headerText, setHeaderText] = useState(null);

  useEffect(() => {
    const constructInterestPageHeader = async () => {
      const currentResult = await basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`);
      const olderResult = await basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`);
      const currentFY = currentResult.data[0].record_fiscal_year;
      const recordFY = olderResult.data[0].record_fiscal_year;
      let start;
      if (currentFY - 20 > recordFY) {
        start = currentFY - 20;
      } else {
        start = recordFY;
      }
      setHeaderText(`Interest Expense and Average Interest Rates on the National Debt FY ${start} – ${currentFY}`);
    };

    constructInterestPageHeader();
  }, []);

  return <div className={sectionHeading}>{headerText ? headerText : ''}</div>;
};
