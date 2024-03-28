import { selector, atom } from 'recoil';
import { apiPrefix, basicFetch } from '../utils/api-utils';

export const savingsBondTypesLastCachedState = atom({
  key: 'savingsBondTypesLastCachedState ',
  default: 0,
});

export const savingsBondTypesData = selector({
  key: 'savingsBondTypesData',
  get: async ({ get }) => {
    const numOfSavingsBonds = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond';
    const response = await basicFetch(`${apiPrefix}${numOfSavingsBonds}&page[size]=1`).then(metaRes => {
      if (metaRes.meta && typeof metaRes.meta['total-pages'] !== 'undefined') {
        const pageSize = metaRes.meta['total-pages'];
        return basicFetch(`${apiPrefix}${numOfSavingsBonds}&page[size]=${pageSize}`);
      }
    });
    const timeStamp = Date.now();
    return {
      payload: response.data,
      timeStamp: timeStamp,
    };
  },
});
