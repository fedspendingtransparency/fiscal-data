import React from 'react';
import ChartDescription from './chart-description';
import { render } from '@testing-library/react';
import { savingsBondsMap } from '../savings-bonds-sold-by-type-chart-helper';

describe('chart description', () => {
  it('renders the component', () => {
    const instance = render(<ChartDescription />);
    expect(instance).toBeDefined();
  });

  it('renders bond headers and color label', () => {
    const { getByText, getByTestId } = render(<ChartDescription />);
    expect(getByText('A - D')).toBeInTheDocument();
    expect(getByTestId('AD-box')).toHaveStyle({ backgroundColor: savingsBondsMap['AD'].color });
  });
});
