import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsSoldChart from './how-savings-bonds-sold-chart';
import { expectedResultOne, expectedResultTwo, mockDatasetOne, mockDatasetTwo } from './how-savings-bond-sold-chart-test-helper';
import { calculatePercentage } from '../../../../../../utils/api-utils';
import { analyticsEventHandler } from '../../../../explainer-helpers/explainer-helpers';
import { glossaryGAEvent } from '../../treasury-savings-bonds';

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

jest.mock('../../treasury-savings-bonds');
jest.mock('../../../../explainer-helpers/explainer-helpers');

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
    await waitFor(() => expect(screen.getByText('0.60%', { exact: false }))).toBeInTheDocument;
  });

  it('Calculate percentage correctly for given data', async () => {
    expect(calculatePercentage(mockDatasetTwo)).toEqual(expectedResultTwo);
    expect(calculatePercentage(mockDatasetOne)).toEqual(expectedResultOne);
  });

  it('calls ga event when the glossary term is clicked', () => {
    const glossaryTerm = screen.getByText('intragovernmental');
    fireEvent.click(glossaryTerm);
    expect(glossaryGAEvent).toHaveBeenCalledWith('Intragovernmental Holdings');
  });

  it('calls the correct ga event when a custom link is clicked', () => {
    const nationalDebtLink = screen.getByRole('link', { name: 'National Debt explainer' });
    const mspdLink = screen.getByRole('link', { name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)' });
    fireEvent.click(nationalDebtLink);
    expect(analyticsEventHandler).toHaveBeenCalledWith('National Debt', 'Savings Bonds Citation Click');
    fireEvent.click(mspdLink);
    expect(analyticsEventHandler).toHaveBeenCalledWith('Summary of Treasury Securities Outstanding', 'Savings Bonds Citation Click');
  });

  it('adjusts the chart height/width appropriately for small screens', () => {
    window.innerWidth = 400;
    fireEvent(window, new Event('resize'));
    const chartParent = screen.getByTestId('chartParent');
    const pieChart = chartParent.querySelector('svg');
    expect(pieChart).toHaveAttribute('width', '335');
    expect(pieChart).toHaveAttribute('height', '360');
  });

  it('adjusts the chart height/width appropriately for medium screens', () => {
    window.innerWidth = 600;
    fireEvent(window, new Event('resize'));
    const chartParent = screen.getByTestId('chartParent');
    const pieChart = chartParent.querySelector('svg');
    expect(pieChart).toHaveAttribute('width', '382');
    expect(pieChart).toHaveAttribute('height', '382');
  });
});
