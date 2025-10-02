import { formateCellGenerativeValue } from './format-cell-generative-value';

describe('formatCellValue', () => {
  const currencyConfig = [
    { type: 'NUMBER', fields: ['shares_per_par'], currency: true },
    { type: 'NUMBER', fields: ['not_currency'], currency: false },
  ];

  it('formats eff_date to MM/DD/YYYY when value is a valid date', () => {
    expect(formateCellGenerativeValue('2024-01-15', { columnName: 'eff_date' }, currencyConfig)).toBe('01/14/2024');
  });

  it('formats currency when field is listed with NUMBER+currency', () => {
    expect(formateCellGenerativeValue(1234.5, { columnName: 'shares_per_par' }, currencyConfig)).toBe('$1,234.50');
    expect(formateCellGenerativeValue('9876543.2', { columnName: 'shares_per_par' }, currencyConfig)).toBe('$9,876,543.20');
  });
});
