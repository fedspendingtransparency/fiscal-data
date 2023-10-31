import { API_BASE_URL, AUTHENTICATE_API } from 'gatsby-env-variables';
import { format, subDays, subMonths, subYears } from 'date-fns';
import queryString from 'query-string';
import GLOBALS from '../helpers/constants';
import authenticatingFetch from './authenticating-fetch/authenticating-fetch';
import { divvyUpFilters, pivotApiData, pivotApiDataFn } from '../components/dataset-data/dataset-data-api-helper/dataset-data-api-helper';
import { buildTableColumnSortParams } from './api-utils-helper';

const apiKey = AUTHENTICATE_API ? process.env.GATSBY_API_KEY : false;
export const getIFetch = () => (apiKey ? authenticatingFetch(apiKey, fetch) : fetch);

export const apiPrefix = `${API_BASE_URL}/services/api/fiscal_service/`;

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MAX_PAGE_SIZE = 10000;

export const formatDateForApi = d => {
  return format(d, 'yyyy-MM-dd');
};

/**
 * Attempt to fetch data n number of times
 * @param {String} url full url
 * @param {Number} n total number of times to try the fetch
 */
export const fetch_retry = async (url, n) => {
  let error;
  const iFetch = getIFetch();
  for (let i = 0; i < n; i++) {
    try {
      return await iFetch(url);
    } catch (err) {
      error = err;
    }
  }
  throw error;
};

/**
 * Fetch dataset data for the HomeHighlightCards on the homepage. The highlight cards are so
 * unique that they do not require specialized logic for sorting; and, as a result, do not need
 * to call buildSortParams.
 * @param {String} endpoint api endpoint
 * @param {Object} filters filters {}
 * @param {Array} fields fields []
 * @param {String} dateField api.dateField
 * @param {Number} limit typically -1
 * @param {String[]} [sorts] allows full control over sort parameters. Optional
 * NOTE: If this param is used, dateField is not used.
 * @param {Boolean} [doNotAddDateFieldToFields] Allows to not
 */
export const fetchHighlights = (endpoint, filters, fields, dateField, limit, sorts, doNotAddDateFieldToFields) => {
  if (doNotAddDateFieldToFields === undefined || doNotAddDateFieldToFields === null) {
    doNotAddDateFieldToFields = false;
  }
  const filterString = filters && Object.keys(filters).length ? `&filter=${serializeFilters(filters)}` : '';
  const fieldsString = fields !== undefined ? `fields=${fields.join()}${!doNotAddDateFieldToFields ? `,${dateField}` : ''}` : '';
  const sortsString = `sort=${sorts !== undefined ? `${sorts.join(',')}` : `-${dateField}`}`;
  const url = `${apiPrefix}${endpoint}?format=json${filterString}&${fieldsString}&${sortsString}` + `&page[size]=${limit}`;
  return fetch_retry(url, 3).then(response => response.json());
};

export const postAPI = (url, options) => {
  return getIFetch()(url, options);
};

// todo - The following two functions do the same thing; but, fetchAPI is used by api-quick-guide
//  that uses examples from Prod even in lower environments which causes errors in QAT.
export const fetchAPI = url => fetch(url).then(res => res.json());

export const basicFetch = url => getIFetch()(url).then(res => res.json());

export const callApiUrl = url => {
  const iFetch = getIFetch();
  iFetch(url).then(res => checkError(res, url));
};

const checkError = (response, urlAttempted) => {
  if (
    !response.headers.get('Content-Type') ||
    (urlAttempted.indexOf('format=json') !== -1 &&
      response.headers
        .get('Content-Type')
        .toLocaleLowerCase()
        .indexOf('json') === -1)
  ) {
    throw Error(JSON.stringify({ errorText: 'Invalid content type returned', url: urlAttempted }));
  } else if (response.status !== 200) {
    throw Error(JSON.stringify({ errorText: 'ERROR: ' + response.statusText, url: urlAttempted }));
  } else {
    return response;
  }
};

