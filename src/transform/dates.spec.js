const { convertAPIDate, convertJSDateToAPI, getDateRange } = require('./dates');

describe('Transform dates helper', () => {
  const apiDateStr = '2020-03-15';
  const apiDatesArr = [
    {
      earliestDate: '2020-01-01',
      latestDate: '2020-05-01',
      lastUpdated: '2020-12-01', // Latest lastUpdate
    },
    {
      earliestDate: '1820-01-01', // Earliest earliestDate
      latestDate: '1999-12-31',
      lastUpdated: '1999-12-31',
    },
    {
      earliestDate: '2000-01-01',
      latestDate: '2020-07-31', // Latest latestDate
      lastUpdated: '2020-07-31',
    },
  ];
  const apiSingleTable = [
    {
      earliestDate: '2000-01-01',
      latestDate: '2020-07-31',
      lastUpdated: '2020-07-31',
    },
  ];

  it('converts API date string from YYYY-MM-DD to readable MM/DD/YYYY format', () => {
    expect(convertAPIDate(apiDateStr)).toStrictEqual('03/15/2020');
  });
  it("extracts the desired/correct dataset's date range from an array of its table's dates which also runs the convertAPIDate on these dates", () => {
    const dateRange = getDateRange(apiDatesArr);
    expect(dateRange.earliestDate).toStrictEqual('01/01/1820');
    expect(dateRange.latestDate).toStrictEqual('07/31/2020');
    expect(dateRange.lastUpdated).toStrictEqual('12/01/2020');
  });
  it('converts the dates from dataset with a single table understanding that all of the dates in the first index are the desired dates', () => {
    const dateRange = getDateRange(apiSingleTable);
    expect(dateRange.earliestDate).toStrictEqual('01/01/2000');
    expect(dateRange.latestDate).toStrictEqual('07/31/2020');
    expect(dateRange.lastUpdated).toStrictEqual('07/31/2020');
  });
  it('converts JS dates to formatted strings that our API can use YYYY-MM-DD', () => {
    const date1 = new Date(2021, 0, 1);
    const date2 = {};

    expect(convertJSDateToAPI(date1)).toStrictEqual('2021-01-01');
    expect(convertJSDateToAPI(date2)).toBeNull();
  });
});
