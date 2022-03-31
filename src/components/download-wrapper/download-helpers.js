import queryString from 'query-string';
import { apiPrefix, callApiUrl, postAPI } from '../../utils/api-utils';
import { format } from "date-fns";
import { fileSizeTranslator, fileSizeTranslator2 } from '../datatables-tab/datatables-tab-helpers';

const stringify = require('csv-stringify/lib/browser/sync');
const fileDownload = require('js-file-download');

export const dateRangeUrl = (endpointPath, dateFilter, dateField, limit, format, sort) => {
  const params = {};
  if (limit) {
    params.limit = limit;
  }
  if (dateFilter) {
    params.filter = serializeDateRange(dateFilter, dateField);
  }
  if (sort) {
    params.sort = sort;
  } else {
    params.sort = dateField;
  }
  if (format) {
    params.format = format;
  } else {
    params.format = 'json';
  }
  const queryParams = params !== {} ? ('?' + queryString.stringify(params)) : '';
  return apiPrefix + endpointPath + queryParams;
};

const serializeDateRange = (dateRange, dateField) => {
  return `${dateField}:gte:${dateRange.from},${dateField}:lte:${dateRange.to}`;
};

export const getDateRangeForFiltration = (dateRange, endpoint) => {
  // redemption_tables is a one-off scenario where the date string needs to be YYYY-MM.
  if (endpoint && endpoint.indexOf('redemption_tables') > -1) {
    return {
      from: format(dateRange.from, 'yyyy-MM'),
      to: format(dateRange.to, 'yyyy-MM')
    }
  }

  return {
    from: format(dateRange.from, 'yyyy-MM-dd'),
    to: format(dateRange.to, 'yyyy-MM-dd')
  }
};

const filenameDate = (filtrationDate) => {
  return filtrationDate.replace(/-/g, '');
};

export const getFilenameForSaveAs = (dateFilter, api, format) => {
  const dateAppendix = dateFilter ?
    '_' + filenameDate(dateFilter.from) + '_' + filenameDate(dateFilter.to) : '';
  return api.downloadName + dateAppendix +'.' + format;
};

export const getDataForDownload = (dataset, api, dateRange, format) => {
  const dateFilter = dateRange ? getDateRangeForFiltration(dateRange, api.endpoint) : null;
  const downloadName = getFilenameForSaveAs(dateFilter, api, format);

  const url = dateRangeUrl(api.endpoint, dateFilter, api.dateField, -1, format, api.dateField);
  return callApiUrl(url).then(response => response.blob()).then((data) => {
    fileDownload(data, downloadName)});
}

export const replaceNbsps = (str) => {
  const re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
};

const addDataset = (fields, dataset) => {
  return fields.map(field =>
    Object.assign({dataset: dataset.name}, field));
}

export const convertDataDictionaryToCsv = (dataset) => {
  const apis = dataset.apis;
  if (apis && apis[0] && apis[0].fields && apis[0].fields.length) {
    const allTableFields = apis.reduce((flattened, current) => {
      return flattened.concat(addDataset(current.fields, dataset));
    }, []);
    return replaceNbsps(stringify(allTableFields, {
      header: true,
      columns: [
        {
          key: 'dataset',
          header: 'dataset',
        },
        {
          key: 'tableName',
          header: 'data_table_name',
        },
        {
          key: 'columnName',
          header: 'field_name',
        },
        {
          key: 'prettyName',
          header: 'display_name',
        },
        {
          key: 'definition',
          header: 'description',
        },
        {
          key: 'dataType',
          header: 'data_type',
        },
        {
          key: 'isRequired',
          header: 'is_required',
        }
      ]
    }));
  } else {
    return '';
  }
};

export const suggestDictionaryDownloadName = (datasetName) => {
  return datasetName.replace(/[^a-zA-z ]/g,'') + ' Data Dictionary.csv';
};

export const calcDictionaryDownloadSize = (csvData) => {
  return fileSizeTranslator(1000 + csvData.length);
};

export const triggerDataDictionaryDownload = (csvData, datasetName) => {
  return fileDownload(csvData, suggestDictionaryDownloadName(datasetName));
};

const makeHeadRequests = async (filePath, fetchHeadOption, failedRequestsNbr) => {
  if (failedRequestsNbr <= 3) {
    return postAPI(filePath, fetchHeadOption).then((res) => {
      let returnVal = null;
      if (res && res.headers && res.headers.get) {
        const contentType = res.headers.get('Content-Type');
        const fileSize = res.headers.get('Content-Length');
        if (fileSize && contentType === 'application/zip') {
          returnVal = fileSizeTranslator2(fileSize);
        }
        // Uncomment the below for testing file sizes in local
        // else {
        //   returnVal = Math.round(Math.random() * 100) + ' MB';
        // }
      }
      return returnVal;
    }).catch(async (e) => {
      await makeHeadRequests(filePath, fetchHeadOption, ++failedRequestsNbr);
    })
  }
  return null;
};

export const populateFileSizes = async (setAllFileSizes, tableName) => {
  const dateFormatArr = ['current_report', '1_year', '5_years', '10_years', 'all_years'];
  const fileFormatsArr = ['csv', 'json', 'xml'];
  const fileSizeObj = {};
  const fetchHeadOption = {
    method: 'HEAD'
  };
  for (let i = 0, il = dateFormatArr.length; i < il; i++) {
    const curDateStr = dateFormatArr[i];
    const failedRequestsNbr = 0;
    fileSizeObj[curDateStr] = {};
    const curObj = fileSizeObj[curDateStr];

    for (let j = 0, jl = fileFormatsArr.length; j < jl; j++) {
      const fileFormat = fileFormatsArr[j];
      const filePath = `/static-data/${tableName}_${curDateStr}.${fileFormat}.zip`;

      curObj[fileFormat] = await makeHeadRequests(filePath, fetchHeadOption, failedRequestsNbr);
    }
  }
  setAllFileSizes(fileSizeObj);
};
