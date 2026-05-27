import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useEffect, useMemo, useState } from 'react';
import { format, getMonth, getYear } from 'date-fns';
import { convertDate } from '../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';
import { apiCalls, releaseCalendarUrl, slgsEndpoint } from './slgs-helper';

const getMonthDifference = (startDate, endDate) => {
  if (startDate && endDate) {
    const yearDiff = Math.abs(startDate.getYear() - endDate.getYear());
    const monthDiff = startDate.getMonth() - endDate.getMonth();
    return yearDiff * 12 - monthDiff + 1;
  }
};

const getCurrentMonthData = async datasetId => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();
  return await basicFetch(releaseCalendarUrl).then(res => {
    return res.filter(
      entry => entry.datasetId === datasetId && getMonth(convertDate(entry.date)) === currentMonth && getYear(convertDate(entry.date)) === currentYear
    );
  });
};

const getLastCompletedMonth = async datasetId => {
  const currentMonthData = await getCurrentMonthData(datasetId);
  if (currentMonthData.length) {
    const { released, date } = currentMonthData[0];
    const latestDate = convertDate(date);
    const month = latestDate.getMonth() + 1;
    const year = month === 1 && released === 'false' ? latestDate.getFullYear() - 1 : latestDate.getFullYear();
    const lastMonth = month === 1 ? 12 : month - 1;
    const lastCompletedMonth = released === 'false' ? lastMonth : month;
    return { month: lastCompletedMonth, year: year };
  }
};

// creates array of chart dates, starting from the last available date and working back
const getChartDates = async (lastCompleteMonth, totalMonths = 12, endYear) => {
  const allDates = [];
  const size = totalMonths * 23 + 253; // 23 is the max business days within a month
  let totalYears = 1;
  const { fields, sort } = apiCalls.chartDates;
  const filter = `record_calendar_year:lte:${endYear}`;
  await basicFetch(`${apiPrefix}${slgsEndpoint}?fields=${fields}&filter=${filter}&sort=${sort}&page[size]=${size}`).then(chartData => {
    if (chartData.data) {
      for (let i = 0; i < totalMonths; i++) {
        const month = lastCompleteMonth - i;
        if (i - lastCompleteMonth > 0 && (i - lastCompleteMonth) % 12 === 0) {
          totalYears = totalYears + 1;
        }
        const year = month > 0 ? endYear : endYear - totalYears;
        const curMonth = month > 0 ? month : 12 * totalYears + month;
        const curMonthData = chartData.data.filter(
          entry => Number(entry.record_calendar_month) === curMonth && Number(entry.record_calendar_year) === year
        );
        if (curMonthData.length) {
          allDates.push(curMonthData[0].record_date);
        }
      }
    }
  });
  return allDates;
};

const getDatasetDateRange = async lastCompletedDate => {
  const { sort: maxSort } = apiCalls.toDateRange;
  const { sort: minSort } = apiCalls.fromDateRange;
  const filterMonth = lastCompletedDate.month < 10 ? '0' + lastCompletedDate.month : lastCompletedDate.month;
  const maxFilter = `record_calendar_year:eq:${lastCompletedDate.year},record_calendar_month:eq:${filterMonth}`;
  const max = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=${maxSort}&filter=${maxFilter}&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  const min = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=${minSort}&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  return { from: min, fromFormatted: format(convertDate(min), 'MMMM yyyy'), to: max, toFormatted: format(convertDate(max), 'MMMM yyyy') };
};

const getChartData = async allDates => {
  const { fields, sort } = apiCalls.chartData;
  return basicFetch(`${apiPrefix}${slgsEndpoint}?fields=${fields}&sort=${sort}&page[size]=10000`).then(amountCountData => {
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

const getLineChartAxisValues = (totalMonths, chartDates) => {
  return totalMonths > 24 ? chartDates.filter(val => val.includes('-01-')) : chartDates.filter((val, index) => index % 2 === 0);
};

export const useGetStateAndLocalGovernmentSeriesData = (dateRange: {
  from: Date;
  to: Date;
}): {
  chartData: { date: string; totalAmount: number; totalCount: number }[];
  mergedTableData: { date: string; totalAmount: string; totalCount: string }[];
  totalMonths: number;
  lineChartXAxisValues: string[];
  columnConfig: { property: string; name: string; type: string }[];
  datasetDateRange: { from: string; to: string; fromFormatted: string; toFormatted: string };
  columnConfigArray: string[];
} => {
  const [chartData, setChartData] = useState<{ date: string; totalAmount: number; totalCount: number }[]>(null);
  const [datasetDateRange, setDatasetDateRange] = useState<{ from: string; to: string }>();
  const [lineChartXAxisValues, setXAxisValues] = useState<string[]>(null);
  const [mergedTableData, setMergedTableData] = useState<{ date: string; totalAmount: string; totalCount: string }[]>([]);

  const totalMonths = getMonthDifference(dateRange?.from, dateRange?.to);

  useEffect(() => {
    getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleted => {
      const { month: lastCompleteMonth, year } = lastCompleted;
      getDatasetDateRange(lastCompleted).then(async completeDateRange => setDatasetDateRange(completeDateRange));
      let chartEndMonth = lastCompleteMonth;
      let chartEndYear = year;
      if (dateRange?.to) {
        const useDateRange = dateRange.to?.getFullYear() < year || dateRange.to?.getMonth() + 1 < lastCompleteMonth;
        chartEndMonth = useDateRange ? dateRange.to.getMonth() + 1 : lastCompleteMonth;
        chartEndYear = useDateRange ? dateRange.to.getFullYear() : year;
      }

      if (lastCompleteMonth)
        getChartDates(chartEndMonth, totalMonths, chartEndYear).then(async chartDates => {
          setXAxisValues(getLineChartAxisValues(totalMonths, chartDates));
          getChartData(chartDates).then(chartData => setChartData(chartData));
        });
    });
  }, [dateRange]);

  useMemo(() => {
    if (chartData) {
      const newTableData = chartData.map(item => {
        return {
          date: format(new Date(item.date), 'yyyy-MM-dd'),
          totalAmount: '$' + item.totalAmount.toLocaleString(),
          totalCount: item.totalCount.toLocaleString(),
        };
      });
      setMergedTableData(newTableData);
    }
  }, [chartData]);

  const columnConfigArray = ['Date', 'Amount', 'Count'];

  const columnConfig = [
    { property: 'date', name: 'Date', type: 'DATE' },
    { property: 'totalAmount', name: 'Amount', type: 'NUMBER' },
    { property: 'totalCount', name: 'Count', type: 'NUMBER' },
  ];

  return {
    chartData,
    totalMonths,
    datasetDateRange,
    lineChartXAxisValues,
    columnConfig,
    columnConfigArray,
    mergedTableData,
  };
};
