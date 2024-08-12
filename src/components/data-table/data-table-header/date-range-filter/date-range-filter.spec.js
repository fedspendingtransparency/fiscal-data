import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DateRangeFilter from './date-range-filter';
import React from 'react';
import { RecoilRoot } from 'recoil';

describe('DateRangeFilter Component', () => {
  const mockColumn = { id: 'testId', setFilterValue: jest.fn() };
  const mockSetAllActiveFilters = jest.fn();
  const mockResetFilters = jest.fn();
  const mockAllActiveFilters = [];
  const mockSetFiltersActive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the date range filter component', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const dateInput = screen.getByPlaceholderText('Start');
    expect(dateInput).toBeInTheDocument();
  });

  it('opens the date picker dropdown on focus', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const dateInput = screen.getByPlaceholderText('Start');
    fireEvent.focus(dateInput);

    expect(screen.getByTestId('Date Picker Dropdown')).toBeInTheDocument();
  });

  it('handles date input changes and validates the date format', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const dateInput = screen.getByPlaceholderText('Start');
    fireEvent.change(dateInput, { target: { value: '2023-08-10' } });

    expect(dateInput.value).toBe('2023-08-10');
  });

  it('clears the selected dates when clear button is clicked', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const dateInput = screen.getByPlaceholderText('Start');
    fireEvent.change(dateInput, { target: { value: '2023-08-10' } });

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);

    expect(dateInput.value).toBe('');
  });

  it('sets the correct filter value when a valid date range is selected', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const startInput = screen.getByPlaceholderText('Start');
    fireEvent.change(startInput, { target: { value: '2023-08-10' } });

    const endInput = screen.getByPlaceholderText('End');
    fireEvent.change(endInput, { target: { value: '2023-08-15' } });

    expect(mockColumn.setFilterValue).toHaveBeenCalledWith(['2023-08-10', '2023-08-11', '2023-08-12', '2023-08-13', '2023-08-14', '2023-08-15']);
  });

  it('closes the dropdown on blur if the click is outside the dropdown', () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const dateInput = screen.getByPlaceholderText('Start');
    fireEvent.focus(dateInput);
    const dropdown = screen.getByTestId('Date Picker Dropdown');
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByTestId('Date Picker Dropdown')).not.toBeInTheDocument();
  });

  it('removes the filter when the date range is cleared', async () => {
    render(
      <RecoilRoot>
        <DateRangeFilter column={mockColumn} resetFilters={mockResetFilters} allActiveFilters={[]} setAllActiveFilters={mockSetAllActiveFilters} />
      </RecoilRoot>
    );

    const startInput = screen.getByPlaceholderText('Start');
    fireEvent.change(startInput, { target: { value: '2023-08-10' } });

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockColumn.setFilterValue).toHaveBeenCalledWith([]);
      expect(mockSetAllActiveFilters).toHaveBeenCalledWith([]);
      expect(startInput.value).toBe(['']);
      expect(screen.getByPlaceholderText('End').value).toBe('');
    });
  });

  // it('renders today and clear buttons', () => {
  //   const { getByRole, getAllByText } = render(
  //     <RecoilRoot>
  //       <DateRangeFilter
  //         column={mockColumn}
  //         resetFilters={mockResetFilters}
  //         setFiltersActive={mockSetFiltersActive}
  //         allActiveFilters={mockAllActiveFilters}
  //         setAllActiveFilters={mockSetAllActiveFilters}
  //       />
  //     </RecoilRoot>
  //   );
  //   const dateRangeButton = getByRole('button');
  //   fireEvent.click(dateRangeButton);
  //   const todayButton = getByRole('button', { name: 'Today' });
  //   fireEvent.click(todayButton);
  //   expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
  //   fireEvent.click(dateRangeButton);
  //   const clearButton = getByRole('button', { name: 'Clear' });
  //   fireEvent.click(clearButton);
  //   fireEvent.click(dateRangeButton);
  // });
});
