import * as helpers from './api-utils-helper';
import GLOBALS from '../helpers/constants';

describe('API Utils Helper', () => {
  const consoleWarn = global.console.warn;
  const unitTestObjects = helpers.unitTestObjects;

  const dummyDateJS = new Date(2021, 0, 1);
  const dummyDateStr = '2021-01-01';

  beforeAll(() => {
    global.console.warn = jest.fn();
  });

  afterAll(() => {
    global.console.warn = consoleWarn;
  });

  it('fails on buildDownloadObject when input params are invalid', () => {
    const apiParam = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: '2021-01-01', to: '2021-01-01' };
    const fileType = 'csv';

    expect(unitTestObjects.buildDownloadObject(null, dateRange, fileType)).toBeNull();
    expect(unitTestObjects.buildDownloadObject(apiParam, null, fileType)).toBeNull();
    expect(unitTestObjects.buildDownloadObject(apiParam, dateRange, null)).toBeNull();
  });

  it('returns a valid request object when calling buildDownloadObject', () => {
    const apiParam = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: dummyDateStr, to: dummyDateStr };
    const fileType = 'csv';

    const returnObj = {
      apiId: 1,
      params:
        `?filter=${apiParam.dateField}:gte:${dateRange.from},${apiParam.dateField}` +
        `:lte:${dateRange.to}&sort=-${apiParam.dateField}&format=${fileType}`,
    };

    expect(unitTestObjects.buildDownloadObject(apiParam, dateRange, fileType)).toStrictEqual(returnObj);
  });

  it('formats the date strings to YYYY-MM for specific APIs', () => {
    const dateExceptionApiId = GLOBALS.ENDPOINTS_WITH_YEAR_MONTH_DATE_FORMAT[0];
    const apiParam = { apiId: dateExceptionApiId, dateField: 'record_date' };
    const dateRange = { from: dummyDateStr, to: dummyDateStr };
    const formattedDateStr = dummyDateStr.slice(0, -3);
    const formattedDateRange = { from: formattedDateStr, to: formattedDateStr };
    const fileType = 'csv';

    const returnObj = {
      apiId: dateExceptionApiId,
      params:
        `?filter=${apiParam.dateField}:gte:${formattedDateRange.from},${apiParam.dateField}` +
        `:lte:${formattedDateRange.to}&sort=-${apiParam.dateField}&format=${fileType}`,
    };

    expect(unitTestObjects.buildDownloadObject(apiParam, dateRange, fileType)).toStrictEqual(returnObj);
  });

  it('returns a valid request object from buildDownloadObject when called with api object ' + 'has an alwaysSortWith attribute', () => {
    const apiParam = {
      apiId: 1,
      dateField: 'record_date',
      alwaysSortWith: ['-record_date', 'agency_nm', 'agency_bureau_indicator', 'bureau_nm'],
    };
    const dateRange = { from: dummyDateStr, to: dummyDateStr };
    const fileType = 'csv';

    const returnObj = {
      apiId: 1,
      params:
        `?filter=${apiParam.dateField}:gte:${dateRange.from},${apiParam.dateField}` +
        `:lte:${dateRange.to}&sort=-record_date,agency_nm,agency_bureau_indicator,bureau_nm&format=${fileType}`,
    };

    expect(unitTestObjects.buildDownloadObject(apiParam, dateRange, fileType)).toStrictEqual(returnObj);
  });

  it('fails on buildDownloadRequestArray when input params are invalid', () => {
    const apiParam = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: '2021-01-01', to: '2021-01-01' };
    const fileType = 'csv';

    expect(helpers.buildDownloadRequestArray(null, dateRange, fileType)).toBeNull();
    expect(helpers.buildDownloadRequestArray([], dateRange, fileType)).toBeNull();
    expect(helpers.buildDownloadRequestArray(apiParam, null, fileType)).toBeNull();
    expect(helpers.buildDownloadRequestArray(apiParam, dateRange, null)).toBeNull();
  });

  it('returns a valid request object when calling buildDownloadRequestArray with a ' + 'single API', () => {
    const apiParam = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: dummyDateJS, to: dummyDateJS };
    const fileType = 'csv';

    const returnObj = {
      apis: [
        {
          apiId: 1,
          params:
            `?filter=${apiParam.dateField}:gte:${dummyDateStr},${apiParam.dateField}` +
            `:lte:${dummyDateStr}&sort=-${apiParam.dateField}&format=${fileType}`,
        },
      ],
    };

    expect(helpers.buildDownloadRequestArray(apiParam, dateRange, fileType)).toStrictEqual(returnObj);
  });

  it('returns a valid request object when calling buildDownloadRequestArray with an ' + 'array of APIs', () => {
    const apiParams = [
      { apiId: 1, dateField: 'record_date' },
      { apiId: 2, dateField: 'some_date' },
      { apiId: 3, dateField: 'the_movies' },
    ];
    const dateRange = { from: dummyDateJS, to: dummyDateJS };
    const fileType = 'csv';

    const returnObj = {
      apis: [
        {
          apiId: 3,
          params:
            `?filter=${apiParams[2].dateField}:gte:${dummyDateStr},${apiParams[2].dateField}` +
            `:lte:${dummyDateStr}&sort=-${apiParams[2].dateField}&format=${fileType}`,
        },
        {
          apiId: 2,
          params:
            `?filter=${apiParams[1].dateField}:gte:${dummyDateStr},${apiParams[1].dateField}` +
            `:lte:${dummyDateStr}&sort=-${apiParams[1].dateField}&format=${fileType}`,
        },
        {
          apiId: 1,
          params:
            `?filter=${apiParams[0].dateField}:gte:${dummyDateStr},${apiParams[0].dateField}` +
            `:lte:${dummyDateStr}&sort=-${apiParams[0].dateField}&format=${fileType}`,
        },
      ],
    };

    expect(helpers.buildDownloadRequestArray(apiParams, dateRange, fileType)).toStrictEqual(returnObj);
  });

  it('if primary date field is filtered at the table level and it is filtered before the start date or after the end date of the API date field filter, then constrain the download params for that filter to the API date field', () => {
    const api = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: '2021-01-01', to: '2021-12-31' };
    const fileType = 'csv';

    const tableColumnSortDataAfter = [
      {
        allColumnsSelected: true,
        downloadFilter: false,
        filterValue: ['2021-01-01', '2022-01-01'],
        id: 'record_date',
      },
    ];

    const res1 = unitTestObjects.buildDownloadObject(api, dateRange, fileType, null, tableColumnSortDataAfter, null);
    expect(res1.params).toContain('record_date:lte:2021-12-31');

    const tableColumnSortDataBefore = [
      {
        allColumnsSelected: true,
        downloadFilter: false,
        filterValue: ['2020-01-01', '2021-12-31'],
        id: 'record_date',
      },
    ];

    const res2 = unitTestObjects.buildDownloadObject(api, dateRange, fileType, null, tableColumnSortDataBefore, null);
    expect(res2.params).toContain('record_date:gte:2021-01-01');
  });

  it('applies date filters for datasets where extra date filters can be applied in table', () => {
    const api = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: '2022-01-01', to: '2022-12-31' };
    const fileType = 'csv';
    const tableColumnSortData = [
      {
        allColumnsSelected: true,
        downloadFilter: false,
        filterValue: ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', '2022-01-05'],
        id: 'record_date',
      },
      {
        allColumnsSelected: true,
        downloadFilter: false,
        filterValue: ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', '2022-01-05'],
        id: 'original_auction_date',
      },
    ];

    const res = unitTestObjects.buildDownloadObject(api, dateRange, fileType, null, tableColumnSortData, null);
    expect(res.params).toContain('original_auction_date:gte:2022-01-01');
    expect(res.params).toContain('original_auction_date:lte:2022-01-05');
  });

  it('fields param contains all columns from sort param without the sort directions', () => {
    const api = { apiId: 1, dateField: 'record_date' };
    const dateRange = { from: '2022-01-01', to: '2022-12-31' };
    const fileType = 'csv';
    const tableColumnSortData = [
      {
        allColumnsSelected: false,
        sorted: 'asc',
        downloadFilter: false,
        filterValue: ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', '2022-01-05'],
        id: 'record_date',
      },
    ];

    const res = unitTestObjects.buildDownloadObject(api, dateRange, fileType, null, tableColumnSortData, null);
    console.log('res', res);
    expect(res.params).toContain('sort=+record_date'); // confirming we sort properly
    expect(res.params).toContain('fields=record_date'); // confirming it's been mirrored to fields without sort direction
  });
});
