import { CPI_BY_YEAR, CPI_MAX_YEAR, CPI_MIN_YEAR } from './cpi-data';

export interface IConversionResult {
  toValue: number;
  fromCpi: number;
  toCpi: number;
  cumulativeInflationPct: number;
  annualizedRatePct: number;
}

export const isYearInRange = (year: number): boolean =>
  Number.isInteger(year) && year >= CPI_MIN_YEAR && year <= CPI_MAX_YEAR && CPI_BY_YEAR[year] !== undefined;

export const convertDollars = (amount: number, fromYear: number, toYear: number): IConversionResult | null => {
  if (!Number.isFinite(amount) || !isYearInRange(fromYear) || !isYearInRange(toYear)) {
    return null;
  }
  const fromCpi = CPI_BY_YEAR[fromYear];
  const toCpi = CPI_BY_YEAR[toYear];
  const toValue = amount * (toCpi / fromCpi);
  const cumulativeInflationPct = (toCpi / fromCpi - 1) * 100;
  const years = toYear - fromYear;
  const annualizedRatePct = years === 0 ? 0 : (Math.pow(toCpi / fromCpi, 1 / years) - 1) * 100;
  return { toValue, fromCpi, toCpi, cumulativeInflationPct, annualizedRatePct };
};

export const formatDollars = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
};
