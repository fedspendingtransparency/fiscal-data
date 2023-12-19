import { apiPrefix, basicFetch } from '../../utils/api-utils';

const mts5 = apiPrefix + 'v1/accounting/mts/mts_table_5?sort=-record_date';
const mts4 = apiPrefix + 'v1/accounting/mts/mts_table_4?sort=-record_date';
const debtOutstanding = apiPrefix + 'v2/accounting/od/debt_outstanding?sort=-record_date';

export const useVerifyAdditionalChartData = () => {
  const currentYearString = new Date().getFullYear().toString();

  const getDebtOutstanding = async () => {
    const response = await basicFetch(debtOutstanding);
    if (response.data) {
      const debtOutstandingCurrentYear = response.data[0].record_calendar_year;
      return debtOutstandingCurrentYear === currentYearString;
    }
  };

  const getMTS4 = async () => {
    const response = await basicFetch(mts4);
    if (response.data) {
      const mts4CurrentMonth = response.data[0].record_calendar_month;
      return mts4CurrentMonth >= 9;
    }
  };

  const getMTS5 = async () => {
    const response = await basicFetch(mts5);
    if (response.data) {
      const mts5CurrentMonth = response.data[0].record_calendar_month;
      return mts5CurrentMonth >= 9;
    }
  };

  return { getDebtOutstanding, getMTS4, getMTS5 };
};
