import { divvyUpFilters, getApiData, pivotApiData, pivotApiDataFn, unitTestFunctions } from './dataset-data-api-helper';
import renderer from 'react-test-renderer';
import * as TestHelpers from '../test-helper';
import { createFilter, mockApiData, filteringOperators } from '../test-helper';
import * as ApiUtils from '../../../utils/api-utils';
import { TableCache } from '../table-cache/table-cache';

jest.useFakeTimers();
describe('DatasetDataApiHelper with proper dataset table props', () => {
  const consoleError = global.console.error;
  global.fetch = jest.fn(url => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    });
  });

  const mockSetIsLoading = jest.fn();
  const mockSetApiData = jest.fn();
  const mockSetApiError = jest.fn();
  let mockCanceledObj = { isCanceled: false, abortController: null };
  const createTestObj = val => ({ testVal: val });
  const mockSelectedTable149 = {
    apiId: 149,
  };
  const datatableRequestSpy = jest.spyOn(ApiUtils, 'datatableRequest');

  beforeAll(() => {
    global.console.error = jest.fn();
  });

  afterAll(() => {
    global.console.error = consoleError;
  });

  describe('single call to getApiData', () => {
    beforeEach(() => {
      mockCanceledObj = { isCanceled: false, abortController: { signal: null } };
      getApiData(
        TestHelpers.mockDateRange,
        TestHelpers.mockSelectedTable,
        TestHelpers.mockSelectedPivot,
        mockSetIsLoading,
        mockSetApiData,
        mockSetApiError,
        mockCanceledObj,
        new TableCache()
      );
    });

    it('calls datatableRequest when getApiData is called', async () => {
      await expect(datatableRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('uses onDataReturned to call setApiData if it receives data', () => {
      mockSetApiData.mockClear();
      unitTestFunctions.onDataReturned(
        TestHelpers.mockApiData,
        TestHelpers.mockDateRange,
        TestHelpers.mockSelectedTable,
        TestHelpers.mockSelectedPivot,
        mockSetIsLoading,
        mockSetApiData,
        mockSetApiError,
        mockCanceledObj,
        new TableCache()
      );
      expect(mockSetApiData).toHaveBeenCalledWith(TestHelpers.mockApiData);
    });

    it(`uses onDataReturned to call setApiData even if it receives an empty data array, so
    long as the apiId is NOT 149 `, () => {
      mockSetApiData.mockClear();
      const emptyData = { data: [] };
      unitTestFunctions.onDataReturned(
        emptyData,
        TestHelpers.mockDateRange,
        TestHelpers.mockSelectedTable,
        TestHelpers.mockSelectedPivot,
        mockSetIsLoading,
        mockSetApiData,
        mockSetApiError,
        mockCanceledObj,
        new TableCache()
      );
      expect(mockSetApiData).toHaveBeenCalledWith(emptyData);
    });

    it('uses onDataReturned to call makeApiCall again if no data returns and the apiId is 149', async () => {
      datatableRequestSpy.mockClear();
      mockSetApiData.mockClear();
      await unitTestFunctions.onDataReturned(
        TestHelpers.mockApiDataEmpty,
        TestHelpers.mockDateRange,
        mockSelectedTable149,
        TestHelpers.mockSelectedPivot,
        mockSetIsLoading,
        mockSetApiData,
        mockSetApiError,
        mockCanceledObj,
        new TableCache()
      );

      await expect(datatableRequestSpy).toHaveBeenCalledTimes(1);
      await expect(mockSetApiData).toHaveBeenCalledTimes(1);
    });

    it('has a makeApiCall function that calls dataTableRequest if successful', () => {
      datatableRequestSpy.mockClear();
      unitTestFunctions.makeApiCall();
      expect(datatableRequestSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('handles the error response correctly', async () => {
    mockSetApiData.mockClear();
    mockSetApiError.mockClear();
    const error = { message: 'error' };
    global.fetch = jest.fn(url => {
      return Promise.reject(error);
    });
    const origConsoleLog = global.console.log;
    global.console.log = jest.fn();
    mockCanceledObj = { isCanceled: false };
    await renderer.act(async () => {
      await getApiData(
        TestHelpers.mockDateRange,
        TestHelpers.mockSelectedTable,
        TestHelpers.mockSelectedPivot,
        mockSetIsLoading,
        mockSetApiData,
        mockSetApiError,
        { isCanceled: false, abortController: { signal: null } },
        new TableCache()
      );
      await jest.runAllTimers();
    });

    await renderer.act(async () => {
      await expect(mockSetApiError).toHaveBeenCalledWith(error);
    });

    global.console.log = origConsoleLog;
  });

  it('exposes a function that prepares non-pivoted data to be pivoted' + ' and passes it to ApiUtils.pivotData', () => {
    ApiUtils.pivotData = jest.fn();

    const mockTable = { dateField: 'record_date' };
    const mockPivot = {
      pivotView: {
        dimensionField: 'dimnsn_fld',
        aggregateOn: 'MONTH',
        filters: [
          {
            key: 'type_desc',
            value: 'Went to the Market',
          },
        ],
      },
      pivotValue: { columnName: 'num_nickels' },
    };
    pivotApiData(mockTable, mockPivot, { data: 'mockData' }, '2016-03-25', '2021-03-25');
    expect(ApiUtils.pivotData.mock.calls[0].slice(0, 7)).toEqual([
      { data: 'mockData' },
      'record_date',
      mockPivot.pivotView,
      'num_nickels',
      'MONTH',
      '2016-03-25',
      '2021-03-25',
    ]);

    // sixth argument should be a filter function based on the filters sent in
    const filterFn = ApiUtils.pivotData.mock.calls[0][7];
    // so make sure it filters as expected
    const mockRowsToFilter = [
      { type_desc: 'Went to the Market' },
      { type_desc: 'Stayed Home' },
      { type_desc: 'had none' },
      { type_desc: 'wee wee wee all...' },
    ];
    expect(mockRowsToFilter.filter(row => filterFn(row)).length).toEqual(1);
  });

  it('allows for pivoted data to be correctly filtered with all supported operators', () => {
    const nine = createTestObj('9');
    const ten = createTestObj('10');
    const eleven = createTestObj('11');
    // eq
    expect(pivotApiDataFn(nine, filteringOperators.eq10)).toBeFalsy();
    expect(pivotApiDataFn(ten, filteringOperators.eq10)).toBeTruthy();
    expect(pivotApiDataFn(eleven, filteringOperators.eq10)).toBeFalsy();
    // neq
    expect(pivotApiDataFn(nine, filteringOperators.neq10)).toBeTruthy();
    expect(pivotApiDataFn(ten, filteringOperators.neq10)).toBeFalsy();
    expect(pivotApiDataFn(eleven, filteringOperators.neq10)).toBeTruthy();
    // gt
    expect(pivotApiDataFn(nine, filteringOperators.gt10)).toBeFalsy();
    expect(pivotApiDataFn(ten, filteringOperators.gt10)).toBeFalsy();
    expect(pivotApiDataFn(eleven, filteringOperators.gt10)).toBeTruthy();
    // gte
    expect(pivotApiDataFn(nine, filteringOperators.gte10)).toBeFalsy();
    expect(pivotApiDataFn(ten, filteringOperators.gte10)).toBeTruthy();
    expect(pivotApiDataFn(eleven, filteringOperators.gte10)).toBeTruthy();
    // lt
    expect(pivotApiDataFn(nine, filteringOperators.lt10)).toBeTruthy();
    expect(pivotApiDataFn(ten, filteringOperators.lt10)).toBeFalsy();
    expect(pivotApiDataFn(eleven, filteringOperators.lt10)).toBeFalsy();
    // lte
    expect(pivotApiDataFn(nine, filteringOperators.lte10)).toBeTruthy();
    expect(pivotApiDataFn(ten, filteringOperators.lte10)).toBeTruthy();
    expect(pivotApiDataFn(eleven, filteringOperators.lte10)).toBeFalsy();
    // in
    expect(pivotApiDataFn(nine, filteringOperators.in812)).toBeFalsy();
    expect(pivotApiDataFn(ten, filteringOperators.in8910)).toBeTruthy();
    expect(pivotApiDataFn(eleven, filteringOperators.in8910)).toBeFalsy();
    // nin
    expect(pivotApiDataFn(ten, filteringOperators.nin8910)).toBeFalsy();
    expect(pivotApiDataFn(eleven, filteringOperators.nin8910)).toBeTruthy();
    // No operator (defaults to eq)
    expect(pivotApiDataFn(nine, filteringOperators.noOperator10)).toBeFalsy();
    expect(pivotApiDataFn(ten, filteringOperators.noOperator10)).toBeTruthy();
    expect(pivotApiDataFn(eleven, filteringOperators.noOperator10)).toBeFalsy();
  });

  it('handles in and nin operations where a field name includes an ascii comma', () => {
    const comma = '&44;';
    const listOfFields = [`Moe${comma} Larry and Curly`, `Ed${comma} Edd n Eddy`, `Huey${comma} Dewey${comma} and Louie`, `Batman and Robin`];
    const randomField = createTestObj('Random Field');

    // Create filter where any field that matches any of the fields in listOfFields passes
    const inFilter = createFilter('in', listOfFields.join(','));
    // Create filter where any field that doesn't match any of the fields in listOfFields passes
    const ninFilter = createFilter('nin', listOfFields.join(','));

    // Take each field above and test them against the inFilter and ninFilter
    listOfFields.forEach(val => {
      const decodedVal = createTestObj(val.replace(/&44;/gi, ','));
      expect(pivotApiDataFn(decodedVal, inFilter)).toBeTruthy();
      expect(pivotApiDataFn(decodedVal, ninFilter)).toBeFalsy();
    });
    // Take a random field, not listed in the listOfFields, and test them against the inFilter and ninFilter
    expect(pivotApiDataFn(randomField, inFilter)).toBeFalsy();
    expect(pivotApiDataFn(randomField, ninFilter)).toBeTruthy();
  });

  it('does not process successful or errored responses when the request is canceled', async () => {
    mockSetApiData.mockClear();
    mockSetApiError.mockClear();
    mockCanceledObj = { isCanceled: true };
    await getApiData(
      TestHelpers.mockDateRange,
      TestHelpers.mockSelectedTable,
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      new TableCache()
    );
    await jest.runAllTimers();
    expect(mockSetApiData).not.toHaveBeenCalled();
    expect(mockSetApiError).not.toHaveBeenCalled();

    global.fetch = jest.fn(url => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiData),
      });
    });
    mockCanceledObj = { isCanceled: true };
    await getApiData(
      TestHelpers.mockDateRange,
      TestHelpers.mockSelectedTable,
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      new TableCache()
    );
    await jest.runAllTimers();
    expect(mockSetApiData).not.toHaveBeenCalled();
  });
});

describe('DatasetDataApiHelper without proper dataset table props', () => {
  const mockSetIsLoading = jest.fn();
  const mockSetApiData = jest.fn();
  const mockSetApiError = jest.fn();
  const mockUpdateDataCache = jest.fn();
  const mockCanceledObj = { isCanceled: false };

  const datatableRequestSpy = jest.spyOn(ApiUtils, 'datatableRequest');

  it('does not make any api fetch calls', async () => {
    datatableRequestSpy.mockReset();
    getApiData();
    // The first three variables (dateRange, selectedTable and selectedPivot)
    // are tne essential variables that determine whether to make the api call or not.
    getApiData(
      null,
      TestHelpers.mockSelectedTable,
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      mockUpdateDataCache
    );
    getApiData(
      {},
      TestHelpers.mockSelectedTable,
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      mockUpdateDataCache
    );
    getApiData(
      TestHelpers.mockDateRange,
      null,
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      mockUpdateDataCache
    );
    getApiData(
      TestHelpers.mockDateRange,
      {},
      TestHelpers.mockSelectedPivot,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      mockUpdateDataCache
    );
    getApiData(
      TestHelpers.mockDateRange,
      TestHelpers.mockSelectedTable,
      null,
      mockSetIsLoading,
      mockSetApiData,
      mockSetApiError,
      mockCanceledObj,
      mockUpdateDataCache
    );
    expect(datatableRequestSpy).not.toHaveBeenCalled();
  });

  it('divvies up filters between the browser and the API correctly', () => {
    const mockFilters = [
      {
        key: 'col1',
        operator: 'eq',
        value: 'Banana',
      },
      {
        key: 'col2',
        operator: 'eq',
        value: 'null',
      },
      {
        key: 'col3',
        operator: 'in',
        value: 'null,Banana,Orange',
      },
      {
        key: 'col4',
        operator: 'in',
        value: 'Cherry,Banana,Orange',
      },
      {
        key: 'col5',
        operator: 'neq',
        value: 'Total%20Interest-bearing%20Debt',
      },
      {
        key: 'col6',
        operator: 'nin',
        value: 'tomato,cucumber,celery',
      },
      {
        key: 'col7',
        operator: 'in',
        value: 'Roma (tomato),Lawrence (cucumber)',
      },
      {
        key: 'col8',
        operator: 'eq',
        value: 'Roma - tomato (red)',
      },
      {
        key: 'col9',
        operator: 'in',
        value: 'Roma&44;tomato',
      },
    ];
    const [apiFilters, browserFilters] = divvyUpFilters(mockFilters);
    expect(apiFilters.map(f => f.key)).toEqual(['col1', 'col4', 'col8']);
    expect(browserFilters.map(f => f.key)).toEqual(['col2', 'col3', 'col5', 'col6', 'col7', 'col9']);
  });
});
