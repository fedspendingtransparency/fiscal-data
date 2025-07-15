import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { useEffect, useState } from 'react';
import { getMonth } from 'date-fns';
import { convertDate } from '../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';

const slgsEndpoint = 'v1/accounting/od/slgs_securities';
const releaseCalendarUrl = `https://api.fiscaldata.treasury.gov/services/calendar/release`;

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

const getChartDates = async (lastCompleteMonth, totalMonths = 12) => {
  const currentYear = new Date().getFullYear();
  const allDates = [];
  const size = totalMonths * 23;
  let totalYears = 1;
  await basicFetch(
    `${apiPrefix}${slgsEndpoint}?fields=record_date,record_calendar_month,record_calendar_day,record_calendar_year&sort=-record_date&page[size]=${size}`
  ).then(chartData => {
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
  });
  return allDates;
};

const getDatasetDateRange = async () => {
  const max = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=-record_date&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  const min = await basicFetch(`${apiPrefix}${slgsEndpoint}?sort=record_date&page[size]=1`).then(res => {
    if (res.data?.length > 0) return res.data[0].record_date;
  });
  return { from: min, to: max };
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

export const useGetStateAndLocalGovernmentSeriesData = (dateRange: {
  from: string;
  to: string;
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
  const totalMonths = getMonthDifference(dateRange?.from, dateRange?.to);

  useEffect(() => {
    getDatasetDateRange().then(async completeDateRange => setDatasetDateRange(completeDateRange));
  }, []);

  useEffect(() => {
    getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleted => {
      const { month: lastCompleteMonth, year } = lastCompleted;
      let chartEndDate = lastCompleteMonth;
      if (dateRange?.to) {
        const useDateRange = dateRange.to?.getFullYear() < year || dateRange.to?.getMonth() + 1 < lastCompleteMonth;
        chartEndDate = useDateRange ? dateRange.to.getMonth() + 1 : lastCompleteMonth;
      }

      if (lastCompleteMonth)
        getChartDates(chartEndDate, totalMonths).then(async chartDates => {
          setXAxisValues(chartDates);

          setXAxisMobileValues(chartDates.filter(index => index % 2 !== 0));
          getChartData(chartDates).then(chartData => setChartData(chartData));
        });
    });
  }, [dateRange]);

  return {
    xAxisValues,
    xAxisMobileValues,
    chartData,
    datasetDateRange,
    totalMonths,
  };
};
