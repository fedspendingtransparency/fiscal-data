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
  const lastDay = currentMonthData[0];
  const lastCompletedMonth = lastDay.released === 'false' ? convertDate(lastDay.date) : convertDate(lastDay.date) + 1;
  return getMonth(lastCompletedMonth);
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

/* Next steps
based chart dates on date range
 */

export const useGetStateAndLocalGovernmentSeriesData = (
  setSelectedStartDate,
  setSelectedEndDate,
  selectedStartDate,
  selectedEndDate,
  dateRange
): { xAxisValues: string[]; xAxisMobileValues; chartData } => {
  const [chartData, setChartData] = useState(null);
  const [datasetDateRange, setDatasetDateRange] = useState();
  const [xAxisValues, setXAxisValues] = useState<string[]>(null);
  const [xAxisMobileValues, setXAxisMobileValues] = useState<string[]>(null);
  const [latestDate, setLatestDate] = useState(null);
  const totalMonths = getMonthDifference(dateRange?.from, dateRange?.to);

  useEffect(() => {
    getDatasetDateRange().then(async completeDateRange => setDatasetDateRange(completeDateRange));
    getLastCompletedMonth('015-BFS-2014Q3-yy').then(async lastCompleteMonth => {
      getChartDates(lastCompleteMonth, totalMonths).then(async chartDates => {
        setXAxisValues(chartDates);
        setLatestDate(chartDates[0]);

        setXAxisMobileValues(chartDates.filter(index => index % 2 !== 0));
        getChartData(chartDates).then(chartData => setChartData(chartData));
      });
    });
  }, [dateRange]);

  return {
    xAxisValues,
    xAxisMobileValues,
    chartData,
    latestDate,
    datasetDateRange,
  };
};
