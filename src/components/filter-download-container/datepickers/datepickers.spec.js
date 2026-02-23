import React, { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import DatePickers from './datepickers';
import { subYears } from 'date-fns';
import userEvent from '@testing-library/user-event';

export const updateDatePicker = (datePickerGroup, stringEntry) => {
  fireEvent.change(datePickerGroup, { target: { value: stringEntry } });
  act(() => {
    jest.runAllTimers();
  });
};

export const compareValues = (datePickers, datesArr) => {
  expect(datePickers[0]).toHaveValue(datesArr[0]);
  expect(datePickers[1]).toHaveValue(datesArr[1]);
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
    from: '01/01/2016',
    to: '01/01/2021',
  };

  const dateStrArray = [selectedDateStrings.from, selectedDateStrings.to];

  const setSelectedDates = jest.fn();

  it('contains two instances of KeyboardDatePicker', () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox', { hidden: true });
    expect(datePickers.length).toEqual(2);
  });

  it('does not allow date entries outside of the min/max dates', () => {
    const { getAllByRole, getByText } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox', { hidden: true });

    updateDatePicker(datePickers[0], '01/01/2025');
    expect(getByText('Date should not be after maximal date')).toBeInTheDocument();

    updateDatePicker(datePickers[1], '01/01/1900');
    expect(getByText('Date should not be before minimal date')).toBeInTheDocument();
  });

  it(`sets the selected dates on the KeyboardDatePicker upon entry using the selectedDateRange params`, () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox', { hidden: true });
    compareValues(datePickers, dateStrArray);
  });

  it('updates the selected dates when triggered after the onChange event', async () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox', { hidden: true });

    updateDatePicker(datePickers[0], selectedDateStrings.from);
    updateDatePicker(datePickers[1], selectedDateStrings.to);

    compareValues(datePickers, dateStrArray);
  });

  it('swaps the dates if the From date is greater than the To date', async () => {
    const updatedFromDate = '01/02/2020';
    const updatedToDate = '01/02/2018';
    const { getAllByRole } = render(<DatePickers availableDateRange={availableDates} selectedDateRange={null} setSelectedDates={setSelectedDates} />);
    const datePickers = getAllByRole('textbox', { hidden: true });
    expect(datePickers).toHaveLength(2);
    updateDatePicker(datePickers[0], updatedFromDate);
    updateDatePicker(datePickers[1], updatedToDate);
    expect(datePickers[0]).toHaveValue(updatedToDate);
    expect(datePickers[1]).toHaveValue(updatedFromDate);
  });

  it('calls setSelectedDates when valid dates are selected by the date picker', () => {
    setSelectedDates.mockClear();
    const { getByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const chooseDateButton = getByRole('button', { name: 'Choose date, selected date is Jan 1, 2016' });
    userEvent.click(chooseDateButton);

    const newDateButton = getByRole('gridcell', { name: '11' });
    userEvent.click(newDateButton);

    expect(setSelectedDates).toHaveBeenCalledTimes(1);
  });

  it('creates KeyboardDatePicker with default settings if no/invalid params are passed in', () => {
    const { getAllByRole, rerender } = render(<DatePickers availableDateRange={null} selectedDateRange={null} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    let curDatePickers = getAllByRole('textbox', { hidden: true });

    expect(curDatePickers[0].value).toBeFalsy();
    rerender(<DatePickers availableDateRange={{}} selectedDateRange={{}} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    curDatePickers = getAllByRole('textbox', { hidden: true });
    expect(curDatePickers[0].value).toBeFalsy();
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
