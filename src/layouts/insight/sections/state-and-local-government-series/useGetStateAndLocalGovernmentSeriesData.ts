import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useEffect, useMemo, useState } from 'react';
import { queryClient } from '../../../../../react-query-client';
import { getMonth } from 'date-fns';
import { convertDate } from '../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';

const slgsEndpoint = 'v1/accounting/od/slgs_securities';
const getCurrentMonthData = async datasetId => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  return await basicFetch(`https://api.fiscaldata.treasury.gov/services/calendar/release`).then(res => {
    return res.filter(entry => entry.datasetId === datasetId && getMonth(convertDate(entry.date)) === currentMonth);
  });
};

const getLastCompletedMonth = async datasetId => {
  const currentMonthData = await getCurrentMonthData(datasetId);
  const lastDay = currentMonthData[0];
  const lastCompletedMonth = lastDay.released === 'false' ? convertDate(lastDay.date) : convertDate(lastDay.date) + 1;
  return getMonth(lastCompletedMonth);
};

const getChartDates = async (lastCompleteMonth, totalMonths = 12) => {
  const currentYear = new Date().getFullYear();
  const allDates = [];
  await basicFetch(
    `${apiPrefix}${slgsEndpoint}?fields=record_date,record_calendar_month,record_calendar_day,record_calendar_year&sort=-record_date&page[size]=500`
  ).then(chartData => {
    for (let i = 0; i < totalMonths; i++) {
      if (chartData.data) {
        const yearCheck = lastCompleteMonth - i > 0 ? currentYear : currentYear - 1;
        const nextMonth = lastCompleteMonth - i > 0 ? lastCompleteMonth - i : 12 + lastCompleteMonth - i;
        const curMonth = chartData.data.filter(
          entry => Number(entry.record_calendar_month) === nextMonth && Number(entry.record_calendar_year) === yearCheck
        );
        allDates.push(curMonth[0].record_date);
      }
    }
  });
  return allDates;
};

const getChartData = async allDates => {
  const fields =
    'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
    'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,' +
    'outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,' +
    'record_calendar_month,record_calendar_day,record_calendar_year';
  return basicFetch(`${apiPrefix}${slgsEndpoint}?fields=${fields}&sort=-record_date&page[size]=10000`).then(amountCountData => {
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
  });
};

const getSlgsData = async () => {
  return getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleteMonth => {
    return getChartDates(lastCompleteMonth).then(async allDates => {
      return getChartData(allDates);
    });
  });
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

  // useEffect(() => {
  //   queryClient.ensureQueryData([`${apiPrefix}${endpoint}?fields=${fields}&sort=-record_date&page[size]=10000`], getTotalSumCount).then(res => {
  //     setResult(res);
  //   });
  // }, []);

  useEffect(() => {
    queryClient.ensureQueryData([`${apiPrefix}/services/calendar/release`], getSlgsData).then(res => {
      console.log(res);
      setResult(res);
    });
  }, []);

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
