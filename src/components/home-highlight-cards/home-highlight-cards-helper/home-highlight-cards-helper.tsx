import React from 'react';
import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';
import { DatasetFieldDataType } from '../../../models/fdg-types';

import { negative, positive, labelContainer, labelPrefix, valueClass } from './home-highlight-cards-helper.module.scss';

export interface ColorCoding {
  primaryColor: string;
  secondaryColor: string;
}

export const ariaLabels = [
  {
    title: 'What is the current national debt?',
    label:
      'Line graph displaying the national debt in trillions over the last 5 years. ' +
      'The graph shows a steady upward trend. Hover over the chart to display values for each year.',
  },
  {
    title: 'What is the national deficit by year?',
    label:
      'Bar chart displaying the national deficit over the last 5 completed calendar years. ' +
      'The chart shows the rise and fall of deficits over time. Hover over the chart to display values for each year.',
  },
  {
    title: 'How much money goes into/out of the federal government?',
    label:
      'Bar chart displaying the receipts and outlays of the federal government over the last 6 completed months. ' +
      'Blue bars indicating receipts lie above the axis and red bars indicating outlays lie below the axis. ' +
      'The chart shows the fluctuations in receipts and outlays over time. Hover over the chart to display values for each month.',
  },
  {
    title: 'What is the value of the U.S. Treasury-owned gold?',
    label:
      'Displays an image of stacked gold bars. ' +
      'Below the chart is displayed the current value of U.S. Treasury-owned gold. ' +
      'Hover over the gold bars to see them sparkle.',
  },
  {
    title: 'How much money does the U.S. have on hand?',
    label:
      'Line graph displaying the operating cash balance of the U.S. government over the last 6 completed months. ' +
      'The graph shows a steady upward trend. Hover over the chart to display values for each month.',
  },
  {
    title: 'How has the average interest rate on national debt changed over time?',
    label:
      'Line graph displaying the average interest rates on U.S. Treasury securities over the last 5 completed calendar years. ' +
      'The graph shows the rise and fall of average interest rates over time. Hover over the chart to display values for each year.',
  },
  {
    title: 'How much does the federal government borrow from the public?',
    label:
      'Line graph displaying U.S. government borrowing from the public over the last 6 months. ' +
      'The chart shows the rise and fall of borrowing from the public over time. Hover over the chart to display values for each month.',
  },
  {
    title: 'How much money does the government spend?',
    label:
      'Bar chart displaying U.S. government spending over the last 6 months. ' +
      'The chart shows the rise and fall of spending over time. Hover over the chart to display values for each month.',
  },
];

export const formatCardValue = (
  value: number,
  prefix?: string,
  dataType: DatasetFieldDataType = 'CURRENCY', // should only be 'CURRENCY' or 'PERCENTAGE'
  colorCoding: ColorCoding = { primaryColor: '', secondaryColor: '' }
): JSX.Element => {
  const valueClassName = value < 0 ? negative : positive;
  const label = dataType && dataType.indexOf('CURRENCY') > -1 ? simplifyNumber(value, dataType) : `${Math.round(+value * 100) / 100}%`;

  return (
    <div className={labelContainer}>
      {prefix ? (
        <span className={labelPrefix} style={{ color: colorCoding.primaryColor }} data-testid="prefix">
          {prefix}
        </span>
      ) : null}
      <span className={`${valueClass} ${valueClassName}`} style={{ color: colorCoding.secondaryColor }} data-testid="label">
        {label}
      </span>
    </div>
  );
};
