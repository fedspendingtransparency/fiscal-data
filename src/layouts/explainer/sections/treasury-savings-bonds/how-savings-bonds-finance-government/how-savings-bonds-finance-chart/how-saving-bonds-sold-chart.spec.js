import React from 'react';
import { render, fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsSoldChart from './how-savings-bonds-sold-chart';
import { expectedResultOne, expectedResultTwo, mockDatasetOne, mockDatasetTwo } from './how-savings-bond-sold-chart-test-helper'; 
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
    render(<HowSavingsBondsSoldChart chartData={mockDatasetTwo} />);
  });

  it('renders pie chart with provided mock data', () => {
    expect(screen.getByTestId('chartParent')).toBeInTheDocument();
  });
  it('responds to chart mouse events', () => {
    const chartParent = screen.getByTestId('chartParent');
    fireEvent.mouseOver(chartParent);
    fireEvent.mouseLeave(chartParent);
  });

  it('Check to see if notch loaded', async () => {
    await waitFor(() => expect(screen.getByText('0.60%', {exact: false}))).toBeInTheDocument
  });

  it('Calculate perctage correctly for given data', async () => {
    expect(calculatePercentage(mockDatasetTwo)).toEqual(expectedResultTwo);
    expect(calculatePercentage(mockDatasetOne)).toEqual(expectedResultOne);
  });

});

