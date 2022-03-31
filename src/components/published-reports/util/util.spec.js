import React from 'react';
import {getYearReportOptions, getMonthOptions} from "./util";
import {reports} from "../test-helper";

describe('The util', () => {
  it('returns a list of year options', () => {
    const reportsByYear = getYearReportOptions(reports);
    expect(reportsByYear.length).toStrictEqual(3);
    expect(reportsByYear[0].label).toStrictEqual('Select A Year');
    expect(reportsByYear[1].label).toBe(2020);
    expect(reportsByYear[2].label).toBe(2019);
  });

  it('returns a list of year options', () => {
    const monthOptions = getMonthOptions(reports.slice(0, 2));
    expect(monthOptions.length).toStrictEqual(3);
    expect(monthOptions[0].label).toStrictEqual('Select A Month');
    expect(monthOptions[1].label).toBe('Jun');
    expect(monthOptions[1].value).toBe(5);
    expect(monthOptions[2].label).toBe('Jul');
    expect(monthOptions[2].value).toBe(6);
  });
});
