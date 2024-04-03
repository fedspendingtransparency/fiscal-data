import { convertJSDateToAPI } from '../transform/dates';
import { buildSortParams } from './api-utils';
import GLOBALS from '../helpers/constants';

/**
 * This function creates a fragment of the formatted object used within the API download request.
 * @param api {object}       - The data table/API object.
 * @param dateRange {object} - From and To are the only fields with an API format of YYYY-MM-DD.
 * @param fileType {String}  - Accepted values are 'csv', 'xml', 'json'.
 * @param userFilter {null|object}  - Object to describe the user selected filter object
 * @param tableColumnSortData
 * @param detailViewFilter
 * @returns {null|Object}    - Returns null if params are invalid, else returns object with desired
 * fields "apiId" and "params"
 */
const buildDownloadObject = (api, dateRange, fileType, userFilter, tableColumnSortData, detailViewFilter) => {
  if (!api || !dateRange || !fileType) {
    console.warn('Invalid params passed to buildDownloadObject');
    return null;
  }

  const apiId = api.apiId;
  const apiIdStr = apiId ? apiId.toString() : '';
  const apiDateField = api.dateField;
  const apiSortParams = buildSortParams(api);

  // Convert the date range format from YYYY-MM-DD to YYYY-MM for the following apis.
  if (GLOBALS.ENDPOINTS_WITH_YEAR_MONTH_DATE_FORMAT.some(id => id === apiIdStr)) {
    dateRange.to = dateRange.to.slice(0, -3);
    dateRange.from = dateRange.from.slice(0, -3);
  } else {
    // If following regular date formatting and apiDateField is filtered in the table, go with the table filter instead of the top level filter
    if (tableColumnSortData) {
      const recordDateFilter = tableColumnSortData.filter(column => column.id === apiDateField);

      if (recordDateFilter.length > 0 && recordDateFilter[0].filterValue !== undefined) {
        dateRange.from =
          new Date(dateRange.from).getTime() > new Date(recordDateFilter[0].filterValue[0]).getTime()
            ? dateRange.from
            : recordDateFilter[0].filterValue[0];
        dateRange.to =
          new Date(dateRange.to).getTime() <= new Date(recordDateFilter[0].filterValue[recordDateFilter[0].filterValue.length - 1]).getTime()
            ? dateRange.to
            : recordDateFilter[0].filterValue[recordDateFilter[0].filterValue.length - 1];
      }
    }
  }

  let filterAddendum = '';
  let tableColumnFields = '&fields=';
  let tableColumnSort = '';
  let tableColumnFilter = '';
  let fieldsAsArray;
  let defaultParamsWithColumnSelect = [];
  if (userFilter?.value) {
    filterAddendum = `,${api.userFilter.field}:eq:${userFilter.value}`;
  }
  if (detailViewFilter) {
    filterAddendum = `,${detailViewFilter.field}:eq:${detailViewFilter.value}`;
  }

  if (tableColumnSortData) {
    // Apply date filters for datasets where extra date filters can be applied in table
    const dateColumns = tableColumnSortData.filter(column => column.id.includes('_date') && column.id !== apiDateField);

    dateColumns.forEach(column => {
      if (column.filterValue !== undefined) {
        const beginDate = column.filterValue[0];
        const endDate = column.filterValue[column.filterValue.length - 1];
        const filterString = `,${column.id}:gte:${beginDate},${column.id}:lte:${endDate}`;
        filterAddendum += filterString;
      }
    });

    tableColumnSortData.forEach(column => {
      if (!column.allColumnsSelected || detailViewFilter) {
        if (tableColumnFields === '&fields=') {
          tableColumnFields += `${column.id}`;
        } else {
          tableColumnFields += `,${column.id}`;
        }
      }
      if (column.sorted !== false) {
        if (column.sorted === 'asc') {
          tableColumnSort += `+${column.id}`;
        } else {
          tableColumnSort += `-${column.id}`;
        }
      }

      const inFilterValues = [...new Set(column.rowValues)];

      if (column.filterValue && column.downloadFilter && inFilterValues.length > 0) {
        tableColumnFilter += `,${column.id}:in:(${inFilterValues.join(',')})`;
      }
    });
    // If the user has engaged the column select, apply the default sort params to the applicable selected columns
    if (tableColumnFields !== '&fields=') {
      fieldsAsArray = tableColumnFields.replace('&fields=', '').split(',');
      const defaultSortParamsAsArray = apiSortParams.split(',');
      defaultSortParamsAsArray.filter(element => {
        fieldsAsArray.forEach(field => {
          if (element.includes(field)) {
            defaultParamsWithColumnSelect.push(element);
          }
        });
      });
      if (defaultParamsWithColumnSelect.length === 0) {
        defaultParamsWithColumnSelect = defaultSortParamsAsArray;
      }
      defaultParamsWithColumnSelect = defaultParamsWithColumnSelect.join(',');
    }
  }

  let sortValue;

  if (tableColumnSort !== '') {
    sortValue = tableColumnSort;
  } else {
    if (tableColumnFields !== '&fields=') {
      // Sort parameters always need to be included in fields
      sortValue = defaultParamsWithColumnSelect;
      // Any duplicates need to be removed when sort params are combined with fields
      const sortFields = defaultParamsWithColumnSelect
        .split(', ')
        .join(',')
        .replace('-', '');
      const set = new Set([...fieldsAsArray, ...sortFields.split(',')]);
      tableColumnFields =
        '&fields=' +
        Array.from(set)
          .join(',')
          .replace('-', '')
          .replace('+', '');
    } else {
      sortValue = apiSortParams;
    }
  }

  return {
    apiId: apiId,
    params:
      `?filter=${apiDateField}:gte:${dateRange.from},` +
      `${apiDateField}:lte:${dateRange.to}${filterAddendum}${tableColumnFilter}` +
      `&sort=${sortValue}&format=${fileType}${tableColumnFields !== '&fields=' ? tableColumnFields : ''}`,
  };
};

