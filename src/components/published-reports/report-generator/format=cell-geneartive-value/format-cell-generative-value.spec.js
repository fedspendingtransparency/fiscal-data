import { formateCellGenerativeValue } from './format-cell-generative-value';

describe('formatCellValue', () => {
  const currencyConfig = [
    { type: 'NUMBER', fields: ['shares_per_par'], currency: true },
    { type: 'NUMBER', fields: ['not_currency'], currency: false },
  ];

  it('does NOT treat 0 as empty', () => {
    expect(formateCellGenerativeValue(0, { columnName: 'shares_per_par' }, currencyConfig)).toBe('$0.00');
  });

  it('formats eff_date to MM/DD/YYYY when value is a valid date', () => {
    expect(formateCellGenerativeValue('2024-01-15', { columnName: 'eff_date' }, currencyConfig)).toBe('01/14/2024');
  });

  it('leaves eff_date as-is if the date is invalid', () => {
    const val = 'not-a-date';
    expect(formateCellGenerativeValue(val, { columnName: 'eff_date' }, currencyConfig)).toBe(val);
  });

  it('formats currency when field is listed with NUMBER+currency', () => {
    expect(formateCellGenerativeValue(1234.5, { columnName: 'shares_per_par' }, currencyConfig)).toBe('$1,234.50');
    expect(formateCellGenerativeValue('9876543.2', { columnName: 'shares_per_par' }, currencyConfig)).toBe('$9,876,543.20');
  });

  it('does not format currency for NUMBER fields without currency flag', () => {
    expect(formateCellGenerativeValue(1234.5, { columnName: 'not_currency' }, currencyConfig)).toBe('1234.5');
  });

  it('handles missing/undefined customFormatting gracefully', () => {
    expect(formateCellGenerativeValue(42, { columnName: 'shares_per_par' })).toBe('42');
    expect(formateCellGenerativeValue('2025-10-01', { columnName: 'not_eff_date' })).toBe('2025-10-01');
  });

  it('returns string form by default for non-empty, non-date, non-currency', () => {
    expect(formateCellGenerativeValue('abc', { columnName: 'col' }, currencyConfig)).toBe('abc');
    expect(formateCellGenerativeValue(123, { columnName: 'col' }, currencyConfig)).toBe('123');
    expect(formateCellGenerativeValue(true, { columnName: 'col' }, currencyConfig)).toBe('true');
  });

  it('does not trim whitespace-only strings (current contract)', () => {
    expect(formateCellGenerativeValue('   ', { columnName: 'col' }, currencyConfig)).toBe('   ');
  });
});
