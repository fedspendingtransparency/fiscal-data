import { create } from 'zustand';

export const smallTableDownloadData = create(set => ({
  csv: [],
  json: '',
  xml: {},
  tableRowLength: null,
  setCsv: csv => set({ csv }),
  setJson: json => set({ json }),
  setXml: xml => set({ xml }),
  setTableRowLength: tableRowLength => set({ tableRowLength }),
}));
