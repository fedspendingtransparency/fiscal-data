import { currencyFormatter, numberFormatter, dateFormatter } from './text-format';

describe('Text Format helper', () => {
  it('returns correctly formatted currency', () => {
    const val1 = '123123123.23';
    const val2 = '-12123.23';
    expect(currencyFormatter.format(val1)).toBe('$123,123,123.23');
    expect(currencyFormatter.format(val2)).toBe('-$12,123.23');
  });

  it('returns correctly formatted numbers', () => {
    /**
     * REGEX:
     * optional '-'
     * any 3 digits; followed by a ','; repeat
     * optional '.' followed by any number of digits
     * NOTE: allows for no leading digit EX) .09
     */
    const regex = new RegExp(/^\-?\d*(\,\d{3})*(\.\d+)?$/);

    let arg = '-123456.00099475';
    let result = numberFormatter.format(arg);
    expect(result).toMatch(regex);

    arg = '.12345';
    result = numberFormatter.format(arg);
    expect(result).toMatch(regex);
  });

  it('returns correctly formatted dates', () => {
    /**
     * REGEX:
     * allows 1/1/0000 || 01/01/0000
     */
    const regex = new RegExp(/([1-9]|0[0-9]|1[0-9])\/([0-9][0-9]|[0-9])\/[0-9]{4}/);

    let date = '2020/03/31';
    let arg = new Date(date.replace(/-/g, '/'));
    let result = dateFormatter.format(arg);
    expect(result).toMatch(regex);

    date = '2020/3/1';
    arg = new Date(date.replace(/-/g, '/'));
    result = dateFormatter.format(arg);
    expect(result).toMatch(regex);
  });
});
