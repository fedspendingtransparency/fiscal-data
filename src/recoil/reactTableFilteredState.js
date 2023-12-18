import { atom } from 'recoil';

export const reactTableFilteredDateRangeState = atom({
  key: 'reactTableFilteredDateRangeState',
  default: null,
});

export const reactTableSortingState = atom({
  key: 'reactTableSortingState',
  default: [],
});
