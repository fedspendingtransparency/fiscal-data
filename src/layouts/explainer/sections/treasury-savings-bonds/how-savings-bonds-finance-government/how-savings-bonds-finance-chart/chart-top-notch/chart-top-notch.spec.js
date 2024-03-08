import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartTopNotch from './chart-top-notch';

describe('RenderActiveShape', () => {
  const mockProps = {
    cx: 100,
    cy: 100,
    midAngle: 45,
    innerRadius: 40,
    outerRadius: 80,
    startAngle: 0,
    endAngle: 90,
    fill: 'red',
    opacity: 1,
    payload: { name: 'Test Sector' },
    percent: 25,
  };

  it('renders correctly with provided props', () => {
    const { getByText } = render(<ChartTopNotch {...mockProps} />);
    expect(getByText('Test Sector')).toBeInTheDocument();
    expect(getByText(`${mockProps.percent.toFixed(1)}%`)).toBeInTheDocument();

  });
});