export const pagedDatatableRequest = async (table, from, to, selectedPivot, pageNum, pageSize, tableColumnSortData) => {
  const dateField = table.dateField;
  // redemption_tables and sb_value are exception scenarios where the date string needs to
  // be YYYY-MM.
  let fromStr = from;
  let toStr = to;
  if (table.endpoint.indexOf('redemption_tables') > -1 || table.endpoint.indexOf('sb_value') > -1) {
    fromStr = fromStr.substring(0, from.lastIndexOf('-'));
    toStr = toStr.substring(0, to.lastIndexOf('-'));
  }
  const sortParam = buildSortParams(table, selectedPivot);
  console.log(sortParam);
  // 'sort=' + (table.alwaysSortWith ? table.alwaysSortWith.join(',') : `-${dateField}`);
  const filterAddendum = '';
  let tableColumnFields = '&fields=';
  let tableColumnSort = '';
  let tableColumnFilter = '';
  let defaultParamsWithColumnSelect = [];
  let tableColumnSortParams;
  if (tableColumnSortData) {
    tableColumnSortParams = buildTableColumnSortParams(tableColumnSortData, sortParam);
    tableColumnFields = tableColumnSortParams.fields;
    tableColumnSort = tableColumnSortParams.sort;
    tableColumnFilter = tableColumnSortParams.filter;
    defaultParamsWithColumnSelect = tableColumnSortParams.defaultParamsWithColumnSelect;
    console.log(tableColumnSort ? tableColumnSort : sortParam);
  }

  const uri =
    `${apiPrefix}${table.endpoint}?filter=${dateField}:gte:${fromStr},${dateField}` +
    `:lte:${toStr}&sort=${tableColumnSort ? tableColumnSort : sortParam}&page[number]=${pageNum}&page[size]=${pageSize}`;

  return getIFetch()(uri).then(response => response.json());
};

export const datatableRequest = async (table, dateRange, selectedPivot, canceledObj, tableCache) => {
  const endpoint = table.endpoint;
  const dateField = table.dateField;
  const { pivotView, pivotValue } = selectedPivot ? selectedPivot : {};
  if (pivotView && pivotView.dimensionField && pivotValue && pivotView.aggregateOn) {
    const pivotedData = await fetchPivotData(
      table,
      formatDateForApi(dateRange.from),
      formatDateForApi(dateRange.to),
      pivotView,
      pivotValue.columnName,
      pivotView.aggregateOn,
      canceledObj
    );
    if (tableCache) {
      tableCache.updateDataDisplayCache(pivotedData, dateRange);
    }
    return pivotedData;
  } else {
    const sortParamValue = buildSortParams(table, selectedPivot);
    const fieldsParam = pivotView && pivotView.fields && pivotView.fields.length ? `&fields=${pivotView.fields.join()}` : '';

    let dateRanges;
    if (tableCache.dataCache && tableCache.dataCache.length) {
      dateRanges = tableCache.findUncachedDateRanges(dateRange);
    } else {
      dateRanges = [dateRange];
    }
    if (dateRanges && dateRanges.length) {
      const fetchers = [];
      dateRanges.forEach(range => {
        const from = formatDateForApi(range.from);
        const to = formatDateForApi(range.to);
        const uri = `${apiPrefix}${endpoint}?filter=${dateField}:gte:${from},${dateField}` + `:lte:${to}${fieldsParam}&sort=${sortParamValue}`;
        fetchers.push(
          fetchAllPages(uri, canceledObj).then(res => {
            res.range = range;
            return res;
          })
        );
      });
      const fetchedRecordSets = await Promise.all(fetchers);
      tableCache.updateDataCache(fetchedRecordSets);
    }
    const recordSetForRange = tableCache.getRecordSetForRange(dateRange, dateField);
    const displayData = incorporateChartDates(recordSetForRange, pivotView);
    tableCache.updateDataDisplayCache(displayData, dateRange);
    if (pivotView && pivotView.dimensionField && pivotValue) {
      return pivotApiData(table, selectedPivot, displayData, dateRange.from, dateRange.to);
    } else {
      return displayData;
    }
  }
};