export const buildTableColumnSortParams = (sortData, apiSortParams) => {
  let tableColumnFields = '&fields=';
  let tableColumnSort = '';
  let tableColumnFilter = '';
  let defaultParamsWithColumnSelect = [];
  sortData.forEach(column => {
    if (!column.allColumnsSelected) {
      if (tableColumnFields === '&fields=') {
        tableColumnFields += `${column.id}`;
      } else {
        tableColumnFields += `,${column.id}`;
      }
    }
    if (column.sorted !== false) {
      if (column.sorted === 'asc') {
        tableColumnSort += `+${column.id}`;
      } else {
        tableColumnSort += `-${column.id}`;
      }
    }
    if (column.filterValue !== undefined) {
      tableColumnFilter += `,${column.id}:in:(${[...new Set(column.rowValues)].join(',')})`;
    }
  });
  // If the user has engaged the column select, apply the default sort params to the applicable selected columns
  if (tableColumnFields !== '&fields=') {
    const fieldsAsArray = tableColumnFields.replace('&fields=', '').split(',');
    const defaultSortParamsAsArray = apiSortParams.split(',');
    defaultSortParamsAsArray.filter(element => {
      fieldsAsArray.forEach(field => {
        if (element.includes(field)) {
          defaultParamsWithColumnSelect.push(element);
        }
      });
    });
    defaultParamsWithColumnSelect = defaultParamsWithColumnSelect.join(',');
  }
  return {
    fields: tableColumnFields,
    sort: tableColumnSort,
    filter: tableColumnFilter,
    defaultParamsWithColumnSelect: defaultParamsWithColumnSelect,
  };
};

const dataTables = [
  {
    id: 'basicTable',
    endpoint: '',
    description: 'Dataset without an alwaysSortWith field defined',
    dateField: 'record_date',
    fields: [{ columnName: 'record_date' }, { columnName: 'Col1' }, { columnName: 'src_line_nbr' }, { columnName: 'Col2' }],
  },
  {
    id: 'AlwysSrtWth',
    endpoint: '',
    description: 'Dataset with an alwaysSortWith field defined',
    fields: [{ columnName: 'record_date' }, { columnName: 'Col3' }, { columnName: 'Col4' }],
    alwaysSortWith: ['-record_date', 'col4'],
  },
];

/**
 * This function creates the full object sent to the API download request.
 * @param apis {object|Array} - If multiple then an array of data table/API objects, else a single
 * data table/API.
 * @param dateRange {object}  - From and To are fields on this object that are both jsDates.
 * @param fileType {String}   - Accepted values are 'csv', 'xml', 'json'.
 * @param userFilter {object}   - option selected from userFilter dropdown
 * @param tableColumnSortData
 * @param filteredDateRange
 * @param detailViewFilter
 * @returns {null|Object}     - Returns null if params are invalid, else returns object with
 * collection of APIs as built from buildDownloadObject above.
 */
export const buildDownloadRequestArray = (apis, dateRange, fileType, userFilter, tableColumnSortData, filteredDateRange, detailViewFilter) => {
  if (!apis || !dateRange || !fileType) {
    console.warn('Invalid params passed to buildDownloadRequestArray');
    return null;
  }
  const requestArr = [];
  const from = convertJSDateToAPI(dateRange.from);
  const to = convertJSDateToAPI(dateRange.to);
  const apiDateRange = {
    from: from,
    to: to,
  };
  let requestAPIs = apis;
  let curDownloadObject = null;

  if (!(apis instanceof Array)) {
    requestAPIs = [apis];
  }
  for (let i = requestAPIs.length; i--; ) {
    curDownloadObject = buildDownloadObject(requestAPIs[i], apiDateRange, fileType, userFilter, tableColumnSortData, detailViewFilter);
    if (curDownloadObject) {
      requestArr.push(curDownloadObject);
    }
  }

  if (!requestArr.length) {
    // The following should only appear if we erroneously call this function with bad params.
    // In practice, this shouldn't show up in the console.
    console.warn('No valid APIs can be built with this request, please check input params');
    return null;
  }

  return {
    apis: requestArr,
  };
};

export const unitTestObjects = {
  dataTables: dataTables,
  buildDownloadObject: buildDownloadObject,
};
