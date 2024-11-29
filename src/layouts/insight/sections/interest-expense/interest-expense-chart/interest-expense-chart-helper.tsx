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
