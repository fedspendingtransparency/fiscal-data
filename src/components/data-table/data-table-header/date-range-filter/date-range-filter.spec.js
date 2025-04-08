import { fireEvent, render, waitFor } from '@testing-library/react';
import DateRangeFilter from './date-range-filter';
import React, { act } from 'react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';

describe('date range filter', () => {
  Date.now = jest.fn(() => new Date('2023-01-02 12:00:00 GMT-0600'));
  const mockColumn = { id: 'testId', setFilterValue: jest.fn() };
  const mockTable = {};
  const mockSetFiltersActive = jest.fn();
  const mockResetFilters = jest.fn();
  const mockAllActiveFilters = [];
  const mockSetAllActiveFilters = jest.fn();

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
    fireEvent.click(dateRangeButton);
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.click(todayButton);
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    fireEvent.click(dateRangeButton);
    const clearButton = getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);
    fireEvent.click(dateRangeButton);
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
    fireEvent.click(dateRangeButton);
    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.click(todayButton);
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    const inputClearButton = getByRole('button', { name: 'Clear dates' });
    fireEvent.click(inputClearButton);
    fireEvent.click(dateRangeButton);
  });

  it('today and clear buttons keyboard accessibility', async () => {
    const { findByRole, getAllByText } = render(
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
    const dateRangeButton = await findByRole('button');
    userEvent.tab();
    userEvent.keyboard('{Enter}');
    const todayButton = await findByRole('button', { name: 'Today' });
    act(() => {
      todayButton.focus();
    });
    userEvent.keyboard('{Enter}');
    expect(getAllByText('1/02/2023', { exact: false })[0]).toBeInTheDocument();
    act(() => {
      dateRangeButton.focus();
    });
    userEvent.keyboard('{Enter}');
    const clearButton = await findByRole('button', { name: 'Clear' });
    act(() => {
      clearButton.focus();
    });
    userEvent.keyboard('{Enter}');
  });

  it('closes the dropdown on blur', async () => {
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
    fireEvent.click(dateRangeButton);
    const clearButton = getByRole('button', { name: 'Clear' });
    act(() => {
      clearButton.focus();
    });
    expect(clearButton).toHaveFocus();
    userEvent.tab();
    await waitFor(() => expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument());
  });

  it('calls mouse handlers ', async () => {
    const { getByRole, queryByTestId, getByTestId } = render(
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
    userEvent.click(dateRangeButton);
    const dropdown = getByTestId('Date Picker Dropdown');
    userEvent.click(dropdown);
    expect(dropdown).toBeInTheDocument();
    userEvent.unhover(dropdown);
    userEvent.click(dateRangeButton);
    await waitFor(() => expect(queryByTestId('Date Picker Dropdown')).not.toBeInTheDocument());
  });

  // it('adjusts dates entered based on keyboard entry, complete valid range', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
  //       <DateRangeFilter
  //         column={mockColumn}
  //         resetFilters={mockResetFilters}
  //         setFiltersActive={mockSetFiltersActive}
  //         allActiveFilters={mockAllActiveFilters}
  //         setAllActiveFilters={mockSetAllActiveFilters}
  //       />
  //     </RecoilRoot>
  //   );
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //   act(() => {
  //     userEvent.keyboard('12012022');
  //     userEvent.keyboard('12102024');
  //   });
  //   expect(mockSetFilteredDateRange).toHaveBeenCalled();
  // });
  //
  // it('renders x button when text is entered', () => {
  //   const { getByRole, queryByRole, getByText, queryByText } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
  //       <DateRangeFilter
  //         column={mockColumn}
  //         resetFilters={mockResetFilters}
  //         setFiltersActive={mockSetFiltersActive}
  //         allActiveFilters={mockAllActiveFilters}
  //         setAllActiveFilters={mockSetAllActiveFilters}
  //       />
  //     </RecoilRoot>
  //   );
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //   act(() => {
  //     userEvent.keyboard('11');
  //   });
  //   expect(getByText('11/dd/yyyy')).toBeInTheDocument();
  //   const clear = getByRole('button', { name: 'Clear dates' });
  //   fireEvent.click(clear);
  //   expect(queryByText('11/dd/yyyy')).not.toBeInTheDocument();
  //   expect(queryByRole('button', { name: 'Clear dates' })).not.toBeInTheDocument();
  // });
  //
  // it('displays error message on invalid date entry', () => {
  //   const { getByRole, getByText } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
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
  //   dateRangeButton.click();
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //   act(() => {
  //     userEvent.keyboard('12102024');
  //     userEvent.keyboard('12012022');
  //   });
  //   expect(getByText('Invalid date range. Please check the entered dates and try again')).toBeInTheDocument();
  // });
  //
  // it('highlights the in progress date entry', () => {
  //   const { getByRole, getByText } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
  //       <DateRangeFilter
  //         column={mockColumn}
  //         resetFilters={mockResetFilters}
  //         setFiltersActive={mockSetFiltersActive}
  //         allActiveFilters={mockAllActiveFilters}
  //         setAllActiveFilters={mockSetAllActiveFilters}
  //       />
  //     </RecoilRoot>
  //   );
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //
  //   //highlights in progress start date
  //   act(() => {
  //     userEvent.keyboard('1210');
  //   });
  //   const startDate = getByText('12/10/yyyy');
  //   expect(startDate).toBeInTheDocument();
  //   expect(startDate).toHaveClass('currentDate');
  //
  //   //moves highlight to end date when start date is complete
  //   act(() => {
  //     userEvent.keyboard('2024');
  //   });
  //   expect(getByText('12/10/2024')).toBeInTheDocument();
  //   expect(startDate).not.toHaveClass('currentDate');
  //
  //   const endDate = getByText('mm/dd/yyyy');
  //   expect(endDate).toBeInTheDocument();
  //   expect(endDate).toHaveClass('currentDate');
  // });
  // it('clear highlights for incomplete date entry', async () => {
  //   const { getByRole, getByText, queryByText } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
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
  //   dateRangeButton.click();
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //
  //   //highlights in progress start date
  //   await act(() => {
  //     userEvent.keyboard('12102024');
  //   });
  //
  //   await act(() => {
  //     userEvent.keyboard('1211');
  //   });
  //   const endDate = getByText('12/11/yyyy');
  //   expect(endDate).toBeInTheDocument();
  //   expect(endDate).toHaveClass('currentDate');
  //
  //   //close the calendar to clear highlighting
  //   dateRangeButton.click();
  //
  //   await waitFor(() => expect(queryByText('12/11/yyyy')).not.toBeInTheDocument());
  //   expect(endDate).not.toHaveClass('currentDate');
  // });
  //
  // it('displays the keyboard date entry in the calendar', () => {
  //   const { getByRole, getAllByText } = render(
  //     <RecoilRoot>
  //       <RecoilObserver node={reactTableFilteredDateRangeState} onChange={mockSetFilteredDateRange} />
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
  //   dateRangeButton.click();
  //
  //   const dateRangeEntry = getByRole('textbox', { hidden: true });
  //   dateRangeEntry.focus();
  //
  //   act(() => {
  //     userEvent.keyboard('12102023');
  //   });
  //   expect(getAllByText('December').length).toBe(2);
  //   expect(getAllByText('January').length).toBe(1);
  //
  //   act(() => {
  //     userEvent.keyboard('11102024');
  //   });
  //   dateRangeButton.click();
  //   expect(getAllByText('November').length).toBe(2);
  //   expect(getAllByText('2024').length).toBe(2);
  //   expect(getAllByText('December').length).toBe(1);
  //   expect(getAllByText('2023').length).toBe(1);
  // });
});
