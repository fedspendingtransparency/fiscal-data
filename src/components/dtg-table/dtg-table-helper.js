import dayjs from 'dayjs';
import { formatDateForApi } from '../../utils/api-utils';

export const loadTimerDelay = 500;
const debounceDelay = 400;
// Make sure we have a small delay that is not negative.
export const netLoadingDelay = loadTimerDelay > debounceDelay ? loadTimerDelay - debounceDelay : 100;

export const loadingTimeout = (loadCanceled, callback) => {
  if (!loadCanceled && callback) {
    callback(true);
  }
};

const createMissingConfigs = (keys, columnConfig) => {
  const indexed = {};

  if (columnConfig) {
    columnConfig.forEach(obj => (indexed[obj.property] = obj));
  }

  return keys
    .filter(property => !indexed[property])
    .map(property => {
      return {
        property: property,
        name: property,
      };
    })
    .filter(item => item);
};

export const setColumns = (dataProperties, columnConfig) => {
  const { excluded, keys } = dataProperties;
  const propsWithNoConfig = createMissingConfigs(keys, columnConfig);
  columnConfig = columnConfig || [];

  columnConfig.sort((a, b) => {
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      return 0;
    }
  });

  const configWithMissing = columnConfig.concat(propsWithNoConfig);

  return configWithMissing.filter(c => !excluded.includes(c.property));
};

export const buildColumnConfig = fields =>
  fields.map(f => {
    return {
      property: f.columnName,
      name: f.prettyName,
      type: f.dataType,
      order: f.isPrimaryDateCol ? -1 : f.order || 1,
    };
  });

export const getPaginationValues = (res, startPage, itemsPerPage) => {
  const totalCount = res.meta['total-count'];
  const start = startPage === 1 ? 0 : (startPage - 1) * itemsPerPage;
  const rowsToShow = start + itemsPerPage;
  const stop = rowsToShow > totalCount ? totalCount : rowsToShow;
  const rowsShowing = {
    begin: start + 1,
    end: stop,
  };
  const maxPage = res.meta['total-pages'];
  return { maxPage, rowsShowing, maxRows: totalCount };
};

export const getDateFilters = (filteredDateRange, dateRange) => {
  let from, to;
  const recordDateColumnFilter = filteredDateRange?.find(date => date?.fieldName === 'record_date');
  if (recordDateColumnFilter) {
    from =
      recordDateColumnFilter?.from && dayjs(dateRange.from).diff(recordDateColumnFilter?.from) <= 0
        ? recordDateColumnFilter?.from.format('YYYY-MM-DD')
        : formatDateForApi(dateRange.from);
    to =
      recordDateColumnFilter?.from && dayjs(dateRange.to).diff(recordDateColumnFilter?.to) >= 0
        ? recordDateColumnFilter?.to.format('YYYY-MM-DD')
        : formatDateForApi(dateRange.to);
  } else {
    from = formatDateForApi(dateRange.from);
    to = formatDateForApi(dateRange.to);
  }
  return { from, to };
};
