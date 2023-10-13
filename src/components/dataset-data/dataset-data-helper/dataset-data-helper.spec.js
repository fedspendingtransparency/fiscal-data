import { matchTableFromApiTables, parseTableSelectionFromUrl, rewriteUrl, thinDataAsNeededForChart } from './dataset-data-helper';

describe('DatasetData helper', () => {
  let urlChangeSpy;

  beforeEach(() => {
    urlChangeSpy = jest.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTables = [
    { apiId: 1, pathName: 'debt-to-the-nickel' },
    { apiId: 2, pathName: 'debt-to-the-penny' },
    { apiId: 3, pathName: 'debt-to-the-half-dollar' },
  ];

  it('returns null from matchTableFromApiTables if one or both of the params are bad', () => {
    let curSelectedTable = null;
    let apiTables = null;
    expect(matchTableFromApiTables(curSelectedTable, apiTables)).toStrictEqual(null);

    curSelectedTable = mockTables[0];
    expect(matchTableFromApiTables(curSelectedTable, apiTables)).toStrictEqual(null);

    apiTables = mockTables.slice();
    curSelectedTable = null;
    expect(matchTableFromApiTables(curSelectedTable, apiTables)).toStrictEqual(null);
  });

  it('returns the matched table from the apiTables array in matchTableFromApiTables', () => {
    const apiTables = mockTables.slice();
    const selectedIdx = 1;
    const curSelectedTable = mockTables[selectedIdx];

    // We need to ensure we map back to the apiTables array since the dropdown needs to have the selectedTable highlighted.
    expect(matchTableFromApiTables(curSelectedTable, apiTables)).toStrictEqual(apiTables[selectedIdx]);
  });

  it('identifies the table needed when it is named in the url', () => {
    // without any query string params
    const mockLocation = { pathname: `/datasets/mock-dataset/${mockTables[2].pathName}` };
    expect(parseTableSelectionFromUrl(mockLocation, mockTables)).toBe(mockTables[2]);

    // with queryString params
    const mockLocationWithQueryString = { pathname: `/datasets/mock-dataset/${mockTables[1].pathName}?data=preprod&fruit=quince` };
    expect(parseTableSelectionFromUrl(mockLocationWithQueryString, mockTables)).toBe(mockTables[1]);
  });

  it('defaults to the first table when no table is named in the url', () => {
    const mockLocation = { pathname: '/datasets/mock-dataset/' };
    expect(parseTableSelectionFromUrl(mockLocation, mockTables)).toBe(mockTables[0]);

    // with queryString params
    const mockLocationWithQueryString = { pathname: '/datasets/mock-dataset/?data=preprod&fruit=quince' };
    expect(parseTableSelectionFromUrl(mockLocationWithQueryString, mockTables)).toBe(mockTables[0]);
  });

  it('correctly appends the selected table name to the url', () => {
    const updatedUrl = rewriteUrl(mockTables[1], '/mock-dataset/', null);
    expect(urlChangeSpy).toHaveBeenCalledWith('', '', '/datasets/mock-dataset/debt-to-the-penny');
    expect(updatedUrl).toEqual('/datasets/mock-dataset/debt-to-the-penny');
  });

  it('keeps querystring content intact when updating the url to reflect change in table selection', () => {
    const updatedUrl = rewriteUrl(mockTables[2], '/mock-dataset/', { search: '?data=preprod' });
    expect(urlChangeSpy).toHaveBeenCalledWith('', '', '/datasets/mock-dataset/debt-to-the-half-dollar?data=preprod');
    expect(updatedUrl).toEqual('/datasets/mock-dataset/debt-to-the-half-dollar?data=preprod');
  });

  it('correctly determines when to thin out data for charting purposes and leaves on record per month plus the latest record in those cases', () => {
    const mockData = [
      { record_date: '2020-06-04', amt: '1' },
      { record_date: '2020-06-03', amt: '2' },
      { record_date: '2020-06-01', amt: '3' },
      { record_date: '2020-05-29', amt: '4' },
      { record_date: '2020-05-04', amt: '5' },
      { record_date: '2020-05-01', amt: '6' },
      { record_date: '2020-03-31', amt: '7' },
    ];

    // chop off two most recent records to ensure latest is not added twice.
    const modifiedMockData = mockData.slice(2, 7);

    const thinnedOut = [
      { record_date: '2020-03-31', amt: '7' },
      { record_date: '2020-05-01', amt: '6' },
      { record_date: '2020-06-01', amt: '3' },
      { record_date: '2020-06-04', amt: '1' },
    ];

    // does thin records out when the correct dataset slug is identified
    expect(thinDataAsNeededForChart(mockData.slice(), '/debt-to-the-penny/', 'record_date')).toStrictEqual(thinnedOut);

    //now there are two correct dataset slugs
    expect(thinDataAsNeededForChart(mockData.slice(), '/qtcb-historical-interest-rates/', 'record_date')).toStrictEqual(thinnedOut);

    // does not duplicate the final row when the correct dataset slug is identified and there's only one record for the final month
    expect(thinDataAsNeededForChart(modifiedMockData, '/debt-to-the-penny/', 'record_date')).toStrictEqual([
      thinnedOut[0],
      thinnedOut[1],
      thinnedOut[2],
    ]);

    // does NOT thin records out for any other dataset slug values
    expect(thinDataAsNeededForChart(mockData, '/debt-to-the-nickel/', 'record_date')).toBe(mockData);
  });
});
