import React from 'react';
import DateRangeMonthPicker from './date-range-month-picker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('date range month picker', () => {
  it('renders the date range picker', () => {
    const { getByRole } = render(<DateRangeMonthPicker />);
    const dropdown = getByRole('button', { name: 'Start Date — End Date' });
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);

    const fromMonthPicker = getByRole('button', { name: 'From:' });
    const toMonthPicker = getByRole('button', { name: 'To:' });

    expect(fromMonthPicker).toBeInTheDocument();
    expect(toMonthPicker).toBeInTheDocument();
  });
});
