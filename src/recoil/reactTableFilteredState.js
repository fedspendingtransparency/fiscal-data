import { atom } from 'recoil';

export const reactTableFilteredDateRangeState = atom({
  key: 'reactTableFilteredDateRangeState',
  default: null,
});

export const reactTableAllActiveFiltersState = atom({
  key: 'reactTableAllActiveFiltersState',
  default: [],
});

export const reactTableSortState = atom({
  key: 'reactTableSortState',
  default: [],
});
