import { useEffect, useMemo, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';
import { queryClient } from '../../../../../react-query-client';

const groupByProperty = (array, property) => {
  return array.reduce((a, b) => {
    a[b[property]] = [...(a[b[property]] || []), b];
    return a;
  }, {});
};

const getCurrentInterestExpData = async () => {
  return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`);
};

const getOlderInterestExpData = async () => {
  return basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`);
};

export const useGetInterestExpenseData = (shouldHaveChartData: boolean, isMobile: boolean = false) => {
  const [startFY, setStartFY] = useState<number>(null);
  const [currentFY, setCurrentFY] = useState<number>(null);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [chartXAxisValues, setChartXAxisValues] = useState<number[]>(null);
  const [expenseYAxisValues, setExpenseYAxisValues] = useState<number[]>(null);
  const [rateYAxisValues, setRateYAxisValues] = useState<number[]>(null);
  const [latestChartData, setLatestChartData] = useState<{
    year: number;
    expense: number;
    rate: number;
  }>(null);
  const [altText, setAltText] = useState<string>(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [olderResult, setOlderResult] = useState(null);

  useEffect(() => {
    queryClient
      .ensureQueryData([`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`], getOlderInterestExpData)
      .then(res => {
        setOlderResult(res);
      });
    queryClient
      .ensureQueryData([`${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&page[size]=1`], getCurrentInterestExpData)
      .then(res => {
        setCurrentResult(res);
      });
  }, []);

  const generateExpenseValueTicks = (chartData): number[] => {
    const expenseValues = chartData.map(element => element.expense);
    const max = Math.max(...expenseValues);
    // Round to nearest $300B interval
    const top = Math.round(max / 300000000000) * 300000000000;
    const ticks = [];
    for (let i = 0; i <= top; i += 300000000000) {
      ticks.push(i);
    }
    return ticks;
  };

  const generateInterestRateTicks = (chartData): number[] => {
    const rateValues = chartData.map(element => element.rate);
    const max = Math.max(...rateValues);
    const top = Math.ceil(max);
    const ticks = [];
    for (let i = 0; i <= top; i++) {
      ticks.push(i);
    }
    return ticks;
  };

  useMemo(() => {
    if (currentResult && olderResult) {
      const current = currentResult.data[0].record_fiscal_year;
      let interestExpMonth = currentResult.data[0].record_calendar_month;
      const recordFY = olderResult.data[0].record_fiscal_year;
      let start;
      if (current - 20 > recordFY) {
        start = current - 20;
      } else {
        start = recordFY;
      }
      setCurrentFY(current);
      setStartFY(start);

      const gatherChartData = async () => {
        const chartData = [];
        // Expense Amount Chart Data
        await basicFetch(
          `${apiPrefix}v2/accounting/od/interest_expense?sort=-record_date&filter=record_fiscal_year:gte:${start}&page[size]=10000`
        ).then(res1 => {
          // Interest rate chart data
          basicFetch(
            `${apiPrefix}v2/accounting/od/avg_interest_rates?sort=-record_date&filter=security_desc:eq:Total%20Interest-bearing%20Debt,record_fiscal_year:gte:${start}&page[size]=300`
          ).then(res2 => {
            const commonIndexExpense = res1.data.findIndex(element => element.record_calendar_month === res2.data[0].record_calendar_month);
            const commonIndexRate = res2.data.findIndex(element => element.record_calendar_month === res1.data[0].record_calendar_month);
            // Base chart data's most recent record where both datasets share the same month
            if (commonIndexExpense > 0) {
              res1.data = res1.data.slice(commonIndexExpense);
              interestExpMonth = res1.data[0].record_calendar_month;
            }
            if (commonIndexRate > 0) {
              res2.data = res2.data.slice(commonIndexRate);
            }
            const groupedExpenseDataByFY = groupByProperty(res1.data, 'record_fiscal_year');
            for (const year in groupedExpenseDataByFY) {
              const yearData = groupedExpenseDataByFY[year];
              if (year !== current) {
                const sum = yearData
                  .filter(element => element.record_calendar_month === '09')
                  .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
                if (sum > 0) {
                  chartData.push({ year: parseInt(year), expense: sum });
                }
              } else {
                const currentFYSum = yearData
                  .filter(element => element.record_calendar_month === interestExpMonth && element.record_fiscal_year === current)
                  .reduce((a, { fytd_expense_amt }) => a + parseInt(fytd_expense_amt), 0);
                chartData.push({ year: parseInt(year), expense: currentFYSum });
              }
            }
            const groupedInterestRateByFY = groupByProperty(res2.data, 'record_fiscal_year');
            for (const year in groupedInterestRateByFY) {
              const yearData = groupedInterestRateByFY[year];
              if (year !== current) {
                const rate = yearData.filter(element => element.record_calendar_month === '09');
                if (rate.length > 0) {
                  const index = chartData.findIndex(element => element.year === parseInt(rate[0].record_fiscal_year));
                  chartData[index].rate = parseFloat(rate[0].avg_interest_rate_amt);
                }
              } else {
                const currentRate = yearData.filter(
                  element => element.record_calendar_month === interestExpMonth && element.record_fiscal_year === current
                );
                const index = chartData.findIndex(element => element.year === parseInt(currentRate[0].record_fiscal_year));
                chartData[index].rate = parseFloat(currentRate[0].avg_interest_rate_amt);
              }
            }
            setChartData(chartData);
            // // Chart axis values
            // // Generate X Axis Values
            setExpenseYAxisValues(generateExpenseValueTicks(chartData));
            setRateYAxisValues(generateInterestRateTicks(chartData));

            const allYears = chartData.map(d => d.year);

            // Make sure we always include the current year
            if (!allYears.includes(parseInt(current))) {
              allYears.push(parseInt(current));
            }
            const filteredYears = isMobile
              ? allYears.filter((val, i) => i % 4 === 0 || val === parseInt(current))
              : allYears.filter((val, i) => i % 2 === 0 || val === parseInt(current));

            setChartXAxisValues(filteredYears);

            // const years = [];
            // chartData.forEach((element, index) => {
            //   if (index === 0) {
            //     years.push(element.year);
            //   } else {
            //     if (index % 4 === 0) {
            //       years.push(element.year);
            //     } else if (element.year === parseInt(current) && !years.includes(element.year)) {
            //       years.push(element.year);
            //     }
            //   }
            // });
            // setExpenseYAxisValues(generateExpenseValueTicks(chartData));
            // setRateYAxisValues(generateInterestRateTicks(chartData));
            const firstExpense = chartData[0].expense;
            const firstRate = chartData[0].rate;
            const lastExpense = chartData[chartData.length - 1].expense;
            const lastRate = chartData[chartData.length - 1].rate;
            const text = `A bar chart shows the total interest expense paid FYTD from ${start} to ${current},
             with a line graph overlay showing the average interest rates on the national debt. In ${start},
             the interest expense totaled $${getShortForm(firstExpense)} with an average interest rate of ${firstRate.toFixed(1)}%.
             In ${current}, the interest expense totaled $${getShortForm(lastExpense)},
             with an average interest rate of ${lastRate.toFixed(1)}%.  `;
            setAltText(text);
            setLatestChartData(chartData[chartData.length - 1]);
            setChartLoading(false);
          });
        });
      };
      if (shouldHaveChartData) {
        gatherChartData();
      }
    }
  }, [currentResult, olderResult]);
  return { startFY, currentFY, chartData, chartXAxisValues, expenseYAxisValues, rateYAxisValues, latestChartData, altText, chartLoading };
};