export const fetchAllPages = async (uri, canceledObj) => {
  let finalData = null;
  let pageCount = 1;
  let nextPageParams = encodeURI(`&page[number]=${pageCount}&page[size]=${MAX_PAGE_SIZE}`);
  const iFetch = getIFetch();
  if (!canceledObj.isCanceled) {
    const aborter = canceledObj.abortController || { signal: null };
    // in case one has not been obtained via DOM

    // have to await data from fetch of first page to check for whether there are additional pages
    finalData = await iFetch(`${uri}${nextPageParams}`, { signal: aborter.signal }).then(resp => resp.json());
    if (finalData && Array.isArray(finalData.data)) {
      const totalPages = Number(finalData.meta['total-pages']);

      if (totalPages > 1) {
        const pagedResponseRecordSets = []; /* an array to populate with all pending fetch
                                               promises started together */
        while (pageCount < totalPages && !canceledObj.isCanceled) {
          pageCount += 1;
          nextPageParams = encodeURI(`&page[number]=${pageCount}&page[size]=${MAX_PAGE_SIZE}`);
          // successive calls start at page 2, so subtract to for zero-based array index
          pagedResponseRecordSets[pageCount - 2] = iFetch(`${uri}${nextPageParams}`, { signal: aborter.signal })
            .then(resp => resp.json())
            .then(response => {
              if (finalData && Array.isArray(response.data)) {
                return response.data;
              } else {
                return null;
              }
            });
        }
        if (!canceledObj.isCanceled) {
          const fetchedRecordSets = await Promise.all(pagedResponseRecordSets);
          finalData.data = [].concat.apply(finalData.data, fetchedRecordSets);
        }
      }
    }
  }
  if (!canceledObj.isCanceled) {
    return Promise.resolve(finalData);
  }
};

export const fetchPivotData = async (table, from, to, pivotView, pivotValueField, aggregateOn, canceledObj) => {
  const endpoint = table.endpoint;
  const dateField = table.dateField;
  const sortParamValue = buildSortParams(table, { pivotView });

  const fields = buildFields(table, pivotView, pivotValueField, aggregateOn);

  let filterParam = `${dateField}:gte:${from},${dateField}:lte:${to}`;

  let postFetchFilterFunction;
  if (Array.isArray(pivotView.filters)) {
    const [serializableFilters, postLoadFilters] = divvyUpFilters(pivotView.filters);
    if (postLoadFilters.length) {
      // if a filter cannot be applied in the api layer, then the field it
      // keys on needs to be included in data for in-browser post filtering
      postLoadFilters.forEach(uf => {
        if (!fields.includes(uf.key)) {
          fields.push(uf.key);
        }
      });

      postFetchFilterFunction = row => pivotApiDataFn(row, postLoadFilters);
    }
    if (serializableFilters.length) {
      const filterAppendage = serializeFilters(serializableFilters);
      if (filterAppendage.length) {
        filterParam += `,${serializeFilters(serializableFilters)}`;
      }
    }
  }
  const uri = formulateUrl(endpoint, filterParam, fields, null, sortParamValue, 'json');
  return fetchAllPages(uri, canceledObj).then(data =>
    pivotData(data, dateField, pivotView, pivotValueField, aggregateOn, from, to, postFetchFilterFunction)
  );
};

export const buildFields = (table, pivotView, pivotValueField, aggregateOn) => {
  let output = [pivotView.dimensionField, pivotValueField];

  if (aggregateOn && aggregateOn.length && Array.isArray(aggregateOn)) {
    output = output.concat(aggregateOn.map(ag => ag.field));
    if (pivotView.lastRowSnapshot) {
      output.push(table.dateField);
    }
  } else {
    output.push(table.dateField);
  }

  // need to add any sort fields to the fields
  if (table.alwaysSortWith) {
    const alwaysSortFields = table.alwaysSortWith.map(f => f.replace(/^-/, ''));
    alwaysSortFields.forEach(f => {
      if (!output.includes(f)) output.push(f);
    });
  }

  return output;
};

const formatDateSegment = (segmentValue, segmentType) => {
  if (segmentType.toLocaleUpperCase === 'QUARTER') {
    return `Q${segmentValue}`;
  }
  if (segmentType.toLocaleUpperCase() === 'MONTH') {
    return monthNames[Number(segmentValue) - 1];
  }
  return segmentValue;
};

const convertAggregateValuesToDate = (row, aggregateOn) => {
  let year = 2020;
  let month = 0;
  if (aggregateOn.length && aggregateOn[0].type === 'DATE') {
    return row[aggregateOn[0].field];
  } else {
    aggregateOn.forEach(ag => {
      // eslint-disable-next-line default-case
      switch (ag.type) {
        case 'MONTH':
          month = Number(row[ag.field]);
          break;
        case 'QUARTER':
          month = Number(row[ag.field]) * 3 - 2;
          break;
        case 'YEAR':
          year = Number(row[ag.field]);
      }
    });
    return `${year}-${month < 10 ? '0' : ''}${month}-01`;
  }
};

