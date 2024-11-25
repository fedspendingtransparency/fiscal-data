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
  const [chartData, setChartData] = useState(null);

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
        const groupedExpenseDataByFY = groupByProperty(res.data, 'record_fiscal_year');
        for (const year in groupedExpenseDataByFY) {
          const yearData = groupedExpenseDataByFY[year];
          if (year !== current) {
            const sum = yearData
              .filter(element => element.record_calendar_month === '09')
              .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
            chartData.push({ year: year, expense: sum });
          } else {
            const currentFYSum = yearData
              .filter(element => element.record_calendar_month === interestExpMonth && element.record_fiscal_year === current)
              .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
            chartData.push({ year: year, expense: currentFYSum });
          }
        }
        // Interest rate chart data
        basicFetch(
          `${apiPrefix}v2/accounting/od/avg_interest_rates?sort=-record_date&filter=security_desc:eq:Total%20Interest-bearing%20Debt,record_fiscal_year:gte:${start}&page[size]=300`
        ).then(res => {
          const groupedInterestRateByFY = groupByProperty(res.data, 'record_fiscal_year');
          for (const year in groupedInterestRateByFY) {
            const yearData = groupedInterestRateByFY[year];
            if (year !== current) {
              const rate = yearData.filter(element => element.record_calendar_month === '09');
              const index = chartData.findIndex(element => element.year === rate[0].record_fiscal_year);
              chartData[index].rate = parseFloat(rate[0].avg_interest_rate_amt);
            } else {
              const currentRate = yearData.filter(
                element => element.record_calendar_month === interestExpMonth && element.record_fiscal_year === current
              );
              const index = chartData.findIndex(element => element.year === currentRate[0].record_fiscal_year);
              chartData[index].rate = parseFloat(currentRate[0].avg_interest_rate_amt);
            }
          }
          setChartData(chartData);
        });
      });
    };
    gatherData();
  }, []);
  return { startFY, currentFY, chartData };
};
