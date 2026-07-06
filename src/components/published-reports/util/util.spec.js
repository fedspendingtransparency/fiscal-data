import { getDayOptions, getMonthOptions, getYearReportOptions, getFileDisplay, isReportGroupYearlyFrequency } from './util';
import { dailyReports, reports } from '../test-helper';

describe('The util', () => {
  it('returns a list of year options', () => {
    const reportsByYear = getYearReportOptions(reports);
    expect(reportsByYear.length).toStrictEqual(3);
    expect(reportsByYear[0].label).toStrictEqual('Select A Year');
    expect(reportsByYear[1].label).toBe(2020);
    expect(reportsByYear[2].label).toBe(2019);
  });

  it('returns a list of month options', () => {
    const monthOptions = getMonthOptions(reports.slice(0, 2));
    expect(monthOptions.length).toStrictEqual(3);
    expect(monthOptions[0].label).toStrictEqual('Select A Month');
    expect(monthOptions[1].label).toBe('Jun');
    expect(monthOptions[1].value).toBe(5);
    expect(monthOptions[2].label).toBe('Jul');
    expect(monthOptions[2].value).toBe(6);
  });

  it('returns a list of day options', () => {
    const dayOptions = getDayOptions(dailyReports.slice(2, 6));
    expect(dayOptions.length).toStrictEqual(5);
    expect(dayOptions[0].label).toStrictEqual('Select A Day');
    expect(dayOptions[1].label).toBe(14);
    expect(dayOptions[2].label).toBe(13);
    expect(dayOptions[3].label).toBe(12);
    expect(dayOptions[4].label).toBe(11);
  });

  it('identifies report groups with one report month per year as yearly', () => {
    const yearlyReports = [2020, 2021, 2022].map(year => ({ report_date: new Date(`9/30/${year}`) }));
    expect(isReportGroupYearlyFrequency(yearlyReports)).toBe(true);
  });

  it('does not identify monthly report groups as yearly', () => {
    expect(isReportGroupYearlyFrequency(reports)).toBe(false);
  });

  it('replaces (.xlsx) with .xlsx when file type is xlsx', () => {
    const curReportFile = {
      report_group_desc: 'My-Report (.xlsx)',
      path: 'file.xlsx',
    };

    const result = getFileDisplay(curReportFile);

    expect(result.fullName).toBe('My-Report.xlsx');
    expect(result.fileType).toBe('.xlsx');
    expect(result.displayName).toBeTruthy();
  });
});
