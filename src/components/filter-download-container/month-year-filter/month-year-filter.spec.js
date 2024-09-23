import MonthYearFilter from './month-year-filter';
import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Month year filter', () => {
  const mockSelectedTable = {
    earliestDate: new Date(2022, 8, 1),
    latestDate: new Date(2024, 8, 1),
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 8, 1));
  });

  it('renders a month and year dropdown filter button', () => {
    const { getByRole } = render(<MonthYearFilter setDateRange={jest.fn()} />);
    expect(getByRole('button', { name: 'September' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2024' })).toBeInTheDocument();
  });

  it('generates all years in the years dropdown', () => {
    const { getByRole, getByTestId } = render(<MonthYearFilter setDateRange={jest.fn()} selectedTable={mockSelectedTable} />);
    const yearButton = getByRole('button', { name: '2024' });
    userEvent.click(yearButton);
    const dropdownContainer = getByTestId('dropdown-container');
    expect(within(dropdownContainer).getByRole('button', { name: '2022' })).toBeInTheDocument();
    expect(within(dropdownContainer).getByRole('button', { name: '2023' })).toBeInTheDocument();
    expect(within(dropdownContainer).getByRole('button', { name: '2024' })).toBeInTheDocument();
    expect(within(dropdownContainer).queryByRole('button', { name: '2025' })).not.toBeInTheDocument();
    expect(within(dropdownContainer).queryByRole('button', { name: '2021' })).not.toBeInTheDocument();
  });

  it('updates month on select', () => {
    const { getByRole, queryByRole } = render(<MonthYearFilter setDateRange={jest.fn()} />);
    const monthButton = getByRole('button', { name: 'September' });
    userEvent.click(monthButton);
    const aprilButton = getByRole('button', { name: 'April' });
    userEvent.click(aprilButton);
    expect(queryByRole('button', { name: 'September' })).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'April' })).toBeInTheDocument();
  });

  it('updates year on select', () => {
    const { getByRole, queryByRole } = render(<MonthYearFilter setDateRange={jest.fn()} selectedTable={mockSelectedTable} />);
    const monthButton = getByRole('button', { name: '2024' });
    userEvent.click(monthButton);
    const updatedYearButton = getByRole('button', { name: '2022' });
    userEvent.click(updatedYearButton);
    expect(queryByRole('button', { name: '2024' })).not.toBeInTheDocument();
    expect(getByRole('button', { name: '2022' })).toBeInTheDocument();
  });
});
