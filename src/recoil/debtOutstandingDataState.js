import { selector, atom } from 'recoil';
import { apiPrefix, basicFetch } from '../utils/api-utils';

export const debtOutstandingLastCachedState = atom({
  key: 'debtOutstandingLastCachedState',
  default: 0,
});

export const debtOutstandingData = selector({
  key: 'debtOutstandingData',
  get: async ({ get }) => {
    const endpointUrl = `v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101`;
    const debtUrl = `${apiPrefix}${endpointUrl}`;
    const response = await basicFetch(debtUrl);
    const timeStamp = Date.now();
    return {
      payload: response.data,
      timeStamp: timeStamp,
    };
  },
});
