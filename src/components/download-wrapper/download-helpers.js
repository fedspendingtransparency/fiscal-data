import { postAPI } from '../../utils/api-utils';
import { format } from 'date-fns';
import { fileSizeTranslator2 } from '../datatables-tab/datatables-tab-helpers';

export const getDateRangeForFiltration = (dateRange, endpoint) => {
  // redemption_tables is a one-off scenario where the date string needs to be YYYY-MM.
  if (endpoint && endpoint.indexOf('redemption_tables') > -1) {
    return {
      from: format(dateRange.from, 'yyyy-MM'),
      to: format(dateRange.to, 'yyyy-MM'),
    };
  }

  return {
    from: format(dateRange.from, 'yyyy-MM-dd'),
    to: format(dateRange.to, 'yyyy-MM-dd'),
  };
};

const filenameDate = filtrationDate => {
  return filtrationDate.replace(/-/g, '');
};

export const getFilenameForSaveAs = (dateFilter, api, format) => {
  const dateAppendix = dateFilter ? '_' + filenameDate(dateFilter.from) + '_' + filenameDate(dateFilter.to) : '';
  return api.downloadName + dateAppendix + '.' + format;
}

export const replaceNbsps = str => {
  const re = new RegExp(String.fromCharCode(160), 'g'); // global search for " "
  return str.replace(re, ' ');
};

const makeHeadRequests = async (filePath, fetchHeadOption, failedRequestsNbr) => {
  if (failedRequestsNbr <= 3) {
    return postAPI(filePath, fetchHeadOption)
      .then(res => {
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
      })
      .catch(async e => {
        await makeHeadRequests(filePath, fetchHeadOption, ++failedRequestsNbr);
      });
  }
  return null;
};

export const constructDownloadFileName = (dateRange, selectedTable) => {
  if (dateRange?.from && dateRange?.to && selectedTable?.downloadName) {
    console.log('selectedTable?.downloadName:: ', selectedTable?.downloadName);
    const from = format(dateRange.from, 'yyyyMMdd');
    const to = format(dateRange.to, 'yyyyMMdd');
    return selectedTable.downloadName + '_' + from + '_' + to;
  }
};
