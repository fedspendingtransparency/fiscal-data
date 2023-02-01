import { datatableRequest, pivotData } from "../../../utils/api-utils";
import { addDays } from "date-fns";
import {customTableSorts} from "../../custom-table-sorts";

export const loadTimerDelay = 500;

let runOnce;

const onDataReturned = async (res, rangeRequested, selectedTable, selectedPivot, setIsLoading,
                        setApiData, setApiError, canceledObj, tableCache) => {
  if (res.data && (res.data.length || selectedTable.apiId !== 149)) {
    // if data [] exists (and it has records, or if it's empty but not for API 149, set the value)
    if (customTableSorts[selectedTable.apiId]) {
      res.data = res.data.sort(customTableSorts[selectedTable.apiId]);
    }
    setApiData(res);
  } else if (!runOnce && selectedTable.apiId === 149) {
    // if no data comes back from the API for id:149, see if there is data for tomorrow
    rangeRequested = {
      from: addDays(rangeRequested.from, 1),
      to: addDays(rangeRequested.to, 1)
    };
    canceledObj = {
      isCanceled: false
    };

    runOnce = true; // only try once
    await makeApiCall(rangeRequested, selectedTable, selectedPivot, setIsLoading, setApiData,
      setApiError, canceledObj, tableCache);
  }
};

const makeApiCall = async (dateRange, selectedTable, selectedPivot, setIsLoading, setApiData,
                           setApiError, canceledObj, tableCache) => {
  const loadTimer = setTimeout(() => setIsLoading(true), loadTimerDelay);
  try {
    const data = await datatableRequest(selectedTable, dateRange, selectedPivot, canceledObj,
      tableCache);

    if (!canceledObj.isCanceled) {
      await onDataReturned(data, dateRange, selectedTable, selectedPivot, setIsLoading, setApiData,
        setApiError, canceledObj, tableCache);
    }
  } catch(err) {
    if (err.name === 'AbortError') {
      console.info('Action cancelled.');
    } else if(canceledObj && !canceledObj.isCanceled) {
      console.error('API error', err);
      setApiError(err);
    }
  } finally {
      clearTimeout(loadTimer);

      if(canceledObj && !canceledObj.isCanceled) {
        setIsLoading(false);
      }
    }
};

export const getApiData = async (_dateRange, _selectedTable, _selectedPivot,
                                 _setIsLoading, _setApiData, _setApiError, _canceledObj,
                                 _tableCache) => {
  if (_dateRange && _dateRange.from && _dateRange.to && _selectedTable
    && _selectedTable.endpoint && _selectedPivot) {
    await makeApiCall(_dateRange, _selectedTable, _selectedPivot, _setIsLoading, _setApiData,
      _setApiError, _canceledObj, _tableCache);
  }
};

export const pivotApiDataFn = (row, filters) => {
  return filters.every(filter => {
    const rowVal = row[filter.key];
    const filterVal = filter.value;
    /*
      The following values are used for lt, lte, gt and gte operators.
      If rowVal and/or filterVal are invalid values for
      Number(), any logical comparison will return false (which is what we want).
     */
    const rowNum = Number(rowVal);
    const filterNum = Number(filterVal);

    switch (filter.operator) {
      case 'eq':
        return rowVal === filterVal;
      case 'neq':
        return rowVal !== filterVal;
      case 'gt':
        return rowNum > filterNum;
      case 'gte':
        return rowNum >= filterNum;
      case 'lt':
        return rowNum < filterNum;
      case 'lte':
        return rowNum <= filterNum;
      case 'in':
        return filterVal.split(',').some(fv => fv.replace(/&44;/gi,',') === rowVal);
      case 'nin':
        return filterVal.split(',').every(fv => fv.replace(/&44;/gi,',') !== rowVal);
      default: // default 'eq'
        return rowVal === filterVal;
    }
  });
};

export const pivotApiData = (table, pivot, apiData, from, to) => {
  let filterFn;
  if (Array.isArray(pivot.pivotView.filters)) {
    filterFn = row => pivotApiDataFn(row, pivot.pivotView.filters);
  }
  return pivotData(
    apiData,
    table.dateField,
    pivot.pivotView,
    pivot.pivotValue.columnName,
    pivot.pivotView.aggregateOn,
    from,
    to,
    filterFn
  );
};

/**
 * From one array of filters, returns a 2-element array containing
 * first, an array of serializable (API-layer compatible) filters and
 * second, an array of filters to be applied after data load.
 *
 * @param {Array} filters
 * @returns {[[], []]} serializableFilters, postLoadFilters
 */
export const divvyUpFilters = (filters) => {
  const serializableFilters = [];
  const postLoadFilters = [];

  //fc.value.includes('(') || fc.value.includes(')')
  filters.forEach(fc => {
    // filters that use 'neq', 'nin', or test for 'null' or that have :in: values
    // with internal parentheses don't get serialized for an API param, but are applied in the
    // front end after load
    if (fc.operator === 'neq' || fc.operator === 'nin' || fc.value === 'null' ||
      (fc.operator === 'in' &&
        (fc.value.split(',').some(v => v === 'null' || v.includes('(') || v.includes(')')) || fc.value.includes('&44;')))) {
      postLoadFilters.push(fc);
    } else {
      serializableFilters.push(fc);
    }
  });
  return [serializableFilters, postLoadFilters];
}

export const unitTestFunctions = {
  onDataReturned, makeApiCall
};
