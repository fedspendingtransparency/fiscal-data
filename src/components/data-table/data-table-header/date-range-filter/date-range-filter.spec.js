import { fireEvent, render } from '@testing-library/react';
import DateRangeFilter from './date-range-filter';
import React from 'react';

describe('date range filter', () => {
  Date.now = jest.fn(() => new Date('2023-01-02'));
  const mockColumn = { setFilterValue: jest.fn() };
  const mockTable = {};
  const mockSetFiltersActive = jest.fn();
  const mockResetFilters = jest.fn();
  const mockAllActiveFilters = [];
  const mockSetAllActiveFilters = jest.fn();

  it('renders the filter', () => {
    const { getByRole } = render(
      <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} setFiltersActive={mockSetFiltersActive} table={mockTable} />
    );
    const dateRangeButton = getByRole('button');
    expect(dateRangeButton).toBeInTheDocument();
  });

  it('renders today and clear buttons', () => {
    const { getByRole, getByText } = render(
      <DateRangeFilter
        column={mockColumn}
        resetFilters={mockResetFilters}
        setFiltersActive={mockSetFiltersActive}
        allActiveFilters={mockAllActiveFilters}
        setAllActiveFilters={mockSetAllActiveFilters}
      />
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const todayButton = getByRole('button', { name: 'Today' });
    todayButton.click();
    expect(getByText('2023 - 1', { exact: false })).toBeInTheDocument();
    const clearButton = getByRole('button', { name: 'Clear' });
    clearButton.click();
    dateRangeButton.click();
  });

  it('today and clear buttons keyboard accessibility', () => {
    const { getByRole, getByText } = render(
      <DateRangeFilter
        column={mockColumn}
        resetFilters={mockResetFilters}
        setFiltersActive={mockSetFiltersActive}
        allActiveFilters={mockAllActiveFilters}
        setAllActiveFilters={mockSetAllActiveFilters}
      />
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.keyDown(todayButton, { key: 'Enter' });
    expect(getByText('2023 - 1', { exact: false })).toBeInTheDocument();
    const clearButton = getByRole('button', { name: 'Clear' });
    fireEvent.keyDown(clearButton, { key: 'Enter' });
    dateRangeButton.click();
  });

  it('today and clear buttons keyboard accessibility', () => {
    const { getByRole, getByText } = render(
      <DateRangeFilter
        column={mockColumn}
        resetFilters={mockResetFilters}
        setFiltersActive={mockSetFiltersActive}
        allActiveFilters={mockAllActiveFilters}
        setAllActiveFilters={mockSetAllActiveFilters}
      />
    );
    const dateRangeButton = getByRole('button');
    fireEvent.keyDown(dateRangeButton, { key: 'Enter' });
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.keyDown(todayButton, { key: 'Enter' });
    expect(getByText('2023 - 1', { exact: false })).toBeInTheDocument();
    const clearButton = getByRole('button', { name: 'Clear' });
    fireEvent.keyDown(clearButton, { key: 'Enter' });
    dateRangeButton.click();
  });

  it('closes the dropdown on blur', () => {
    const { getByRole, queryByRole } = render(
      <DateRangeFilter
        column={mockColumn}
        resetFilters={mockResetFilters}
        setFiltersActive={mockSetFiltersActive}
        allActiveFilters={mockAllActiveFilters}
        setAllActiveFilters={mockSetAllActiveFilters}
      />
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const clearButton = getByRole('button', { name: 'Clear' });
    clearButton.focus();
    clearButton.blur();
    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('calls mouse handlers ', () => {
    const { getByRole, queryByTestId } = render(
      <DateRangeFilter
        column={mockColumn}
        resetFilters={mockResetFilters}
        setFiltersActive={mockSetFiltersActive}
        allActiveFilters={mockAllActiveFilters}
        setAllActiveFilters={mockSetAllActiveFilters}
      />
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const dropdown = queryByTestId('Date Picker Dropdown');
    fireEvent.mouseOver(dropdown);
    fireEvent.click(dropdown);
    expect(dropdown).toBeInTheDocument();
    fireEvent.mouseLeave(dropdown);
    dateRangeButton.click();
    expect(dropdown).not.toBeInTheDocument();
  });
});
