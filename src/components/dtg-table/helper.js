import dayjs from 'dayjs';
import { formatDateForApi } from '../../utils/api-utils';

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

export const getCurrentDataPaginationValues = (data, currentPage, itemsPerPage) => {
  const start = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
  const rowsToShow = start + itemsPerPage;
  const stop = rowsToShow > data.length ? data.length : rowsToShow;
  const rowsShowing = {
    begin: start + 1,
    end: stop,
  };
  const maxPage = Math.ceil(data.length / itemsPerPage);
  const tableData = data.slice(start, stop);
  return { maxPage, rowsShowing, tableData };
};

export const activePivot = (data, pivot) => {
  return data?.pivotApplied?.includes(pivot?.pivotValue?.columnName) && data?.pivotApplied?.includes(pivot.pivotView?.title);
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

// data table
export const constructDefaultColumnsFromTableData = (table, defaultSelectedColumns) => {
  const constructedDefaultColumns = [];
  const constructedAdditionalColumns = [];
  for (const column of table.getAllLeafColumns()) {
    if (defaultSelectedColumns.includes(column.id)) {
      constructedDefaultColumns.push(column);
    } else if (!defaultSelectedColumns.includes(column.id)) {
      constructedAdditionalColumns.push(column);
    }
  }
  constructedAdditionalColumns.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });
  console.log(constructedDefaultColumns);
  return { defaults: constructedDefaultColumns, additional: constructedAdditionalColumns };
};
