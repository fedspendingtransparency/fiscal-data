import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsSoldChart from './how-savings-bonds-sold-chart';
import { mockData01, mockData02 } from './how-savings-bond-sold-chart-test-helper'; 
import { calculatePercentage } from '../../../../../../utils/api-utils';


jest.mock('recharts', () => {
  const RechartsModule = jest.requireActual('recharts');
  return {
    ...RechartsModule,
    ResponsiveContainer: ({ children }) => (
      <RechartsModule.ResponsiveContainer width={100} height={100}>
        {children}
      </RechartsModule.ResponsiveContainer>
    ),
  };
});

describe('HowSavingsBondsSoldChart', () => {

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  beforeEach(() => {
    render(<HowSavingsBondsSoldChart />);
  });

  it('renders pie chart with provided mock data', () => {
    expect(screen.getByTestId('chartParent')).toBeInTheDocument();
  });
  it('chart mouse events', () => {
    const { getByTestId } = render(<HowSavingsBondsSoldChart />);
    const chartParent = getByTestId('chartParent');
    const chart = chartParent.children[1].children[0];
    expect(chart).toBeInTheDocument();
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
  });

  it('Check to see if notch loaded', async () => {
    const { getByText } = render(<HowSavingsBondsSoldChart />);
    expect(getByText('0.60%', { exact: false })).toBeInTheDocument();
  });

});

