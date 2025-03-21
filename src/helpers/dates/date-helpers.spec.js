import { getFiscalYearByDate, isValidDateRange } from './date-helpers';

describe('Date helper', () => {
  const earliest = '01/01/2000';
  const latest = '01/01/2021';

  it('returns true with a valid date range', () => {
    const startDate = '01/01/2005';
    const endDate = '01/01/2015';

    expect(isValidDateRange(startDate, endDate, earliest, latest)).toBe(true);
  });

  it('returns false with if the start or end dates are invalid', () => {
    const startDate = '13/41/2005';
    const endDate = '01/01/2015';

    expect(isValidDateRange(startDate, endDate, earliest, latest)).toBe(false);
  });

  it('returns false if the start or end dates are outside the range', () => {
    let startDate = '01/01/1990';
    let endDate = '01/01/2015';

    expect(isValidDateRange(startDate, endDate, earliest, latest)).toBe(false);

    startDate = '01/01/2005';
    endDate = '01/01/2025';

    expect(isValidDateRange(startDate, endDate, earliest, latest)).toBe(false);
  });

  it('returns the correct fiscal year', () => {
    const endOfSept = new Date('09/30/2025');
    const beginOfOct = new Date('10/01/2025');

    expect(getFiscalYearByDate(endOfSept)).toBe(2025);
    expect(getFiscalYearByDate(beginOfOct)).toBe(2026);
    expect(`${getFiscalYearByDate()}`).toMatch(/^(\d{4})$/g);
  });
});
