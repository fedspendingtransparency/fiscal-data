import { formatCellGenerativeValue } from './format-cell-generative-value';

describe('formatCellGenerativeValue (switch version)', () => {
  const col = (overrides = {}) => ({
    columnName: 'col',
    dataType: 'STRING',
    ...overrides,
  });

  const currencyRules = [
    { type: 'NUMBER', fields: ['shares_per_par'], currency: true },
    { type: 'NUMBER', fields: ['plain_number'], currency: false },
  ];

  it('returns empty string for nullish/empty/"null"', () => {
    expect(formatCellGenerativeValue(null, col())).toBe('');
    expect(formatCellGenerativeValue(undefined, col())).toBe('');
    expect(formatCellGenerativeValue('', col())).toBe('');
    expect(formatCellGenerativeValue('null', col())).toBe('');
  });

  describe('DATE types', () => {
    it('formats YYYY-MM-DD as MM/DD/YYYY without time zone drifting', () => {
      expect(formatCellGenerativeValue('2024-01-15', col({ dataType: 'DATE', columnName: 'eff_date' }))).toBe('01/15/2024');
    });
  });

  describe('NUMBER types', () => {
    it('uses customFormatting to render currency when flagged', () => {
      expect(formatCellGenerativeValue(1234.5, col({ dataType: 'NUMBER', columnName: 'shares_per_par' }), currencyRules)).toBe('$1,234.50');

      expect(formatCellGenerativeValue('9876543.2', col({ dataType: 'NUMBER', columnName: 'shares_per_par' }), currencyRules)).toBe('$9,876,543.20');
    });

    it('does not format as currency if not flagged', () => {
      expect(formatCellGenerativeValue(1234.5, col({ dataType: 'NUMBER', columnName: 'plain_number' }), currencyRules)).toBe('1234.5');
    });
  });
});
