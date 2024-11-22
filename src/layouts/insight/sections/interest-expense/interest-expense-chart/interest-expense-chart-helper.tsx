import { expenseLegend, expenseText, legendContainer, line, rateLegend, rectangle } from './interest-expense-chart.module.scss';
import React, { FunctionComponent, ReactElement } from 'react';

type Tooltip = (object: {
  payload: [{ payload: { year: number; interestExpense: number; avgInterestRate: number }; dataKey: string }];
  setYear: (x: number) => void;
  setExpense: (x: number) => void;
  setRate: (x: number) => void;
}) => void;

export const CustomTooltip: Tooltip = ({ payload = [], setYear, setExpense, setRate }): null => {
  if (payload.length > 0) {
    setYear(payload[0]?.payload.year);
    const rate = payload.find(x => x.dataKey === 'rate');
    setRate(rate.payload.rate);
    const expense = payload.find(x => x.dataKey === 'expense');
    setExpense(expense.payload.expense);
  }
  return null;
};

export const Legend: FunctionComponent = (): ReactElement => {
  return (
    <div className={legendContainer}>
      <div className={expenseLegend}>
        <span className={expenseText}>Interest Expense</span>
        <div className={rectangle} />
      </div>
      <div className={rateLegend}>
        <div className={line} />
        <span>Avg. Interest Rate</span>
      </div>
    </div>
  );
};

export const mockChartData = [
  {
    year: 2010,
    interestExpense: 320000000000,
    avgInterestRate: 3.0,
  },
  {
    year: 2011,
    interestExpense: 380000000000,
    avgInterestRate: 2.8,
  },
  {
    year: 2012,
    interestExpense: 260000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2013,
    interestExpense: 450000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2014,
    interestExpense: 500000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2015,
    interestExpense: 600000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2016,
    interestExpense: 650000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2017,
    interestExpense: 700000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2018,
    interestExpense: 250000000000,
    avgInterestRate: 2.8,
  },
  {
    year: 2019,
    interestExpense: 450000000000,
    avgInterestRate: 2.9,
  },
  {
    year: 2020,
    interestExpense: 550000000000,
    avgInterestRate: 3.0,
  },
  {
    year: 2021,
    interestExpense: 580000000000,
    avgInterestRate: 3.4,
  },
  {
    year: 2022,
    interestExpense: 610000000000,
    avgInterestRate: 3.6,
  },
  {
    year: 2023,
    interestExpense: 680000000000,
    avgInterestRate: 3.7,
  },
  {
    year: 2024,
    interestExpense: 890000000000,
    avgInterestRate: 3.8,
  },
];