export const pivotData = (data, dateField, pivotView, pivotValueField, aggregateOn, from, to, filterFn) => {
  const indexed = {};
  const labels = {};
  const dataTypes = {};
  const dimensionField = pivotView.dimensionField;

  // simple falsiness doesn't work here because of zero vals and 'null' transmitted as a
  // string literal
  const isEmptyPivotLabel = value => value === undefined || value === null || value === '' || ('' + value).toLocaleLowerCase() === 'null';

  let pivotColumnKey;

  if (aggregateOn && aggregateOn.length) {
    /* create composite column in case aggregation
                                              uses multiple fields */
    pivotColumnKey = aggregateOn.map(ag => ag.field).join('__');
    labels[pivotColumnKey] = 'Time Period';
    dataTypes[pivotColumnKey] = 'AGGREGATION_DATE';
  } else {
    pivotColumnKey = dateField;
    labels[dateField] = data.meta.labels[dateField];
    dataTypes[dateField] = data.meta.dataTypes[dateField];
  }
  let dataRows = data.data.slice();
  if (filterFn) {
    dataRows = dataRows.filter(filterFn);
  }
  dataRows.forEach(row => {
    let rowKey;

    if (aggregateOn && aggregateOn.length) {
      if (aggregateOn[0].type !== 'DATE') {
        rowKey = aggregateOn
          .map(ag => formatDateSegment(row[ag.field], ag.type))
          .reverse()
          .join(' ');
      } else {
        rowKey = row[aggregateOn[0].field];
      }
    } else {
      rowKey = row[dateField];
    }

    if (!indexed[rowKey]) {
      indexed[rowKey] = {};
      if (aggregateOn && aggregateOn.length) {
        indexed[rowKey]['CHART_DATE'] = convertAggregateValuesToDate(row, aggregateOn);
      }
      indexed[rowKey][pivotColumnKey] = rowKey;
    }
    if (!isEmptyPivotLabel(row[dimensionField])) {
      /* only make columns when the pivot
                                                        dimension field has a value */
      // just take the current value if the value field is a non-summable type
      if (!data.meta.dataTypes[pivotValueField].includes('CURRENCY') && data.meta.dataTypes[pivotValueField] !== 'NUMBER') {
        indexed[rowKey][row[dimensionField]] = row[pivotValueField];
      } else {
        if (isNaN(Number(indexed[rowKey][row[dimensionField]]))) {
          // if the accumulated value is thus far undefined or not a number, then just take
          // the latest value
          indexed[rowKey][row[dimensionField]] = row[pivotValueField];
        } else if (!isNaN(Number(row[pivotValueField])) && !pivotView.lastRowSnapshot) {
          // not using a snapshot and both the accumulated value and the current value are
          // numeric, so sum them
          indexed[rowKey][row[dimensionField]] = Number(indexed[rowKey][row[dimensionField]]) + Number(row[pivotValueField]);
        }
        // otherwise do nothing, thus preserving the accumulated value since it's a number
        // and the current value either isn't a number or we're using lastRowSnapshot and it is
        // from an earlier date in the interval
      }
      labels[row[dimensionField]] = row[dimensionField];
      dataTypes[row[dimensionField]] = data.meta.dataTypes[pivotValueField];
    }
  });

  let pivotedDataRows;
  if (aggregateOn && aggregateOn.length) {
    pivotedDataRows = Object.values(indexed).sort((a, b) => ('' + b['CHART_DATE']).localeCompare(a['CHART_DATE']));
  } else {
    pivotedDataRows = Object.values(indexed);
  }
  return {
    data: pivotedDataRows,
    meta: {
      labels,
      dataTypes,
    },
    pivotApplied: `${pivotView.title}:${pivotValueField}`,
  };
};

