import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartTableHeader from './chart-table-header';
import '@testing-library/jest-dom';

const dummyLeftIcon = { prefix: 'fas', iconName: 'dummyLeft', icon: [1, 1, '', '', ''] };
const dummyRightIcon = { prefix: 'fas', iconName: 'dummyRight', icon: [1, 1, '', '', ''] };

const mockToggle = jest.fn();
jest.mock('../chart-table-toggle/charting-table-toggle', () => {
  return props => {
    mockToggle(props);
    return (
      <div data-testid="toggle-component">
        <button onClick={() => props.toggleClickHandler('chartView')}>Chart</button>
        <button onClick={() => props.toggleClickHandler('tableView')}>Table</button>
      </div>
    );
  };
});

describe('ChartTableHeader Component', () => {
  const mockSetSelectedChartView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with correct toggle props when selectedChartView is "chartView"', () => {
    render(
      <ChartTableHeader
        selectedChartView="chartView"
        setSelectedChartView={mockSetSelectedChartView}
        leftIcon={dummyLeftIcon}
        rightIcon={dummyRightIcon}
      />
    );

    expect(screen.getByTestId('toggle-component')).toBeInTheDocument();
    const propsPassed = mockToggle.mock.calls[0][0];
    expect(propsPassed.primaryColor).toBe('#0071BC');
    expect(propsPassed.chartId).toBeNull();
    expect(propsPassed.leftButtonConfig).toEqual({
      leftId: 'chartView',
      leftSelected: true,
    });
    expect(propsPassed.rightButtonConfig).toEqual({
      rightId: 'tableView',
      rightSelected: false,
    });
    expect(propsPassed.leftIcon).toEqual(dummyLeftIcon);
    expect(propsPassed.rightIcon).toEqual(dummyRightIcon);
  });

  it('renders header with correct toggle props when selectedChartView is "tableView"', () => {
    render(
      <ChartTableHeader
        selectedChartView="tableView"
        setSelectedChartView={mockSetSelectedChartView}
        leftIcon={dummyLeftIcon}
        rightIcon={dummyRightIcon}
      />
    );
    const propsPassed = mockToggle.mock.calls[0][0];
    expect(propsPassed.leftButtonConfig).toEqual({
      leftId: 'chartView',
      leftSelected: false,
    });
    expect(propsPassed.rightButtonConfig).toEqual({
      rightId: 'tableView',
      rightSelected: true,
    });
    expect(propsPassed.leftIcon).toEqual(dummyLeftIcon);
    expect(propsPassed.rightIcon).toEqual(dummyRightIcon);
  });

  it('calls setSelectedChartView with "chartView" when Chart button is clicked', () => {
    render(
      <ChartTableHeader
        selectedChartView="tableView"
        setSelectedChartView={mockSetSelectedChartView}
        leftIcon={dummyLeftIcon}
        rightIcon={dummyRightIcon}
      />
    );

    const chartButton = screen.getByText('Chart');
    fireEvent.click(chartButton);
    expect(mockSetSelectedChartView).toHaveBeenCalledWith('chartView');
  });

  it('calls setSelectedChartView with "tableView" when Table button is clicked', () => {
    render(
      <ChartTableHeader
        selectedChartView="chartView"
        setSelectedChartView={mockSetSelectedChartView}
        leftIcon={dummyLeftIcon}
        rightIcon={dummyRightIcon}
      />
    );

    const tableButton = screen.getByText('Table');
    fireEvent.click(tableButton);
    expect(mockSetSelectedChartView).toHaveBeenCalledWith('tableView');
  });
});
