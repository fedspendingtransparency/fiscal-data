import MonthYearFilter from './month-year-filter';
import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Month year filter', () => {
  const mockSelectedTable = {
    earliestDate: new Date(2022, 8, 1),
    latestDate: new Date(2024, 8, 1),
  };

  const mockFutureDatedTable = {
    apiFilter: {
      futureDated: true,
    },
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 8, 1));
  });

  it('renders a month and year dropdown filter button', () => {
    const { getByRole } = render(<MonthYearFilter setDateRange={jest.fn()} />);
    expect(getByRole('button', { name: 'Month' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Year' })).toBeInTheDocument();
  });

  it('generates all years in the years dropdown', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole, getByTestId } = render(<MonthYearFilter setDateRange={jest.fn()} selectedTable={mockSelectedTable} />);
    const yearButton = getByRole('button', { name: 'Year' });
    await user.click(yearButton);
    const dropdownContainer = getByTestId('dropdown-container');
    expect(within(dropdownContainer).getByRole('button', { name: '2022' })).toBeInTheDocument();
    expect(within(dropdownContainer).getByRole('button', { name: '2023' })).toBeInTheDocument();
    expect(within(dropdownContainer).getByRole('button', { name: '2024' })).toBeInTheDocument();
    expect(within(dropdownContainer).queryByRole('button', { name: '2025' })).not.toBeInTheDocument();
    expect(within(dropdownContainer).queryByRole('button', { name: '2021' })).not.toBeInTheDocument();
  });

  it('updates month on select', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(<MonthYearFilter setDateRange={jest.fn()} />);
    let monthButton = getByRole('button', { name: 'Month' });
    expect(monthButton).toContainHTML('September');
    await user.click(monthButton);
    const aprilButton = getByRole('button', { name: 'April' });
    await user.click(aprilButton);
    monthButton = getByRole('button', { name: 'Month' });
    expect(monthButton).toContainHTML('April');
  });

  it('updates year on select', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(<MonthYearFilter setDateRange={jest.fn()} selectedTable={mockSelectedTable} />);
    let yearButton = getByRole('button', { name: 'Year' });
    expect(yearButton).toContainHTML('2024');
    await user.click(yearButton);
    const updatedYearButton = getByRole('button', { name: '2022' });
    await user.click(updatedYearButton);
    yearButton = getByRole('button', { name: 'Year' });
    expect(yearButton).toContainHTML('2022');
  });

  it('updates month on select with future dated value', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(<MonthYearFilter setDateRange={jest.fn()} selectedTable={mockFutureDatedTable} />);
    let monthButton = getByRole('button', { name: 'Month' });
    expect(monthButton).toContainHTML('September');
    await user.click(monthButton);
    const decemberButton = getByRole('button', { name: 'December' });
    await user.click(decemberButton);
    monthButton = getByRole('button', { name: 'Month' });
    expect(monthButton).toContainHTML('December');
    await user.click(monthButton);
    const augustButton = getByRole('button', { name: 'August' });
    await user.click(augustButton);
    expect(monthButton).toContainHTML('August');
  });
});
