import { expenseLegend, expenseText, legendContainer, line, rateLegend, rectangle } from './interest-expense-chart.module.scss';
import React, { FunctionComponent, ReactElement } from 'react';

type Tooltip = (object: {
  payload: [{ payload: { year: number; expense: number; rate: number }; dataKey: string }];
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

// export const mockChartXAxisValues = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const mockChartData = [
  {
    year: 2010,
    expense: 320000000000,
    rate: 3.0,
  },
  {
    year: 2011,
    expense: 380000000000,
    rate: 2.8,
  },
  {
    year: 2012,
    expense: 260000000000,
    rate: 2.7,
  },
  {
    year: 2013,
    expense: 450000000000,
    rate: 2.6,
  },
  {
    year: 2014,
    expense: 500000000000,
    rate: 2.6,
  },
  {
    year: 2015,
    expense: 600000000000,
    rate: 2.6,
  },
  {
    year: 2016,
    expense: 650000000000,
    rate: 2.7,
  },
  {
    year: 2017,
    expense: 700000000000,
    rate: 2.7,
  },
  {
    year: 2018,
    expense: 250000000000,
    rate: 2.8,
  },
  {
    year: 2019,
    expense: 450000000000,
    rate: 2.9,
  },
  {
    year: 2020,
    expense: 550000000000,
    rate: 3.0,
  },
  {
    year: 2021,
    expense: 580000000000,
    rate: 3.4,
  },
  {
    year: 2022,
    expense: 610000000000,
    rate: 3.6,
  },
  {
    year: 2023,
    expense: 680000000000,
    rate: 3.7,
  },
  {
    year: 2024,
    expense: 890000000000,
    rate: 3.8,
  },
];
