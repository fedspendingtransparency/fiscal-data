import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useState, useEffect, useMemo } from 'react';
import { queryClient } from '../../../../../react-query-client';
import { getMonth, getYear } from 'date-fns';

const getSlgsData = async () => {
  const lastMonthData = await basicFetch(`https://api.fiscaldata.treasury.gov/services/calendar/release`);
  const filteredDataset = lastMonthData.filter(entry => entry.datasetId === '015-BFS-2014Q3-yy');
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();
  const filteredMonth = filteredDataset.filter(entry => getMonth(new Date(entry.date)) === currentMonth);
  const lastDay = filteredMonth[1];
  let lastCompleteMonth;
  if (lastDay.released === 'false') {
    // 0 for January
    lastCompleteMonth = getMonth(new Date(lastDay.date));
  } else {
    lastCompleteMonth = new Date(lastDay.date) + 1;
  }
  const listOfRecordsData = await basicFetch(
    `${apiPrefix}/v1/accounting/od/slgs_securities?fields=record_date,record_calendar_month,record_calendar_day,record_calendar_year&sort=-record_date&page[size]=500`
  );
  const allDates = [];
  for (let i = 0; i < 12; i++) {
    if (listOfRecordsData) {
      const yearCheck = lastCompleteMonth - i > 0 ? currentYear : currentYear - 1;
      const nextMonth = lastCompleteMonth - i > 0 ? lastCompleteMonth - i : 12 + lastCompleteMonth - i;
      const curMonth = listOfRecordsData.data.filter(
        entry => Number(entry.record_calendar_month) === nextMonth && Number(entry.record_calendar_year) === yearCheck
      );
      allDates.push(curMonth[0].record_date);
      console.log(allDates);
    }
  }

  const endpoint = 'v1/accounting/od/slgs_securities';
  const fields =
    'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
    'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,' +
    'outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,' +
    'record_calendar_month,record_calendar_day,record_calendar_year';
  const amountCountData = await basicFetch(`${apiPrefix}${endpoint}?fields=${fields}&sort=-record_date&page[size]=10000`);
  if (amountCountData) {
    const allRecords = amountCountData.data
      .filter(entry => allDates.includes(entry.record_date))
      .map(entry => ({
        date: entry.record_date,
        totalAmount: Math.round(
          Number(entry.outstanding_0_3_mos_amt) +
            Number(entry.outstanding_3_6_mos_amt) +
            Number(entry.outstanding_6_mos_to_2_yrs_amt) +
            Number(entry.outstanding_2_5_yrs_amt) +
            Number(entry.outstanding_5_10_yrs_amt) +
            Number(entry.outstanding_over_10_yrs_amt)
        ),
        totalCount: Math.round(
          Number(entry.outstanding_0_3_mos_cnt) +
            Number(entry.outstanding_3_6_mos_cnt) +
            Number(entry.outstanding_6_mos_to_2_yrs_cnt) +
            Number(entry.outstanding_2_5_yrs_cnt) +
            Number(entry.outstanding_5_10_yrs_cnt) +
            Number(entry.outstanding_over_10_yrs_cnt)
        ),
      }));
    return allRecords;
  }
};

export const useGetStateAndLocalGovernmentSeriesData = (shouldHaveChartData: boolean) => {
  const [result, setResult] = useState(null);
  const [latestMonth, setLatestMonth] = useState(null);
  const [chartData, setChartData] = useState(null);
  // TODO: Confirm if I need rawData split out between Amount and Count
  const [rawData, setRawData] = useState(null);

  const endpoint = 'v1/accounting/od/slgs_securities';
  const fields =
    'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
    'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,' +
    'outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,' +
    'record_calendar_month,record_calendar_day,record_calendar_year';

  const generateAmountTicks = (chartData): number[] => {
    const amountValues = chartData.map(element => element.totalAmount);
    const max = Math.max(...amountValues);
    // TODO: Add rounding internal for amount
    const top = Math.round(max);
    const ticks = [];
    for (let i = 0; i <= top; i += 1) {
      ticks.push(i);
    }
    return ticks;
  };

  useEffect(() => {
    queryClient.ensureQueryData([`${apiPrefix}/services/calendar/release`], getSlgsData).then(res => {
      setChartData(res);
    });
  }, []);

  const generateCountTicks = (chartData): number[] => {
    const countValues = chartData.map(element => element.totalCount);
    const max = Math.max(...countValues);
    // TODO: Add rounding internal for amount
    const top = Math.round(max);
    const ticks = [];
    for (let i = 0; i <= top; i += 1) {
      ticks.push(i);
    }
    return ticks;
  };

  useMemo(() => {
    if (result) {
      const gatherChartData = async () => {
        const chartData = [];
        // Amount and Count Chart data
        await basicFetch(`${apiPrefix}${endpoint}?fields=${fields}&sort=-record_date&page[size]=10000`).then(res1 => {
          setRawData(res1);
        });
      };
      if (shouldHaveChartData) {
        gatherChartData();
      }
    }
  }, [result]);

  const testVar = 52;

  return {
    chartData,
  };
};
