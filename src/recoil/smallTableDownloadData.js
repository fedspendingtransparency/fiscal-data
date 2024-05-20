import { atom } from 'recoil';

export const smallTableDownloadDataCSV = atom({
  key: 'smallTableDownloadDataCSV',
  default: [],
});

export const tableRowLengthState = atom({
  key: 'tableRowLengthState',
  default: null,
});
