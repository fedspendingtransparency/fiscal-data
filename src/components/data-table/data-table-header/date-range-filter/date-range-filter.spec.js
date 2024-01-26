import { fireEvent, render } from '@testing-library/react';
import DateRangeFilter from './date-range-filter';
import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';

const RecoilObserver = ({ node, onChange }) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

describe('date range filter', () => {
  Date.now = jest.fn(() => new Date('2023-01-02 12:00:00 GMT-0600'));
  const mockColumn = { id: 'testId', setFilterValue: jest.fn() };
  const mockTable = {};
  const mockSetFiltersActive = jest.fn();
  const mockResetFilters = jest.fn();
  const mockAllActiveFilters = [];
  const mockSetAllActiveFilters = jest.fn();
  const mockSetFilteredDateRange = jest.fn();

  it('renders the filter', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} setFiltersActive={mockSetFiltersActive} table={mockTable} />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    expect(dateRangeButton).toBeInTheDocument();
  });

  it('renders today and clear buttons', () => {
    const { getByRole, getAllByText } = render(
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const todayButton = getByRole('button', { name: 'Today' });
    todayButton.click();
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    const clearButton = getByRole('button', { name: 'Clear' });
    clearButton.click();
    dateRangeButton.click();
  });

  it('renders clear dates button inside date input field', () => {
    const { getByRole, getAllByText } = render(
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const todayButton = getByRole('button', { name: 'Today' });
    todayButton.click();
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    const inputClearButton = getByRole('button', { name: 'Clear dates' });
    inputClearButton.click();
    dateRangeButton.click();
  });

  it('today and clear buttons keyboard accessibility', () => {
    const { getByRole, getAllByText } = render(
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.keyDown(todayButton, { key: 'Enter' });
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    dateRangeButton.click();
    const clearButton = getByRole('button', { name: 'Clear' });
    fireEvent.keyDown(clearButton, { key: 'Enter' });
    dateRangeButton.click();
  });

  it('today and clear buttons keyboard accessibility', () => {
    const { getByRole, getAllByText } = render(
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    fireEvent.keyDown(dateRangeButton, { key: 'Enter' });
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.keyDown(todayButton, { key: 'Enter' });
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    fireEvent.keyDown(dateRangeButton, { key: 'Enter' });
    const clearButton = getByRole('button', { name: 'Clear' });
    fireEvent.keyDown(clearButton, { key: 'Enter' });
    dateRangeButton.click();
  });

  it('closes the dropdown on blur', () => {
    const { getByRole, queryByRole } = render(
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
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
      <RecoilRoot>
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
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
  it('adjusts dates entered based on keyboard entry, complete valid range', () => {
    const expectedValue = { from: '2022-12-01T06:00:00.000Z', to: '2024-12-10T06:00:00.000Z' };
    const { getByRole, getAllByText } = render(
      <RecoilRoot>
        <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
        <DateRangeFilter
          column={mockColumn}
          resetFilters={mockResetFilters}
          setFiltersActive={mockSetFiltersActive}
          allActiveFilters={mockAllActiveFilters}
          setAllActiveFilters={mockSetAllActiveFilters}
        />
      </RecoilRoot>
    );
    const dateRangeButton = getByRole('button');
    dateRangeButton.click();
    const dateRangeEntry = getAllByText('mm/dd/yyyy');
    dateRangeEntry[0].click();

    fireEvent.change(dateRangeEntry[0], { target: { value: '12/01/2022' } });
    fireEvent.change(dateRangeEntry[1], { target: { value: '12/10/2022' } });

    expect(mockSetFilteredDateRange).toHaveBeenCalledWith(expectedValue);
  });

  it('adjusts dates entered based on keyboard entry, complete valid start date', () => {
    // look for class on day picker dot
  });

  it('displays error message on invalid start date entry', () => {
    // 20/20/2020
  });

  it('displays error message on invalid end date entry', () => {
    // 1/2/2022 - 13/13/2020
  });
});
