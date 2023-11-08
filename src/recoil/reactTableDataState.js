import { atom } from 'recoil';

export const reactTablePageState = atom({
  key: 'reactTablePage',
  default: 0,
});

export const reactTableDePaginatedDataState = atom({
  key: 'reactTableDePaginatedDataState',
  default: null,
});
