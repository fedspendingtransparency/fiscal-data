import React from 'react';
import MonthPicker from './month-picker';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('date range month picker', () => {
  it('renders the date range picker', () => {
    const { getByRole } = render(<MonthPicker text="From" />);
    const dropdown = getByRole('button', { name: 'From:' });
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);

    const monthDropdown = getByRole('button', { name: 'Month' });
    const yearDropdown = getByRole('button', { name: 'Year' });
    expect(monthDropdown).toBeInTheDocument();
    expect(yearDropdown).toBeInTheDocument();
  });

  it('renders available years in dropdown', () => {
    const { getByRole } = render(<MonthPicker text="From" allYears={['2020', '2021']} />);
    const dropdown = getByRole('button', { name: 'From:' });
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);

    const yearDropdown = getByRole('button', { name: 'Year' });
    fireEvent.click(yearDropdown);
    expect(getByRole('button', { name: '2020' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2021' })).toBeInTheDocument();
  });

  it('updates selected date on month and year click', () => {
    const setDateSpy = jest.fn();
    const { getByRole } = render(<MonthPicker text="From" allYears={['2020', '2021']} setSelectedDate={setDateSpy} />);
    const dropdown = getByRole('button', { name: 'From:' });
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    fireEvent.click(getByRole('button', { name: 'April' }));
    fireEvent.click(getByRole('button', { name: 'Year' }));
    fireEvent.click(getByRole('button', { name: '2020' }));
    expect(setDateSpy).toHaveBeenCalledWith('April 2020');
  });
});
