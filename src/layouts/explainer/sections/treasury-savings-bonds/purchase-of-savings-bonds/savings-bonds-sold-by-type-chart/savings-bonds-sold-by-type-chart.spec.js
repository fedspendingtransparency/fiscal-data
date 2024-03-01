import React from 'react';
import SavingsBondsSoldByTypeChart from './savings-bonds-sold-by-type-chart';
import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { mockData } from './savings-bonds-sold-by-type-chart-helper';
import { mockSavingsBondFetchResponses } from '../../../../explainer-test-helper';

describe('Savings Bonds by Type Over Time Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeAll(() => mockSavingsBondFetchResponses());

  afterEach(() => {
    jest.resetModules();
  });

  it('renders the chart', () => {
    const { container, getByText } = render(<SavingsBondsSoldByTypeChart chartData={mockData} />);
    expect(container).toBeInTheDocument();
    expect(getByText('Adjust for Inflation')).toBeInTheDocument();
  });

  it('renders the chart toggle', () => {
    const { getByTestId, queryByTestId, getByRole } = render(<SavingsBondsSoldByTypeChart chartData={mockData} />);
    const descriptionsToggle = getByRole('button', { name: 'Description' });
    expect(getByTestId('chartParent')).toBeInTheDocument();
    act(() => {
      fireEvent.click(descriptionsToggle);
    });
    expect(queryByTestId('chartParent')).not.toBeInTheDocument();
  });

  it('renders chart evergreen copy values', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SavingsBondsSoldByTypeChart chartData={mockData} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('FY 1935 – FTYD 2024', { exact: false })).toBeInTheDocument();
    expect(getByText('December 12, 2024', { exact: false })).toBeInTheDocument();
  });
});
