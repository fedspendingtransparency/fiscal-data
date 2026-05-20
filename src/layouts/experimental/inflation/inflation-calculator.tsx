import React, { FunctionComponent, useMemo, useState } from 'react';
import { CPI_MAX_YEAR, CPI_MIN_YEAR } from './cpi-data';
import { convertDollars, formatDollars, isYearInRange } from './inflation-math';
import {
  arrow,
  chip,
  container,
  error,
  exampleChips,
  examples,
  examplesLabel,
  field,
  header,
  input,
  inputsRow,
  label,
  metaItem,
  result,
  resultLine,
  resultMeta,
  resultValue,
  subtitle,
  title,
} from './inflation-calculator.module.scss';

interface IExample {
  label: string;
}

const EXAMPLES: IExample[] = [
  { label: '$1 in 1950 to today' },
  { label: '$100 in 1985 to today' },
  { label: '$50,000 in 2000 to today' },
  { label: 'A 1969 moon mission ($25.4B) to today' },
];

const InflationCalculator: FunctionComponent = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromYear, setFromYear] = useState<string>('1985');
  const [toYear, setToYear] = useState<string>(String(CPI_MAX_YEAR));

  const parsed = useMemo(() => {
    const amt = parseFloat(amount.replace(/[$,]/g, ''));
    const fy = parseInt(fromYear, 10);
    const ty = parseInt(toYear, 10);
    return { amt, fy, ty };
  }, [amount, fromYear, toYear]);

  const validationError = useMemo(() => {
    if (!Number.isFinite(parsed.amt)) return 'Enter a dollar amount.';
    if (!isYearInRange(parsed.fy)) return `From year must be between ${CPI_MIN_YEAR} and ${CPI_MAX_YEAR}.`;
    if (!isYearInRange(parsed.ty)) return `To year must be between ${CPI_MIN_YEAR} and ${CPI_MAX_YEAR}.`;
    return null;
  }, [parsed]);

  const result_ = useMemo(() => {
    if (validationError) return null;
    return convertDollars(parsed.amt, parsed.fy, parsed.ty);
  }, [parsed, validationError]);

  return (
    <div className={container}>
      <div className={header}>
        <h1 className={title}>Inflation Calculator</h1>
        <p className={subtitle}>How does the purchasing power of a U.S. dollar change between two years?</p>
      </div>

      <div className={inputsRow}>
        <div className={field}>
          <label className={label} htmlFor="ic-amount">
            Amount (USD)
          </label>
          <input id="ic-amount" className={input} type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className={field}>
          <label className={label} htmlFor="ic-from">
            In year
          </label>
          <input
            id="ic-from"
            className={input}
            type="number"
            min={CPI_MIN_YEAR}
            max={CPI_MAX_YEAR}
            value={fromYear}
            onChange={e => setFromYear(e.target.value)}
          />
        </div>
        <div className={arrow} aria-hidden="true">
          to
        </div>
        <div className={field}>
          <label className={label} htmlFor="ic-to">
            In year
          </label>
          <input
            id="ic-to"
            className={input}
            type="number"
            min={CPI_MIN_YEAR}
            max={CPI_MAX_YEAR}
            value={toYear}
            onChange={e => setToYear(e.target.value)}
          />
        </div>
      </div>

      {validationError ? (
        <div className={error} role="alert">
          {validationError}
        </div>
      ) : result_ ? (
        <div className={result}>
          <p className={resultLine}>
            <strong>{formatDollars(parsed.amt)}</strong> in <strong>{parsed.fy}</strong> has the same purchasing power as
          </p>
          <p className={resultValue} aria-live="polite">
            {formatDollars(result_.toValue)} in {parsed.ty}
          </p>
          <div className={resultMeta}>
            <span className={metaItem}>
              Cumulative inflation: <strong>{result_.cumulativeInflationPct.toFixed(1)}%</strong>
            </span>
            <span className={metaItem}>
              Annualized rate: <strong>{result_.annualizedRatePct.toFixed(2)}%</strong>
            </span>
            <span className={metaItem}>
              CPI: <strong>{result_.fromCpi.toFixed(1)}</strong> to <strong>{result_.toCpi.toFixed(1)}</strong>
            </span>
          </div>
        </div>
      ) : null}

      <div className={examples}>
        <div className={examplesLabel}>Try one of these</div>
        <div className={exampleChips}>
          {EXAMPLES.map(ex => (
            <button key={ex.label} type="button" className={chip}>
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
