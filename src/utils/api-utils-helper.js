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
 * @returns {null|Object}    - Returns null if params are invalid, else returns object with desired
 * fields "apiId" and "params"
 */
const buildDownloadObject = (api, dateRange, fileType, userFilter, tableColumnSortData) => {
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
  }
  let filterAddendum = '';
  let tableColumnFields = '&fields=';
  let tableColumnSort = '';
  let tableColumnFilter = '';
  let defaultParamsWithColumnSelect = [];
  if (userFilter?.value) {
    filterAddendum = `,${api.userFilter.field}:eq:${userFilter.value}`;
  }
  if (tableColumnSortData) {
    tableColumnSortData.forEach(column => {
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
  }

  return {
    apiId: apiId,
    params:
      `?filter=${apiDateField}:gte:${dateRange.from},` +
      `${apiDateField}:lte:${dateRange.to}${filterAddendum}${tableColumnFilter}` +
      `&sort=${
        tableColumnSort ? tableColumnSort : tableColumnFields !== '&fields=' ? defaultParamsWithColumnSelect : apiSortParams
      }&format=${fileType}${tableColumnFields !== '&fields=' ? tableColumnFields : ''}`,
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
 * @returns {null|Object}     - Returns null if params are invalid, else returns object with
 * collection of APIs as built from buildDownloadObject above.
 */
export const buildDownloadRequestArray = (apis, dateRange, fileType, userFilter, tableColumnSortData) => {
  if (!apis || !dateRange || !fileType) {
    console.warn('Invalid params passed to buildDownloadRequestArray');
    return null;
  }
  const requestArr = [];
  const apiDateRange = {
    from: convertJSDateToAPI(dateRange.from),
    to: convertJSDateToAPI(dateRange.to),
  };
  let requestAPIs = apis;
  let curDownloadObject = null;

  if (!(apis instanceof Array)) {
    requestAPIs = [apis];
  }

  for (let i = requestAPIs.length; i--; ) {
    curDownloadObject = buildDownloadObject(requestAPIs[i], apiDateRange, fileType, userFilter, tableColumnSortData);
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
