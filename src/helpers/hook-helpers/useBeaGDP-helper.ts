import { apiPrefix, basicFetch } from '../../utils/api-utils';

// data[0].fiscal_data_year or whatever
const mts5 = apiPrefix + '/v1/accounting/mts/mts_table_5?sort=-record_date';
const mts4 = apiPrefix + '/v1/accounting/mts/mts_table_4?sort=-record_date';
const debtOutstanding = apiPrefix + 'v2/accounting/od/debt_outstanding?sort=-record_date';

export const isOtherDataUpdated = (otherDataToCheck: string, currentYear: number) => {
  const currentYearString = currentYear.toString();
  let isOtherDataCurrent = false;
  return isOtherDataCurrent;
};
