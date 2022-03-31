import { TableCache } from './table-cache';
import * as datasetDataApiHelpers from '../dataset-data-api-helper/dataset-data-api-helper';
import { testReformatter } from '../../filter-download-container/range-presets/helpers/test-helper';

// Note about filename using 'kache' instead of 'cache': Jest will not execute this file if it sees
// the word 'cache' in a spec file name.
describe('TableCache Utility Class', () => {

  const mockDataCache = [
    {
      range: {
        from: new Date(2020, 4, 8), //  5/08/2020 - 3/21/2021
        to: new Date(2021, 2, 21)
      },
      data: [
        { 'record_date': '2020-05-09', 'dollar_amt': 195 },
        { 'record_date': '2020-05-08', 'dollar_amt': 205 }
      ],
      meta: {label: 'meta_for_segment_zero'}
    },
    {
      range: {
        from: new Date(2017, 9, 28), //  10/28/2017 - 5/07/2020
        to: new Date(2020, 4, 7)
      },
      data: [
        { 'record_date': '2020-05-07', 'dollar_amt': 175 },
        { 'record_date': '2020-05-06', 'dollar_amt': 185 }
      ]
    },
    {
      range: {
        from: new Date(2016, 1, 14), //  2/14/2016 - 10/21/2017
        to: new Date(2017, 9, 21)
      },
      data: [
        { 'record_date': '2016-08-07', 'dollar_amt': 375 },
        { 'record_date': '2016-12-26', 'dollar_amt': 485 }
      ]
    },
    {
      range: {
        from: new Date(2015, 1, 14), //  2/14/2015 - 9/07/2015
        to: new Date(2015, 8, 7)
      },
      data: [
        { 'record_date': '2015-03-13', 'dollar_amt': 575 },
        { 'record_date': '2020-06-07', 'dollar_amt': 885 }
      ]
    }
  ];

  const mockRequestedRange = {
    from: new Date(2015, 0, 1), //  1/01/2015 - 4/28/2021
    to: new Date(2021, 3, 28)
  };

  const tableCache = new TableCache();

  tableCache.dataCache = mockDataCache;

  it('exposes a function that compares cached record date ranges with a newly requested date range and returns an ' +
  'array of date ranges that are needed to fill the gaps for which no data has been previously requested/cached', () => {

    const beforeAfterAndInBetween = tableCache.findUncachedDateRanges(mockRequestedRange).map(testReformatter);
    expect(beforeAfterAndInBetween).toEqual(["2021-03-22 - 2021-04-28", "2017-10-22 - 2017-10-27",
      "2015-09-08 - 2016-02-13", "2015-01-01 - 2015-02-13"]);

    const mockRequestedRange2 = {
      from: new Date(2010, 0, 1), //  1/01/2010 - 4/28/2011
      to: new Date(2011, 3, 28)
    };

    const allBefore = tableCache.findUncachedDateRanges(mockRequestedRange2).map(testReformatter);
    expect(allBefore).toEqual(["2010-01-01 - 2011-04-28"]);

    const mockRequestedRange3 = {
      from: new Date(2018, 0, 1), //  01/01/2018 - 12/31/2020
      to: new Date(2020, 11, 31)
    };

    const alreadyCached = tableCache.findUncachedDateRanges(mockRequestedRange3).map(testReformatter);
    expect(alreadyCached).toEqual([]);


    const mockRequestedRange4 = {
      from: new Date(2015, 5, 1), //  06/01/2015 - 7/31/2016
      to: new Date(2016, 6, 31)
    };

    const choppedAtBothEnds = tableCache.findUncachedDateRanges(mockRequestedRange4).map(testReformatter);
    expect(choppedAtBothEnds).toEqual(["2015-09-08 - 2016-02-13"]);
  });

  it('it returns a record set that includes a single array of data rows filtered to a ' +
    'given dateRange', () => {
    const mockRequestedRangeFullSegs = {
      from: new Date(2017, 9, 28),
      to: new Date(2021, 2, 21)
    };
    // test case where results include complete segments
    expect(tableCache.getRecordSetForRange(mockRequestedRangeFullSegs, 'record_date').data)
      .toEqual([...mockDataCache[0].data, ...mockDataCache[1].data]);

    const mockRequestedRangeFilterByRow = {
      from: new Date(2020, 4, 7),
      to: new Date(2020, 4, 8)
    };
    // test case where results filter complete segments to return a subset of records
    expect(tableCache.getRecordSetForRange(mockRequestedRangeFilterByRow, 'record_date').data)
      .toEqual([mockDataCache[0].data[1], mockDataCache[1].data[0]]);
  });

  it('caches multiple record set segments for a given table in date-decending order', () => {
    const tableCacheMock = new TableCache();
    tableCacheMock.updateDataCache([mockDataCache[3], mockDataCache[2],
      mockDataCache[1], mockDataCache[0]]);

    expect(tableCacheMock.dataCache).toEqual([mockDataCache[0], mockDataCache[1],
      mockDataCache[2], mockDataCache[3]]);

  });

  it(`caches data formatted for pivot display keyed by dateRange and pivot configuration and 
  returns appropriate responses from dataDisplay cache`, () => {

    // caching pivoted data display
    const mockPivotedData = {data: 'rows..', pivotApplied: 'By Desc:interest_amt'};
    tableCache.updateDataDisplayCache(mockPivotedData, mockRequestedRange);
    expect(tableCache.dataDisplayCache).toEqual({"2015-01-01:2021-04-28": {"By Desc:interest_amt": {
      "data": "rows..", "pivotApplied": "By Desc:interest_amt"}}});

    // caching complete table data display
    const mockCompleteTableData = {data: 'more rows..'};
    tableCache.updateDataDisplayCache(mockCompleteTableData, mockRequestedRange);
    expect(tableCache.dataDisplayCache['2015-01-01:2021-04-28'].all).toEqual({"data": "more rows.."});

    // retrieving existing pivoted data
    const mockSelectedPivot = {
      pivotView: {
        title: 'By Desc',
        dimensionField: 'type_desc'
      },
      pivotValue: {
        columnName: 'interest_amt'
      }
    };
    expect(tableCache.getCachedDataDisplay(mockRequestedRange, mockSelectedPivot, {}))
      .toEqual({"data": "rows..", "pivotApplied": "By Desc:interest_amt"});

    // retrieving cached Complete Table data
    const mockSelectedPivot2 = {
      pivotView: {
        title: 'Complete Table',
      }
    };
    expect(tableCache.getCachedDataDisplay(mockRequestedRange, mockSelectedPivot2, {}))
      .toEqual({"data": "more rows.."});

    // when attempting to retrieve a pivot config not yet cached, pivot the existing data to make one
    const mockSelectedPivot3 = {
      pivotView: {
        title: 'By Desc',
        dimensionField: 'type_desc'
      },
      pivotValue: {
        columnName: 'transaction_count'
      }
    };
    const mockTable = {table: 'mock table'};
    const pivotApiDataSpy = jest.spyOn(datasetDataApiHelpers, 'pivotApiData')
      .mockReturnValue({"data": "recently pivoted rows..",
        "pivotApplied": "By Desc:transaction_count"});
    tableCache.getCachedDataDisplay(mockRequestedRange, mockSelectedPivot3, mockTable);
    expect(pivotApiDataSpy).toBeCalledWith(mockTable, mockSelectedPivot3, {"data": "more rows.."},
      '2015-01-01', '2021-04-28');
    expect(tableCache.dataDisplayCache['2015-01-01:2021-04-28']['By Desc:transaction_count'].data)
      .toEqual('recently pivoted rows..');

    // when attempting to retrieve display data for which nothing has been cached, return falsy (null)
    const mockUncachedRange = {
      from: new Date(2004, 10, 27), //  1/01/2010 - 4/28/2011
      to: new Date(2006, 5, 6)
    };
    expect(tableCache.getCachedDataDisplay(mockUncachedRange, mockSelectedPivot, {}))
      .toBeFalsy();
  });


});
