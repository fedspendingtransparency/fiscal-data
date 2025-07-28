import { apiCalls } from './slgs-helper';

export const toDateRange = '?sort=-record_date&page[size]=1';
export const fromDateRange = `?sort=record_date&page[size]=1`;

const { fields: chartDatesFields } = apiCalls.chartDates;
const { fields: chartDataFields } = apiCalls.chartData;

export const chartDates = `?fields=${chartDatesFields}&filter=record_calendar_year:lte:2024&sort=-record_date&page[size]=345`;
export const chartData = `?fields=${chartDataFields}&sort=-record_date&page[size]=10000`;
export const chartDatesRes = {
  data: [
    { record_calendar_month: '1', record_calendar_year: '2025', record_date: '2025-01-01' },
    { record_calendar_month: '12', record_calendar_year: '2024', record_date: '2024-12-01' },
    { record_calendar_month: '11', record_calendar_year: '2024', record_date: '2024-11-01' },
    { record_calendar_month: '10', record_calendar_year: '2024', record_date: '2024-10-01' },
    { record_calendar_month: '9', record_calendar_year: '2024', record_date: '2024-09-01' },
    { record_calendar_month: '8', record_calendar_year: '2024', record_date: '2024-08-01' },
  ],
};

export const chartDataRes = {
  data: [
    {
      outstanding_0_3_mos_amt: '31651863930.03',
      outstanding_0_3_mos_cnt: '906',
      outstanding_2_5_yrs_amt: '23552433264.00',
      outstanding_2_5_yrs_cnt: '4956',
      outstanding_3_6_mos_amt: '12318138163.00',
      outstanding_3_6_mos_cnt: '367',
      outstanding_5_10_yrs_amt: '8051741646.00',
      outstanding_5_10_yrs_cnt: '2656',
      outstanding_6_mos_to_2_yrs_amt: '8075075604.00',
      outstanding_6_mos_to_2_yrs_cnt: '2353',
      outstanding_over_10_yrs_amt: '2018566342.00',
      outstanding_over_10_yrs_cnt: '3291',
      record_calendar_day: '31',
      record_calendar_month: '10',
      record_calendar_year: '2025',
      record_date: '2024-10-31',
    },
  ],
};
