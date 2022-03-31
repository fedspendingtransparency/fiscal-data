import React from 'react';
import PivotToggle from './pivot-toggle';
import { render, fireEvent } from "@testing-library/react"

describe('PivotToggle component', () => {
  let handlerTracker = null;
  const mockHandler = () => {
    handlerTracker = 'called';
  };

  it('displays a button with an icon and expected text when in closed state', () => {
    const { getByTestId } = render(<PivotToggle clickHandler={mockHandler} open={false} />);
    expect(getByTestId('bar-chart-icon')).toBeDefined();
    expect(getByTestId('toggleText').innerHTML).toContain('Show');
  });

  it('displays expected text when in open state', () => {
    const { getByTestId } = render(<PivotToggle clickHandler={mockHandler} open={true} />);
    expect(getByTestId('toggleText').innerHTML).toContain('Hide');
  });

  it('fires its click handler when clicked', () => {
    const { getByTestId } = render(<PivotToggle clickHandler={mockHandler} open={false} />);
    expect(handlerTracker).toBeNull();
    fireEvent.click(getByTestId('pivotToggle'));
    expect(handlerTracker).toEqual('called');
  });

});
