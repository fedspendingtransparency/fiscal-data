import { selector } from 'recoil';
import { atom } from 'recoil';
import { apiPrefix, basicFetch } from '../utils/api-utils';

export const debtToThePennyLastFetchedState = atom({
  key: 'debtToThePennyLastCachedState',
  default: '',
});

export const debtToThePennyDataState = selector({
  key: 'debtToThePennyDataState',
  get: async ({ get }) => {
    const fields = 'fields=tot_pub_debt_out_amt,record_date';
    const sort = 'sort=-record_date';
    const pagination = 'page[size]=1&page[number]=1';
    const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
    const debtUrl = `${apiPrefix}${endpointUrl}`;
    const response = await basicFetch(debtUrl);
    return response.data;
  },
});
