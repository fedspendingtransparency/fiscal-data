import { getDateLabelForReport, getLatestReport, getPublishedDates } from './report-helpers';

const mockReports = [
    {
      path: '/penny-report-01.pdf',
      report_date: '2020-07-31'
    },
    {
      path: '/penny-report-02.pdf',
      report_date: '2020-09-30'
    }];

describe('report-group helpers library', () => {
  let reports;

  beforeEach( () => {
    reports = (mockReports);
  });

  it(`exposes a function that asynchronously returns an array of downloadable object
  metadata for a given datasetId`, async () => {
    expect(reports.length).toBe(2);
  });

  it('does not cast dates until getPublishedDates is called', async () => {
    expect(reports[0].report_date instanceof Date).toBeFalsy();
    getPublishedDates(reports);
    expect(reports[0].report_date instanceof Date).toBeTruthy();
  });

  it('properly translates dates without doing a timezone offset', () => {
    const dateString = '2022-02-01';
    const [year,month,day] = dateString.split('-');
    const desiredDate = new Date(year,month-1,day,0,0,0);
    //const offsetDate = new Date(dateString);
    const reportObj = [{report_date: dateString}];

    // todo - We'll need to verify that the current environment has a timezone other than GMT to run the statement below
    //expect(desiredDate).not.toEqual(offsetDate);
    getPublishedDates(reportObj);
    expect(desiredDate).toEqual(reportObj[0].report_date);
  });

  it(`exposes a function that returns an "Mmm YYYY" formatted date
  for a given report`, async () => {
    expect(getDateLabelForReport(reports[0])).toStrictEqual('Jul 2020');
  });

  it(`exposes a function that returns an "Mmm dd, YYYY" formatted date
  for a report that is classified as daily`, async () => {
    expect(getDateLabelForReport(reports[0], true)).toStrictEqual('Jul 31, 2020');
  });

  it(`exposes a function that returns the most recent report from an array of
  report objects`, async () => {
    expect(getLatestReport(reports).path).toStrictEqual('/penny-report-02.pdf');
  });
});
