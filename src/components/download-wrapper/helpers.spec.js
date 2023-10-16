import { ensureDoubleDigitDate, formatDate } from './helpers';

describe('Download Wrapper Helpers', () => {
  it('has function ensureDoubleDigitDate that ensures a 2 digit number from a 1 to 2 ' + 'digit param', () => {
    let expectedValue = '05';
    let curValue = 5;
    expect(ensureDoubleDigitDate(curValue)).toStrictEqual(expectedValue);
    expect(ensureDoubleDigitDate(curValue.toString())).toStrictEqual(expectedValue);

    expectedValue = '11';
    curValue = 11;
    expect(ensureDoubleDigitDate(curValue)).toStrictEqual(expectedValue);
    expect(ensureDoubleDigitDate(curValue.toString())).toStrictEqual(expectedValue);
  });

  it('formats dates into mm/dd/yyyy form even if the month or day are single digits', () => {
    let curDate = new Date(2021, 0, 1);
    let expectedDate = '01/01/2021';
    expect(formatDate(curDate)).toStrictEqual(expectedDate);

    curDate = new Date(2021, 10, 29);
    expectedDate = '11/29/2021';
    expect(formatDate(curDate)).toStrictEqual(expectedDate);
  });
});
