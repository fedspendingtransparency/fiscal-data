import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HowSavingsBondsSoldChart from './how-savings-bonds-sold-chart';
import { expectedResultOne, expectedResultTwo, mockDatasetOne, mockDatasetTwo } from './how-savings-bond-sold-chart-test-helper';
import { calculatePercentage } from '../../../../../../utils/api-utils';
import Analytics from '../../../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

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

  it('Calculate percentage correctly for given data', async () => {
    expect(calculatePercentage(mockDatasetTwo)).toEqual(expectedResultTwo);
    expect(calculatePercentage(mockDatasetOne)).toEqual(expectedResultOne);
  });

  it('calls ga event when the glossary term is clicked', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const glossaryTerm = screen.getByRole('button', { name: 'intragovernmental' });
    fireEvent.click(glossaryTerm);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Glossary Term Click',
      category: 'Explainers',
      label: 'Savings Bonds - Intragovernmental Holdings',
    });
  });

  it('calls the correct ga event when a custom link is clicked', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const nationalDebtLink = screen.getByRole('link', { name: 'National Debt explainer' });
    const mspdLink = screen.getByRole('link', { name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)' });
    fireEvent.click(nationalDebtLink);
    expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Savings Bonds Citation Click', category: 'Explainers', label: 'National Debt' });
    fireEvent.click(mspdLink);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Savings Bonds Citation Click',
      category: 'Explainers',
      label: 'Summary of Treasury Securities Outstanding',
    });
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

  it('tests ga hover event on the pie chart', () => {
    jest.useFakeTimers();
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const chartParent = screen.getByTestId('chartParent');
    const pieChart = chartParent.querySelector('svg');
    userEvent.hover(pieChart);
    jest.runAllTimers();
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Chart Hover',
      category: 'Explainers',
      label: 'Savings Bonds - Savings Bonds Sold as a Percentage of Total Debt Held by the Public',
    });
    userEvent.unhover(pieChart);
  });
});
