import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InterestExpenseChartHeader from './interest-expense-chart-header';
import { interestExpenseChartHeaderContainer } from '../interest-expense-chart-header/interestExpense-chart-header.module.scss';
import '@testing-library/jest-dom';

const mockToggle = jest.fn();
jest.mock('../interest-expense-chart-toggle/interest-expense-chart-toggle', () => {
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

describe('InterestExpenseChartHeader Component', () => {
  const mockSetSelectedChartView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with correct container class and toggle props when selectedChartView is "chartView"', () => {
    const { container } = render(<InterestExpenseChartHeader selectedChartView="chartView" setSelectedChartView={mockSetSelectedChartView} />);

    const headerDiv = container.firstChild;
    expect(headerDiv).toHaveClass(interestExpenseChartHeaderContainer);

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
  });

  it('renders header with correct toggle props when selectedChartView is "tableView"', () => {
    render(<InterestExpenseChartHeader selectedChartView="tableView" setSelectedChartView={mockSetSelectedChartView} />);

    const propsPassed = mockToggle.mock.calls[0][0];
    expect(propsPassed.leftButtonConfig).toEqual({
      leftId: 'chartView',
      leftSelected: false,
    });
    expect(propsPassed.rightButtonConfig).toEqual({
      rightId: 'tableView',
      rightSelected: true,
    });
  });

  it('calls setSelectedChartView with "chartView" when Chart button is clicked', () => {
    render(<InterestExpenseChartHeader selectedChartView="tableView" setSelectedChartView={mockSetSelectedChartView} />);

    const chartButton = screen.getByText('Chart');
    fireEvent.click(chartButton);
    expect(mockSetSelectedChartView).toHaveBeenCalledWith('chartView');
  });

  it('calls setSelectedChartView with "tableView" when Table button is clicked', () => {
    render(<InterestExpenseChartHeader selectedChartView="chartView" setSelectedChartView={mockSetSelectedChartView} />);

    const tableButton = screen.getByText('Table');
    fireEvent.click(tableButton);
    expect(mockSetSelectedChartView).toHaveBeenCalledWith('tableView');
  });
});
