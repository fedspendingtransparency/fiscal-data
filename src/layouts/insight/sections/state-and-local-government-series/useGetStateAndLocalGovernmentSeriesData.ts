import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useEffect, useMemo, useState } from 'react';
import { format, getMonth } from 'date-fns';
import { convertDate } from '../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';

const slgsEndpoint = 'v1/accounting/od/slgs_securities';
const releaseCalendarUrl = `https://api.fiscaldata.treasury.gov/services/calendar/release`;

const getCurrentMonthData = async datasetId => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  return await basicFetch(releaseCalendarUrl).then(res => {
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
      allRecords.reverse();
      return allRecords;
    }
  });
};

export const useGetStateAndLocalGovernmentSeriesData = (): { xAxisValues: string[]; xAxisMobileValues; chartData } => {
  const [chartData, setChartData] = useState(null);
  const [xAxisValues, setXAxisValues] = useState<string[]>(null);
  const [xAxisMobileValues, setXAxisMobileValues] = useState<string[]>(null);
  const [mergedTableData, setMergedTableData] = useState<any[]>([]);

  useEffect(() => {
    getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleteMonth => {
      getChartDates(lastCompleteMonth).then(async chartDates => {
        setXAxisValues(chartDates);
        setXAxisMobileValues(chartDates.filter(index => index % 2 !== 0));
        getChartData(chartDates).then(chartData => setChartData(chartData));
      });
    });
  }, []);

  const chartData1 = [
    { date: '2024-07-30', totalAmount: 320883, totalCount: 1052 },
    { date: '2024-08-31', totalAmount: 194402, totalCount: 2709 },
  ];

  useMemo(() => {
    const newTableData = chartData1.map(item => {
      return {
        date: format(new Date(item.date), 'MMMM yyyy'),
        totalAmount: '$' + item.totalAmount.toLocaleString(),
        totalCount: item.totalCount.toLocaleString(),
      };
    });
    setMergedTableData(newTableData);
  }, [chartData]);

  const columnConfigArray = ['Date', 'Amount', 'Count'];

  const columnConfig = useMemo(() => {
    return [
      { property: 'date', name: 'Date', type: 'string' },
      { property: 'totalAmount', name: 'Amount', type: 'string' },
      { property: 'totalCount', name: 'Count', type: 'string' },
    ];
  }, []);

  return {
    xAxisValues,
    xAxisMobileValues,
    chartData,
    columnConfig,
    mergedTableData,
  };
};
