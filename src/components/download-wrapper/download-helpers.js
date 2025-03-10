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

export const getFilenameForSaveAs = (dateFilter, api, format) => {
  const dateAppendix = dateFilter ? '_' + filenameDate(dateFilter.from) + '_' + filenameDate(dateFilter.to) : '';
  return api.downloadName + dateAppendix + '.' + format;
};

export const replaceNbsps = str => {
  const re = new RegExp(String.fromCharCode(160), 'g'); // global search for " "
  return str.replace(re, ' ');
};

export const constructDownloadFileName = (dateRange, selectedTable, formatDate = true) => {
  if (dateRange?.from && dateRange?.to && selectedTable?.downloadName) {
    const from = formatDate ? format(dateRange.from, 'yyyyMMdd') : dateRange.from;
    const to = formatDate ? format(dateRange.to, 'yyyyMMdd') : dateRange.to;
    return selectedTable.downloadName + '_' + from + '_' + to;
  }
};

const filenameDate = filtrationDate => {
  return filtrationDate.replace(/-/g, '');
};

export const fileFromPath = path => (path && path.length ? path.substring(path.lastIndexOf('/') + 1) : null);
