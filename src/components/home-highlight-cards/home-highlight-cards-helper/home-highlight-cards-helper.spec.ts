import { formatCardValue, ColorCoding } from './home-highlight-cards-helper';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';
import { DatasetFieldDataType } from '../../../models/fdg-types';

describe('Home Highlight Cards Helper', () => {
  const dollarValue: number = 5000000000; // 5 billion
  const percentValue: number = 50;
  const currencyDataType: DatasetFieldDataType = 'CURRENCY';
  const percentDataType: DatasetFieldDataType = 'PERCENTAGE';
  const prefix: string = 'test prefix';
  const colorCoding: ColorCoding = {
    primaryColor: 'gray',
    secondaryColor: 'green'
  }

  it('accepts a numeric value and returns a simplified number', () => {
    const { getByTestId } = render(formatCardValue(dollarValue));
    expect(getByTestId('label')).toHaveTextContent(simplifyNumber(dollarValue, currencyDataType));
  });

  it('accepts an optional data type parameter (defaults to currency)', () => {
    const { getByTestId } = render(formatCardValue(percentValue, null, percentDataType));
    expect(getByTestId('label')).toHaveTextContent(`${percentValue}%`);
  });

  it('accepts an optional label prefix parameter', () => {
    const { getByTestId } = render(formatCardValue(dollarValue, prefix));
    expect(getByTestId('prefix')).toHaveTextContent(prefix);
  });

  it('accepts an optional color coding parameter', () => {
    const { getByTestId } = render(formatCardValue(dollarValue, prefix, null, colorCoding));
    expect(getByTestId('prefix')).toHaveStyle({ color: colorCoding.primaryColor });
    expect(getByTestId('label')).toHaveStyle({ color: colorCoding.secondaryColor });
  });
});