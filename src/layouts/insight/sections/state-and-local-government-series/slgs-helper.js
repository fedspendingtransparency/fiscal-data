export const slgsEndpoint = 'v1/accounting/od/slgs_securities';
export const releaseCalendarUrl = `https://api.fiscaldata.treasury.gov/services/calendar/release`;

export const apiCalls = {
  chartDates: {
    fields: 'record_date,record_calendar_month,record_calendar_day,record_calendar_year',
    sort: '-record_date',
  },
  chartData: {
    fields:
      'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
      'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,' +
      'outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,' +
      'record_calendar_month,record_calendar_day,record_calendar_year',
    sort: '-record_date',
  },
  toDateRange: { sort: '-record_date' },
  fromDateRange: { sort: 'record_date' },
};
