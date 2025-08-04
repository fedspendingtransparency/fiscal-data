import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useEffect, useMemo, useState } from 'react';
import { format, getMonth } from 'date-fns';
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
  return await basicFetch(releaseCalendarUrl).then(res => {
    return res.filter(entry => entry.datasetId === datasetId && getMonth(convertDate(entry.date)) === currentMonth);
  });
};

const getLastCompletedMonth = async datasetId => {
  const currentMonthData = await getCurrentMonthData(datasetId);
  if (currentMonthData.length) {
    const { released, date } = currentMonthData[0];
    const latestDate = convertDate(date);
    const month = latestDate.getMonth() + 1;
    const year = month === 1 && !released ? latestDate.getFullYear() - 1 : latestDate.getFullYear();
    const lastMonth = month === 1 ? 12 : month - 1;
    const lastCompletedMonth = !released ? lastMonth : month;
    return { month: lastCompletedMonth, year: year };
  }
};

const getChartDates = async (lastCompleteMonth, totalMonths = 12, lastYear = 2025) => {
  const currentYear = lastYear ? lastYear : new Date().getFullYear();
  const allDates = [];
  const size = totalMonths * 23 + 253;
  let totalYears = 1;
  const { fields, sort } = apiCalls.chartDates;
  await basicFetch(`${apiPrefix}${slgsEndpoint}?fields=${fields}&filter=record_calendar_year:lte:${lastYear}&sort=${sort}&page[size]=${size}`).then(
    chartData => {
      for (let i = 0; i < totalMonths; i++) {
        if (chartData.data) {
          if (i - lastCompleteMonth > 0 && (i - lastCompleteMonth) % 12 === 0) {
            totalYears = totalYears + 1;
          }
          const yearCheck = lastCompleteMonth - i > 0 ? currentYear : currentYear - totalYears;
          const nextMonth = lastCompleteMonth - i > 0 ? lastCompleteMonth - i : 12 * totalYears + lastCompleteMonth - i;
          const curMonth = chartData.data.filter(
            entry => Number(entry.record_calendar_month) === nextMonth && Number(entry.record_calendar_year) === yearCheck
          );
          allDates.push(curMonth[0].record_date);
        }
      }
    }
  );
  return allDates;
};

const getDatasetDateRange = async () => {
  const { sort: maxSort } = apiCalls.toDateRange;
  const { sort: minSort } = apiCalls.fromDateRange;
  const max = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=${maxSort}&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  const min = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=${minSort}&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  return { from: min, to: max };
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

const getAxisValues = (totalMonths, chartDates) => {
  let axisVals;

  if (!totalMonths || totalMonths <= 12) {
    axisVals = chartDates;
  } else if (totalMonths <= 24) {
    axisVals = chartDates.filter(index => index % 2 !== 0);
  } else {
    axisVals = chartDates.filter(val => val.includes('-01-'));
  }
  return axisVals;
};

export const useGetStateAndLocalGovernmentSeriesData = (dateRange: {
  from: Date;
  to: Date;
}): {
  xAxisMobileValues: string[];
  chartData: unknown;
  totalMonths: number;
  datasetDateRange: { from: string; to: string };
  xAxisValues: string[];
} => {
  const [chartData, setChartData] = useState(null);
  const [datasetDateRange, setDatasetDateRange] = useState<{ from: string; to: string }>();
  const [xAxisValues, setXAxisValues] = useState<string[]>(null);
  const [xAxisMobileValues, setXAxisMobileValues] = useState<string[]>(null);
  const [mergedTableData, setMergedTableData] = useState<any[]>([]);

  const totalMonths = getMonthDifference(dateRange?.from, dateRange?.to);
  useEffect(() => {
    getDatasetDateRange().then(async completeDateRange => setDatasetDateRange(completeDateRange));
  }, []);

  useEffect(() => {
    getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleted => {
      const { month: lastCompleteMonth, year } = lastCompleted;
      let chartEndMonth = lastCompleteMonth;
      let chartEndYear = year;
      if (dateRange?.to) {
        const useDateRange = dateRange.to?.getFullYear() < year || dateRange.to?.getMonth() + 1 < lastCompleteMonth;
        chartEndMonth = useDateRange ? dateRange.to.getMonth() + 1 : lastCompleteMonth;
        chartEndYear = useDateRange ? dateRange.to.getFullYear() : year;
      }

      if (lastCompleteMonth)
        getChartDates(chartEndMonth, totalMonths, chartEndYear).then(async chartDates => {
          setXAxisValues(getAxisValues(totalMonths, chartDates));
          setXAxisMobileValues(chartDates.filter(index => index % 2 !== 0));
          getChartData(chartDates).then(chartData => setChartData(chartData));
        });
    });
  }, [dateRange]);

  useMemo(() => {
    if (chartData) {
      const newTableData = chartData.map(item => {
        return {
          date: format(new Date(item.date), 'MMMM yyyy'),
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
    xAxisValues,
    xAxisMobileValues,
    chartData,
    datasetDateRange,
    totalMonths,
    columnConfig,
    columnConfigArray,
    mergedTableData,
  };
};
