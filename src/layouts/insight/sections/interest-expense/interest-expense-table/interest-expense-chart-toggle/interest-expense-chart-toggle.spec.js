import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InterestExpenseChartToggle from './interest-expense-chart-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom';

describe('InterestExpenseChartToggle Component', () => {
  const primaryColor = '#0000ff';
  const chartId = 'chart-1';

  const leftButtonConfigSelected = { leftId: 'left', leftSelected: true };
  const rightButtonConfigNotSelected = { rightId: 'right', rightSelected: false };
  const toggleClickHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders two buttons with proper id and FontAwesome icons', () => {
    render(
      <InterestExpenseChartToggle
        toggleClickHandler={toggleClickHandler}
        primaryColor={primaryColor}
        chartId={chartId}
        leftButtonConfig={leftButtonConfigSelected}
        rightButtonConfig={rightButtonConfigNotSelected}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    buttons.forEach(button => {
      expect(button).toHaveAttribute('id', chartId);
    });

    const firstSvg = buttons[0].querySelector('svg');
    expect(firstSvg).toBeInTheDocument();
    expect(firstSvg).toHaveAttribute('data-icon', faChartColumn.iconName);

    const secondSvg = buttons[1].querySelector('svg');
    expect(secondSvg).toBeInTheDocument();
    expect(secondSvg).toHaveAttribute('data-icon', faTable.iconName);
  });

  it('applies correct styles and class for left button when selected', () => {
    render(
      <InterestExpenseChartToggle
        toggleClickHandler={toggleClickHandler}
        primaryColor={primaryColor}
        chartId={chartId}
        leftButtonConfig={leftButtonConfigSelected}
        rightButtonConfig={rightButtonConfigNotSelected}
      />
    );

    const buttons = screen.getAllByRole('button');
    const leftButton = buttons[0];
    expect(leftButton).toHaveStyle(`background: ${primaryColor}`);
    expect(leftButton).toHaveStyle('color: #FFF');
    expect(leftButton).toHaveStyle(`borderColor: ${primaryColor}`);
    expect(leftButton.className).toMatch(/selected/);

    const rightButton = buttons[1];
    expect(rightButton).toHaveStyle('background: #FFF');
    expect(rightButton).toHaveStyle(`color: ${primaryColor}`);
    expect(rightButton).toHaveStyle(`borderColor: ${primaryColor}`);
    expect(rightButton.className).not.toMatch(/selected/);
  });

  it('applies correct styles and class for right button when selected', () => {
    const leftButtonConfigNotSelected = { leftId: 'left', leftSelected: false };
    const rightButtonConfigSelected = { rightId: 'right', rightSelected: true };

    render(
      <InterestExpenseChartToggle
        toggleClickHandler={toggleClickHandler}
        primaryColor={primaryColor}
        chartId={chartId}
        leftButtonConfig={leftButtonConfigNotSelected}
        rightButtonConfig={rightButtonConfigSelected}
      />
    );

    const buttons = screen.getAllByRole('button');
    const leftButton = buttons[0];
    expect(leftButton).toHaveStyle('background: #FFF');
    expect(leftButton).toHaveStyle(`color: ${primaryColor}`);
    expect(leftButton).toHaveStyle(`borderColor: ${primaryColor}`);
    expect(leftButton.className).not.toMatch(/selected/);

    const rightButton = buttons[1];
    expect(rightButton).toHaveStyle(`background: ${primaryColor}`);
    expect(rightButton).toHaveStyle('color: #FFF');
    expect(rightButton).toHaveStyle(`borderColor: ${primaryColor}`);
    expect(rightButton.className).toMatch(/selected/);
  });

  it('calls toggleClickHandler with correct id when buttons are clicked', () => {
    render(
      <InterestExpenseChartToggle
        toggleClickHandler={toggleClickHandler}
        primaryColor={primaryColor}
        chartId={chartId}
        leftButtonConfig={leftButtonConfigSelected}
        rightButtonConfig={rightButtonConfigNotSelected}
      />
    );

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    expect(toggleClickHandler).toHaveBeenCalledWith(leftButtonConfigSelected.leftId);

    fireEvent.click(buttons[1]);
    expect(toggleClickHandler).toHaveBeenCalledWith(rightButtonConfigNotSelected.rightId);
  });
});
