import { atom } from 'recoil';

export const smallTableDownloadDataCSV = atom({
  key: 'smallTableDownloadDataCSV',
  default: [],
});

export const smallTableDownloadDataJSON = atom({
  key: 'smallTableDownloadDataJSON',
  default: '',
});

export const smallTableDownloadDataXML = atom({
  key: 'smallTableDownloadDataXML',
  default: {},
});

export const tableRowLengthState = atom({
  key: 'tableRowLengthState',
  default: null,
});
