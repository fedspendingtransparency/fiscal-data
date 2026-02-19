import React from 'react';
import { act, render, within } from '@testing-library/react';
import DatePickers from './datepickers';
import { subYears } from 'date-fns';
import userEvent from '@testing-library/user-event';

export const updateDatePicker = (datePicker, stringEntry) => {
  const clearFilter = '{backspace}{arrowright}{backspace}{arrowright}{backspace}{arrowleft}{arrowleft}';

  userEvent.click(datePicker);
  userEvent.keyboard(clearFilter);
  userEvent.keyboard(stringEntry);
  userEvent.keyboard('{Enter}');
  act(() => {
    jest.runAllTimers();
  });
};

export const compareValues = (datePickers, datesArr) => {
  datePickers.forEach((datePicker, index) => {
    const spinButtons = within(datePicker).getAllByRole('spinbutton');
    const selectedDate = datesArr[index];
    console.log('*********************', selectedDate, selectedDate.getMonth());
    expect(spinButtons[0]).toHaveValue(selectedDate.getMonth() + 1);
    expect(spinButtons[1]).toHaveValue(selectedDate.getDate());
    expect(spinButtons[2]).toHaveValue(selectedDate.getFullYear());
  });
};

jest.useFakeTimers();
describe('DDP Datepickers', () => {
  const latestDate = new Date(2021, 0, 1);

  const availableDates = {
    from: subYears(latestDate, 21),
    to: latestDate,
  };

  const selectedDates = {
    from: subYears(latestDate, 5),
    to: latestDate,
  };

  const selectedDateStrings = {
    from: '01/01/2021',
    to: '01/01/2016',
  };

  const setSelectedDates = jest.fn();

  it('contains two instances of KeyboardDatePicker', () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('group');
    expect(datePickers.length).toEqual(2);
  });

  it('does not allow date entries outside of the min/max dates', () => {
    const { getAllByRole, getByText } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('group');

    updateDatePicker(datePickers[0], '01/01/2025');
    expect(getByText('Date should not be after maximal date')).toBeInTheDocument();

    updateDatePicker(datePickers[1], '01/01/1900');
    expect(getByText('Date should not be before minimal date')).toBeInTheDocument();
  });

  it(`sets the selected dates on the KeyboardDatePicker upon entry using the selectedDateRange params`, () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const dates = [selectedDates.from, selectedDates.to];
    const datePickers = getAllByRole('group');
    compareValues(datePickers, dates);
  });

  it('updates the selected dates when triggered after the onChange event', async () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('group');

    updateDatePicker(datePickers[0], selectedDateStrings.from);
    updateDatePicker(datePickers[1], selectedDateStrings.to);

    act(() => {
      jest.runAllTimers();
    });

    const dates = [new Date(selectedDateStrings.from), new Date(selectedDateStrings.to)];
    compareValues(datePickers, dates);
  });

  it('swaps the dates if the From date is greater than the To date', async () => {
    const updatedFromDate = '01/02/2020';
    const updatedToDate = '01/02/2018';
    const dates = [new Date(updatedToDate), new Date(updatedFromDate)];
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('group');
    updateDatePicker(datePickers[0], updatedFromDate);
    act(() => {
      jest.runAllTimers();
    });
    updateDatePicker(datePickers[1], updatedToDate);

    act(() => {
      jest.runAllTimers();
    });

    compareValues(datePickers, dates);
  });

  it('calls setSelectedDates when valid dates are selected by the date picker', () => {
    setSelectedDates.mockClear();
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('group');
    updateDatePicker(datePickers[0], '1/1/2000');

    act(() => {
      jest.runAllTimers();
    });

    expect(setSelectedDates).toHaveBeenCalledTimes(1);
  });

  it('creates KeyboardDatePicker with default settings if no/invalid params are passed in', () => {
    const { getAllByRole, rerender } = render(<DatePickers availableDateRange={null} selectedDateRange={null} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    let curDatePickers = getAllByRole('group');

    curDatePickers.forEach(datePicker => {
      const spinButtons = within(datePicker).getAllByRole('spinbutton');
      expect(spinButtons[0]).toHaveValue(0);
      expect(spinButtons[1]).toHaveValue(0);
      expect(spinButtons[2]).toHaveValue(0);
    });
    rerender(<DatePickers availableDateRange={{}} selectedDateRange={{}} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    curDatePickers = getAllByRole('group');
    curDatePickers.forEach(datePicker => {
      const spinButtons = within(datePicker).getAllByRole('spinbutton');
      expect(spinButtons[0]).toHaveValue(0);
      expect(spinButtons[1]).toHaveValue(0);
      expect(spinButtons[2]).toHaveValue(0);
    });
  });

  // it('does not trigger the dateRangeFilter when either of the popups are open', () => {
  //   const { getAllByRole } = render(
  //     <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
  //   );
  //   const datePickers = getAllByRole('textbox');
  //   fireEvent.click(datePickers[0]);
  //   jest.runAllTimers();
  //   setSelectedDates.mockClear();
  //   act(() => {
  //     fireEvent.change(datePickers[0], { target: { value: dateRange.startDate } });
  //     fireEvent.change(datePickers[1], { target: { value: dateRange.endDate } });
  //   });
  //   jest.runAllTimers();
  //
  //   expect(setSelectedDates).not.toHaveBeenCalled();
  //   fireEvent.click(datePickers[0]);
  //   fireEvent.click(datePickers[1]);
  //   jest.runAllTimers();
  //
  //   expect(setSelectedDates).not.toHaveBeenCalled();
  //
  //   fireEvent.click(datePickers[1]);
  //
  //   jest.runAllTimers();
  //
  //   expect(setSelectedDates).toHaveBeenCalled();
  // });
});
