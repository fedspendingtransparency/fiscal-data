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

const constructDateHeader = (datasetName, dateRange) => {
  const timestampData = [];
  timestampData.push(`${datasetName}.`);
  const date = new Date(dateRange.to.toString());
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  const lastDateOfMonth = `${dateFormatted}`;
  timestampData.push(`As of ${lastDateOfMonth}`);
  return timestampData;
};

export const setCsvDownload = (data, headers, setSmallTableCSVData, hasDownloadTimestamp, datasetName, dateRange) => {
  const downloadData = getDataWithTextQualifiers(data);
  downloadData.unshift(headers);
  if (hasDownloadTimestamp) {
    const dateHeader = constructDateHeader();
    downloadData.unshift(dateHeader);
  }
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

export const getDataTypes = (tableData, columnConstructor) => {
  if (tableData.meta) {
    return tableData.meta.dataTypes;
  } else {
    const dataTypes = {};
    columnConstructor?.forEach(column => {
      dataTypes[column.property] = column.type ? column.type : 'STRING';
    });
    return dataTypes;
  }
};
