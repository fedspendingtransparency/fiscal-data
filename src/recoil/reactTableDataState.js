import { atom } from 'recoil';

export const reactTableDataState = atom({
  key: 'reactTableData',
  default: null,
});

export const reactTablePageState = atom({
  key: 'reactTablePage',
  default: 0,
});

export const reactTableDePaginatedDataState = atom({
  key: 'reactTableDePaginatedDataState',
  default: [],
});
