import React from 'react';
import { render, within, act, fireEvent } from '@testing-library/react';
import MonthPicker from './month-picker';
import userEvent from '@testing-library/user-event';

describe('Month Picker', () => {
  it('Default button', () => {
    const { getByRole } = render(<MonthPicker />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(within(button).getByText('Published Date:')).toBeInTheDocument();
    expect(within(button).getByText('May 2023')).toBeInTheDocument();
  });

  it('Open date picker dropdown on click', () => {
    const { getByRole, getAllByRole } = render(<MonthPicker />);
    const button = getByRole('button');
    act(() => {
      fireEvent.click(button);
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
  });

  it('Opens date picker dropdown on enter key press', () => {
    const { getByRole, getAllByRole } = render(<MonthPicker />);
    const button = getByRole('button');
    act(() => {
      userEvent.tab();
      expect(button).toHaveFocus();
      userEvent.keyboard('Enter');
    });
    expect(getAllByRole('button').length).toBeGreaterThan(1);
  });
});
