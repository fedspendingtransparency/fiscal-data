import { apiPrefix, basicFetch } from '../utils/api-utils';
import { createCachedFetchStore } from './createCachedFetchStore';

const fetchDebtOutstanding = async () => {
  const endpointUrl = 'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101';
  const response = await basicFetch(`${apiPrefix}${endpointUrl}`);
  return response.data;
};
export const debtOutstandingData = createCachedFetchStore(fetchDebtOutstanding);
