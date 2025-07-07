import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useState, useEffect, useMemo } from 'react';
import { queryClient } from '../../../../../react-query-client';
import { getMonth } from 'date-fns';

const getLatestCompleteMonth = async () => {
  const data = await basicFetch(`https://api.fiscaldata.treasury.gov/services/calendar/release`);
  const filteredDataset = data.filter(entry => entry.datasetId === '015-BFS-2014Q3-yy');

  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const filteredMonth = filteredDataset.filter(entry => getMonth(new Date(entry.date)) === currentMonth);
  const lastDay = filteredMonth[1];
  if (lastDay.released === 'false') {
    // 0 for January
    return getMonth(new Date(lastDay.date)) - 1;
  } else {
    return getMonth(new Date(lastDay.date));
  }
};

const getTotalSumCount = async () => {
  const endpoint = 'v1/accounting/od/slgs_securities';
  const fields =
    'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
    'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,' +
    'outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,' +
    'record_calendar_month,record_calendar_day,record_calendar_year';
  return basicFetch(`${apiPrefix}${endpoint}?fields=${fields}&sort=-record_date&page[size]=10000`);
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

  useEffect(() => {
    queryClient.ensureQueryData([`${apiPrefix}${endpoint}?fields=${fields}&sort=-record_date&page[size]=10000`], getTotalSumCount).then(res => {
      setResult(res);
    });
  }, []);

  useEffect(() => {
    queryClient.ensureQueryData([`${apiPrefix}/services/calendar/release`], getLatestCompleteMonth).then(res => {
      setLatestMonth(res);
    });
  }, []);

  const generateAmountTicks = (chartData): number[] => {
    const amountValues = chartData.map(element => element.expense);
    const max = Math.max(...amountValues);
    // TODO: Add rounding internal for amount
    const top = Math.round(max);
    const ticks = [];
    for (let i = 0; i <= top; i += 1) {
      ticks.push(i);
    }
    return ticks;
  };

  const generateCountTicks = (chartData): number[] => {
    const countValues = chartData.map(element => element.expense);
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
    result,
    latestMonth,
  };
};
