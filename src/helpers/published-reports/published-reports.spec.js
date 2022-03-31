const { getPublishedReports } = require('./published-reports');
describe('Published Reports helpers', () => {
  // todo - Break the following test out into multiple tests
  it(`exports a function that correctly fetches published report data and vets them by
    appropriate whitelists`, async () => {
    const mockResponseObj = [{
      "report_date": "1869-01-31",
      "path": "/static-data/published-reports/mspd-entire/MonthlyStatementPublicDebt_Entire_186901.pdf",
      "report_group_id": "3",
      "report_group_desc": "Entire (.pdf)",
      "report_group_sort_order_nbr": "1"
    }, {
      "report_date": "1869-01-31",
      "path": "/static-data/published-reports/mspd-entire/MonthlyStatementPublicDebt_Entire_186901.xls",
      "report_group_id": "1",
      "report_group_desc": "Entire (.xls)",
      "report_group_sort_order_nbr": "1"
    }, {
      "report_date": "2005-05-31",
      "path": "/static-data/published-reports/mspd-primary-dealers/MonthlyStatementPublicDebt_PrimaryDealers_200505.xls",
      "report_group_id": "4",
      "report_group_desc": "Primary Dealers (.xls)",
      "report_group_sort_order_nbr": "4"
    }, {
      "report_date": "1998-06-30",
      "path": "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_199806.pdf",
      "report_group_id": "2",
      "report_group_desc": "STRIPS (.pdf)",
      "report_group_sort_order_nbr": "3"
    }, {
      "report_date": "1998-07-31",
      "path": "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_199807.pdf",
      "report_group_id": "2",
      "report_group_desc": "STRIPS (.pdf)",
      "report_group_sort_order_nbr": "3"
    }];
    const mockUtils = {
      mockRequestUtil: async () => Promise.resolve({json: () => Promise.resolve(mockResponseObj)})
    };
    const firstDateString = mockResponseObj[0].report_date;
    const [year,month,day] = firstDateString.split('-');
    const mockRequestSpy = jest.spyOn(mockUtils, 'mockRequestUtil');
    const emptyReports = await getPublishedReports(
      'UNVETTED-DATASET-ID',
      'http://mock.base.url',
      mockUtils.mockRequestUtil
    );
    const publishedReports = await getPublishedReports(
      '015-BFS-2014Q1-11',
      'http://mock.base.url',
      mockUtils.mockRequestUtil
    );

    // url only called for whitelisted dataset and is correctly formulated
    expect(mockRequestSpy).toBeCalledTimes(1);
    expect(mockRequestSpy).toHaveBeenCalledWith(
      'http://mock.base.url/services/dtg/publishedfiles?dataset_id=015-BFS-2014Q1-11'
    );

    // returns empty array for non-whitelisted dataset ID
    expect(emptyReports).toStrictEqual(null);

    // returns correctly filtered array for whitelisted dataset with its own whitelisted group_desc
    // values
    expect(publishedReports.length).toEqual(5);

    // handles date conversion as expected
    expect(publishedReports[0].report_date.getFullYear()).toEqual(1869);

    // Properly transforms the date without a timezone offset
    // Note that the variables firstDateString,year,month and day are derived above before
    // the code translates it to a new Date within getPublishedReports
    expect(new Date(year,month-1,day,0,0,0)).toEqual(publishedReports[0].report_date);

    // todo - We'll need to verify that the current environment has a timezone other than GMT to run the statement below
    // expect(new Date(firstDateString)).not.toEqual(publishedReports[0].report_date);
  });
});
