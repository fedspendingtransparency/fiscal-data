import React from 'react';
import SavingsBondsSoldByTypeChart from './savings-bonds-sold-by-type-chart';
import { fireEvent, render, act } from '@testing-library/react';

describe('Savings Bonds by Type Over Time Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  it('renders the chart', () => {
    const { container, getByText } = render(<SavingsBondsSoldByTypeChart />);
    expect(container).toBeInTheDocument();
    expect(getByText('Adjust for Inflation')).toBeInTheDocument();
  });

  it('renders the chart toggle', () => {
    const { getByTestId, queryByTestId, getByRole } = render(<SavingsBondsSoldByTypeChart />);
    const descriptionsToggle = getByRole('button', { name: 'Description' });
    expect(getByTestId('chartParent')).toBeInTheDocument();
    act(() => {
      fireEvent.click(descriptionsToggle);
    });
    expect(queryByTestId('chartParent')).not.toBeInTheDocument();
  });
});
