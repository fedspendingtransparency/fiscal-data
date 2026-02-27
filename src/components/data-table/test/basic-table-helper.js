import { json2xml } from 'xml-js';

export const getDownloadHeaders = headerGroups => {
  const downloadHeaders = [];
  const downloadHeaderKeys = [];
  headerGroups.forEach(header => {
    downloadHeaders.push(header.column.columnDef.header);
    downloadHeaderKeys.push(header.column.columnDef.accessorKey);
  });

  return { downloadHeaders, downloadHeaderKeys };
};

export const getDownloadData = (tableRowModel, downloadHeaderKeys) => {
  const downloadData = [];

  tableRowModel.flatRows.forEach(row => {
    const visibleRow = {};
    const allData = row.original;
    downloadHeaderKeys.forEach(key => {
      visibleRow[key] = allData[key];
    });
    downloadData.push(visibleRow);
  });
  return downloadData;
};

export const getDataWithTextQualifiers = downloadData => {
  if (downloadData) {
    return downloadData.map(entry => {
      const dataWithTextQualifiers = [];
      Object.values(entry).forEach(val => {
        const stringValue = String(val ?? '');
        dataWithTextQualifiers.push(stringValue.includes(',') ? `"${stringValue}"` : stringValue);
      });
      return dataWithTextQualifiers;
    });
  }
};

export const setCsvDownload = (data, headers, setSmallTableCSVData) => {
  const downloadData = getDataWithTextQualifiers(data);
  downloadData.unshift(headers);
  setSmallTableCSVData(downloadData);
};
export const setXmlDownload = (data, setSmallTableXMLData) => {
  const xmlData = {
    'root-element': {
      data: data.map(row => ({
        'data-element': row,
      })),
    },
  };
  setSmallTableXMLData(json2xml(JSON.stringify(xmlData), { compact: true }));
};
