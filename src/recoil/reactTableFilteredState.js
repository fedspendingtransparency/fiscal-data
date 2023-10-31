import { atom } from 'recoil';

export const reactTableFilteredState = atom({
  key: 'reactTableFilteredState',
  default: false,
});

export const reactTableFilteredDateRangeState = atom({
  key: 'reactTableFilteredDateRangeState',
  default: null,
});
