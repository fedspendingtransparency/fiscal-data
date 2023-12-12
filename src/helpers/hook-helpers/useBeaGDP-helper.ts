import { apiPrefix, basicFetch } from '../../utils/api-utils';

const mts5 = apiPrefix + '/v1/accounting/mts/mts_table_5?sort=-record_date';
const mts4 = apiPrefix + '/v1/accounting/mts/mts_table_4?sort=-record_date';
const debtOutstanding = apiPrefix + 'v2/accounting/od/debt_outstanding?sort=-record_date';

export const isOtherDataUpdated = async (otherDataToCheck: string, currentYear: number) => {
  const currentYearString = currentYear.toString();

  let isOtherDataCurrent = false;
  if (otherDataToCheck === 'debtOutstanding') {
    basicFetch(debtOutstanding).then(res => {
      if (res.data) {
        console.log('debtOutstanding', res.data);
        console.log(res.data[0].record_calendar_year);
        const debtOutstandingCurrentYear = res.data[0].record_calendar_year;
        if (debtOutstandingCurrentYear === currentYearString) {
          isOtherDataCurrent = true;
          console.log('Debt Outstanding year === current year');
        }
      }
    });
  } else if (otherDataToCheck === 'mts4') {
    basicFetch(mts4).then(res => {
      if (res.data) {
        const mts4CurrentMonth = res.data[0].record_calendar_month;
        // greater than or jsut equal to ??
        if (mts4CurrentMonth >= 9) {
          isOtherDataCurrent = true;
        }
      }
    });
  } else if (otherDataToCheck === 'mts5') {
    basicFetch(mts5).then(res => {
      if (res.data) {
        const mts5CurrentMonth = res.data[0].record_calendar_month;
        // greater than or jsut equal to ??
        if (mts5CurrentMonth >= 9) {
          isOtherDataCurrent = true;
        }
      }
    });
  }

  return isOtherDataCurrent;
};