export const incorporateChartDates = (data, pivotView) => {
  const aggregateOn = pivotView.aggregateOn;
  if (!aggregateOn || !aggregateOn.length) {
    return data;
  } else {
    const labels = data.meta.labels;
    const dataTypes = data.meta.dataTypes;

    const aggregateDateField = aggregateOn.map(ag => ag.field).join('__');
    labels[aggregateDateField] = 'Time Period';
    dataTypes[aggregateDateField] = 'AGGREGATION_DATE';

    const indexed = {};
    data.data.forEach(row => {
      let rowKey;

      if (aggregateOn[0].type !== 'DATE') {
        rowKey = aggregateOn
          .map(ag => formatDateSegment(row[ag.field], ag.type))
          .reverse()
          .join(' ');
      } else {
        rowKey = row[aggregateOn[0].field];
      }

      if (!indexed[rowKey]) {
        indexed[rowKey] = {};
        if (aggregateOn && aggregateOn.length) {
          indexed[rowKey]['CHART_DATE'] = convertAggregateValuesToDate(row, aggregateOn);
        }
        indexed[rowKey][aggregateDateField] = rowKey;
      }
      Object.entries(row).forEach(([key, val]) => {
        if (!GLOBALS.DATE_RELATED_META_TYPES.includes(data.meta.dataTypes[key])) {
          if (
            indexed[rowKey][key] === undefined ||
            (data.meta.dataTypes[key] !== 'CURRENCY' && data.meta.dataTypes[key] !== 'NUMBER' && !pivotView.lastRowSnapshot)
          ) {
            indexed[rowKey][key] = val;
          } else if (!isNaN(Number(indexed[rowKey][key])) && !isNaN(Number(val)) && !pivotView.lastRowSnapshot) {
            // otherwise if summable, accumulate the sum
            indexed[rowKey][key] = Number(indexed[rowKey][key]) + Number(val);
          }
        }
      });
    });
    return {
      data: Object.values(indexed).sort((a, b) => ('' + b['CHART_DATE']).localeCompare(a['CHART_DATE'])),
      meta: {
        labels,
        dataTypes,
      },
    };
  }
};
export const formulateUrl = (endpointPath, filters, fields, limit, sort, format) => {
  const params = {};
  if (filters) {
    // if filters is already a string primitive or String Object don't serialize
    params.filter = typeof filters === 'string' || filters instanceof String ? filters : serializeFilters(filters);
  }
  if (fields) {
    params.fields = fields.join(',');
  }
  if (sort) {
    params.sort = sort;
  }
  if (limit) {
    params.limit = limit;
  }
  if (format) {
    params.format = format;
  } else {
    params.format = 'json';
  }
  const queryParams = params !== {} ? '?' + queryString.stringify(params) : '';
  return apiPrefix + endpointPath + queryParams;
};

export const serializeFilters = filters => {
  let param = '';
  filters.forEach(filter => {
    param = param !== '' ? (param += ',') : param;
    if (filter.operator === 'between') {
      param += `${filter.key}:${filter.range.low.inclusive ? 'gte' : 'gt'}` + `:${filter.range.low.value}`;
      param += `,${filter.key}:${filter.range.high.inclusive ? 'lte' : 'lt'}` + `:${filter.range.high.value}`;
    } else if (filter.operator === 'mostRecentDatePeriod') {
      const currentDate = new Date(Date.now());
      let startDate;
      // eslint-disable-next-line default-case
      switch (filter.unit) {
        case 'DAY':
          startDate = subDays(currentDate, filter.amount);
          break;
        case 'MONTH':
          startDate = subMonths(currentDate, filter.amount);
          break;
        case 'YEAR':
          startDate = subYears(currentDate, filter.amount);
          break;
      }
      param += filter.key + ':gte:' + formatDateForApi(startDate);
    } else if (filter.key && filter.operator && filter.value !== undefined) {
      param += `${filter.key}:${filter.operator}:`;
      param += filter.operator === 'in' ? `(${filter.value})` : filter.value;
    }
  });
  return param !== '' ? param : null;
};

export const buildSortParams = (table, _selectedPivot) => {
  let sortParamValue = '';
  if (!table) {
    return sortParamValue;
  }

  const pivotView = _selectedPivot ? _selectedPivot.pivotView : {};

  if (pivotView && pivotView.aggregateOn && pivotView.aggregateOn.length && !pivotView.lastRowSnapshot) {
    sortParamValue = '-' + pivotView.aggregateOn.map(ag => ag.field).join(',-');
  } else if (table.alwaysSortWith) {
    sortParamValue = `${table.alwaysSortWith.join(',')}`;
  } else {
    sortParamValue = `-${table.dateField}`;
  }
  return sortParamValue;
};
