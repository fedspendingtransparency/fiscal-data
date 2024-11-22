import React, { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { sectionHeading } from '../../insight.module.scss';
import { getCurrentInterestExpData, getOlderInterestExpData } from '../../sections/interest-expense/interest-expense';

export const InterestExpenseHero = (): ReactElement => {
  const [headerText, setHeaderText] = useState(null);

  useEffect(() => {
    const constructInterestPageHeader = async () => {
      const currentResult = await getCurrentInterestExpData();
      const olderResult = await getOlderInterestExpData();
      const currentFY = currentResult.data[0].record_fiscal_year;
      const recordFY = olderResult.data[0].record_fiscal_year;
      let start;
      if (currentFY - 20 > recordFY) {
        start = currentFY - 20;
      } else {
        start = recordFY;
      }
      setHeaderText(`Interest Expense and Average Interest Rates on the National Debt FY ${start} – FYTD ${currentFY}`);
    };

    constructInterestPageHeader();
  }, []);

  return <h1 className={sectionHeading}>{headerText ? headerText : ''}</h1>;
};
