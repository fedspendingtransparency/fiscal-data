import {
  datatableRequest,
  fetchAllPages,
  pagedDatatableRequest,
  buildSortParams, buildFields
} from "./api-utils"
import * as helpers from './api-utils-helper';
import { TableCache } from '../components/dataset-data/table-cache/table-cache';
import { mockFetchApi } from './mock-utils';

describe('Api Utils function library', () => {
  const unitTestObjects = helpers.unitTestObjects;

  const testTable = {
    endpoint: 'testEndpoint',
    dateField: 'test_date_field',
    alwaysSortWith: ['field1', 'field2', 'field3']
  };

  const selectedPivot = {
    pivotView: {
      aggregateOn: null,
      chartType: "none",
      dimensionField: null,
      filters: null,
      title: "Complete Table"
    },
    pivotValue: null
  };

  const selectedPivotWithFilters = {
    pivotView: { aggregateOn: ['MONTH'],
      dimensionField: 'field1',
      filters: [{
        key: "field1",
        operator: "eq",
        value: "Banana"
      }, {
        key: "field2",
        operator: "neq",
        value: "null"
      }, {
        key: "field3",
        operator: "eq",
        value: "Orange"
      }],
      title: "Filtered Pivot" },
    pivotValue: "field3"
  };

  it('adds sort parameters if alwaysSortBy property is provided', async () => {
    global.fetch = jest.fn().mockReturnValueOnce(Promise.resolve(
      {
        ok: true,
        json: () => Promise.resolve(
        { data: [], links: { next: '' }, meta: { 'total-pages': 1 } }
      ) }));
    const mockRange = { from: new Date(2021, 0, 1), to: new Date(2021, 1, 1)};
    await datatableRequest(testTable, mockRange, selectedPivot,
      { isCanceled: false, abortController: {signal: null} }, new TableCache());
    expect(global.fetch.mock.calls).toEqual(
      [["https://www.transparency.treasury.gov/services/api/" +
      "fiscal_service/testEndpoint?filter=test_date_field" +
      ":gte:2021-01-01,test_date_field:lte:2021-02-01" +
      "&sort=field1,field2,field3&page%5Bnumber%5D=1&page%5Bsize%5D=10000", {signal: null}]]);
  });

  it(`adds appropriate query string filter parameter when there are a combination of
  serializable and unserializable filters in the selected pivot`, async () => {

    global.fetch = jest.fn()
      .mockReturnValueOnce(Promise.resolve({ ok: true, json: () => Promise.resolve(
        { data: [], links: { next: '' }, meta: {
          labels: { 'test_date_field': 'Date'},
            dataTypes: { 'test_date_field': 'Date'},
            'total-pages': 1 } }
      ) }));

    const mockRange = { from: new Date(2021, 0, 1), to: new Date(2021, 1, 1)};
    await datatableRequest(testTable, mockRange, selectedPivotWithFilters,
      { isCanceled: false, abortController: {signal: null} }, new TableCache());
    expect(global.fetch.mock.calls[0][0]).toContain(
      '&filter=test_date_field%3Agte%3A2021-01-01%2Ctest_date_field%3Alte' +
      '%3A2021-02-01%2Cfield1%3Aeq%3ABanana%2Cfield3%3Aeq%3AOrange&');
  });

  it('has a fetchAllPages method that automatically calls as ' +
    'many pages of data as needed calling all pages subsequent to the first ' +
    'concurrently', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(mockFetchApi(1, 1))
      .mockImplementationOnce(mockFetchApi(2, 200))
      .mockImplementationOnce(mockFetchApi(3, 100));

    await fetchAllPages('https://mockapirequest.url/',
      { isCanceled: false, abortController: {signal: null} }).then(result => {
      expect(global.fetch.mock.calls).toEqual([
        ['https://mockapirequest.url/&page%5Bnumber%5D=1&page%5Bsize%5D=10000', {signal: null}],
        ['https://mockapirequest.url/&page%5Bnumber%5D=2&page%5Bsize%5D=10000', {signal: null}],
        ['https://mockapirequest.url/&page%5Bnumber%5D=3&page%5Bsize%5D=10000', {signal: null}]
      ]);

      const sequences = result.data.map(r => r.pageNumber);
      expect(sequences).toEqual([1, 2, 3]);  // data is ordered properly

      // Call #2 is expected to initiate before call #3.
      const timeCalledDiff = result.data[2].timeCalled - result.data[1].timeCalled;
      expect(timeCalledDiff).toBeGreaterThanOrEqual(0);

      // Call #3 is expected to finish before call #2.
      const timeDiffReturned = result.data[1].timeReturned - result.data[2].timeReturned;
      expect(timeDiffReturned).toBeGreaterThanOrEqual(0);
    });
  });

  it('correctly applies alwaysSortWith fields in paginated requests', async () => {
    global.fetch =
      jest.fn().mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(
        {
          data: [],
          links: {
            next: '&page%5Bnumber%5D=2&page%5Bsize%5D=10000'
          },
          meta: {'total-pages': 3}
        }) }));
    const fetchSpy = jest.spyOn(global, 'fetch');
    await pagedDatatableRequest(
      unitTestObjects.dataTables[1],
      '2021-01-01',
      '2021-02-01',
      null,
      1,
      5);
    expect(fetchSpy.mock.calls[0][0]).toContain('sort=-record_date,col4');
  });

  it('applies descending sort order to paginated requests where ' +
    'alwaysSortWith is not provided', async () => {
    global.fetch =
      jest.fn().mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(
        {
          data: [],
          links: {
            next: '&page%5Bnumber%5D=2&page%5Bsize%5D=10000'
          },
          meta: {'total-pages': 3} }) }));
    const fetchSpy = jest.spyOn(global, 'fetch');
    await pagedDatatableRequest(
      unitTestObjects.dataTables[0],
      '2021-01-01',
      '2021-02-01',
      null,
      1,
      5);
    expect(fetchSpy.mock.calls[0][0]).toContain('sort=-record_date');
  });

  it('builds sort parameters for datatables based on configurations', () => {
    const testTable1 = {
      endpoint: 'testEndpoint',
      dateField: 'test_date_field'
    };
    const testPivot = {
      pivotView: {
        aggregateOn: [
          {
            field: 'gouda'
          },
          {
            field: 'cheddar'
          },
          {
            field: 'mozzarella'
          }
        ]
      }
    };
    expect(buildSortParams(null, null)).toBe('');

    expect(buildSortParams(testTable)).toEqual(testTable.alwaysSortWith.join(','));
    expect(buildSortParams(testTable1)).toEqual(`-${testTable1.dateField}`);
    expect(buildSortParams(testTable, testPivot)).toEqual('-gouda,-cheddar,-mozzarella');
  });

  it('includes alwaysSort fields in th fields list for pivot requests', () => {
    const mockTable = {
      alwaysSortWith: ['column1', '-column2'],
      dateField: 'column3'
    };
    const mockPivotValue = {
      dimensionField: "column1",
      lastRowSnapshot: true
    };
    const mockPivotValueField = "column4";
    const mockAggregateOn = null;

    expect(buildFields(mockTable, mockPivotValue, mockPivotValueField, mockAggregateOn).sort())
      .toStrictEqual(['column1', 'column2', 'column3', 'column4'].sort());
  });
});
