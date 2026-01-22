import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartTableToggle from './charting-table-toggle';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';

describe('ChartTableToggle', () => {
  const dummyToggleClickHandler = jest.fn();
  const dummyGAChartTableToggleEvent = jest.fn();
  const primaryColor = '#0071BC';
  const chartId = 'chart1';

  const defaultProps = {
    toggleClickHandler: dummyToggleClickHandler,
    gaChartTableToggleEvent: dummyGAChartTableToggleEvent,
    primaryColor,
    chartId,
    leftButtonConfig: {
      leftId: 'table',
      leftSelected: true,
    },
    rightButtonConfig: {
      rightId: 'chart',
      rightSelected: false,
    },
    leftIcon: faTable,
    rightIcon: faChartBar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders two buttons', () => {
    render(<ChartTableToggle {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders left button with the correct icon', () => {
    render(<ChartTableToggle {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const leftSvg = buttons[0].querySelector('svg');
    expect(leftSvg).toBeInTheDocument();
    expect(leftSvg).toHaveAttribute('data-icon', 'table');
  });

  it('renders right button with the correct icon', () => {
    render(<ChartTableToggle {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const rightSvg = buttons[1].querySelector('svg');
    expect(rightSvg).toBeInTheDocument();
    expect(rightSvg).toHaveAttribute('data-icon', 'chart-bar');
  });

  it('calls toggleClickHandler with leftButtonConfig.leftId when the left button is clicked', () => {
    render(<ChartTableToggle {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(dummyToggleClickHandler).toHaveBeenCalledWith('table');
  });

  it('calls toggleClickHandler with rightButtonConfig.rightId when the right button is clicked', () => {
    const props = {
      ...defaultProps,
      leftButtonConfig: { leftId: 'table', leftSelected: false },
      rightButtonConfig: { rightId: 'chart', rightSelected: true },
    };
    render(<ChartTableToggle {...props} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(dummyToggleClickHandler).toHaveBeenCalledWith('chart');
  });
});
