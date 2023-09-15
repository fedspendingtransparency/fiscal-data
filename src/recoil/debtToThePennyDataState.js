import { selector } from 'recoil';
import { atom } from 'recoil';
import { basicFetch } from '../utils/api-utils';

export const debtToThePennyURLState = atom({
  key: 'debtToThePennyURLState',
  default: '',
});

export const debtToThePennyDataState = selector({
  key: 'debtToThePennyDataState',
  get: async ({ get }) => {
    const url = get(debtToThePennyURLState);
    const response = await basicFetch(url);
    return {
      data: response.data,
      url: url,
    };
  },
});
