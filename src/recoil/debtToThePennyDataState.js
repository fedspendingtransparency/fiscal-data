import { apiPrefix, basicFetch } from '../utils/api-utils';
import { create } from 'zustand';

const cacheTime = 300000;
const fetchDebtToThePenny = async () => {
  const fields = 'fields=tot_pub_debt_out_amt,record_date';
  const sort = 'sort=-record_date';
  const pagination = 'page[size]=1&page[number]=1';
  const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl = `${apiPrefix}${endpointUrl}`;
  const response = await basicFetch(debtUrl);
  return response.data;
};
export const debtToThePennyData = create((set, get) => ({
  payload: null,
  timestamp: 0,
  lastCached: 0,
  status: 'idle',
  error: null,
  fetch: async () => {
    set({ status: 'loading' });
    try {
      const payload = await fetchDebtToThePenny();
      const now = Date.now();
      set({ payload, timeStamp: now, lastCached: now, status: 'hasValue', error: null });
    } catch (error) {
      set({ status: 'hasError', error });
    }
  },
  refreshIfStale: () => {
    const { lastCached, status, fetch } = get();
    if (status === 'loading') return;
    const now = Date.now();
    if (lastCached === 0 || now - lastCached >= cacheTime) {
      fetch();
    }
  },
}));
