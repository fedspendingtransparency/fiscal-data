import { useEffect, useState } from 'react';
import { getCurrentInterestExpData, getOlderInterestExpData } from './interest-expense';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';

const groupByProperty = (array, property) => {
  return array.reduce((a, b) => {
    a[b[property]] = [...(a[b[property]] || []), b];
    return a;
  }, {});
};

export const useGetInterestExpenseData = () => {
  const [startFY, setStartFY] = useState(null);
  const [currentFY, setCurrentFY] = useState(null);
  const [interestExpenseAmountChartData, setInterestExpenseAmountChartData] = useState(null);
  const [interestRateChartData, setInterestRateChartData] = useState(null);

  useEffect(() => {
    const gatherData = async () => {
      const currentResult = await getCurrentInterestExpData();
      const olderResult = await getOlderInterestExpData();
      const current = currentResult.data[0].record_fiscal_year;
      const interestExpMonth = currentResult.data[0].record_calendar_month;
      const recordFY = olderResult.data[0].record_fiscal_year;
      let start;
      if (current - 20 > recordFY) {
        start = current - 20;
      } else {
        start = recordFY;
      }
      setCurrentFY(current);
      setStartFY(start);

      const chartData = [];
      // Expense Amount Chart Data
      await basicFetch(
        `${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&filter=record_fiscal_year:gte:${start}&page[size]=10000`
      ).then(res => {
        // console.log(current);
        // console.log(res.data);
        const groupedExpenseDataByFY = groupByProperty(res.data, 'record_fiscal_year');
        for (const year in groupedExpenseDataByFY) {
          const yearData = groupedExpenseDataByFY[year];
          if (year !== current) {
            const sum = yearData
              .filter(element => element.record_calendar_month === '09' && element.record_fiscal_year !== current)
              .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
            chartData.push({ year: year, expense: sum });
          } else {
            const currentFYSum = yearData
              .filter(element => element.record_calendar_month === interestExpMonth && element.record_fiscal_year === current)
              .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
            chartData.push({ year: year, expense: currentFYSum });
          }
        }
        console.log(chartData);
      });
    };
    gatherData();
  }, []);
  return { startFY, currentFY };
};
