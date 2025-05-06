import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import DatePickers from './datepickers';
import { subYears } from 'date-fns';
import { formatDate } from '../../download-wrapper/helpers';
import userEvent from '@testing-library/user-event';
import { dateRange } from '../../datasets/filters/test-helpers';

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

  const setSelectedDates = jest.fn();

  const updateDatePicker = (datePicker, stringEntry) => {
    userEvent.click(datePicker);
    userEvent.keyboard(stringEntry);
    userEvent.keyboard('{Enter}');
  };

  it('contains two instances of KeyboardDatePicker', () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');
    expect(datePickers.length).toEqual(2);
  });

  // it('sets the min and max allowable dates on KeyboardDatePicker', () => {
  //   const { getAllByRole } = render(
  //     <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
  //   );
  //   const datePickers = getAllByRole('textbox');
  //   expect(datePickers[0]).toHaveAttribute('minDate', availableDates.from);
  //   expect(datePickers[0]).toHaveAttribute('maxDate', availableDates.to);
  //   expect(datePickers[1]).toHaveAttribute('minDate', availableDates.from);
  //   expect(datePickers[1]).toHaveAttribute('maxDate', availableDates.to);
  // });

  it(`sets the selected dates on the KeyboardDatePicker upon entry using the selectedDateRange
    params`, () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');
    expect(datePickers[0]).toHaveValue(formatDate(selectedDates.from));
    expect(datePickers[1]).toHaveValue(formatDate(selectedDates.to));
  });

  it('updates the selected dates when triggered after the onChange event', async () => {
    const updatedFromDate = subYears(latestDate, 2).toString();
    const updatedToDate = subYears(latestDate, 1).toString();
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');

    updateDatePicker(datePickers[0], updatedFromDate);
    updateDatePicker(datePickers[1], updatedToDate);

    act(() => {
      jest.runAllTimers();
    });

    expect(datePickers[0]).toHaveValue(formatDate(selectedDates.from));
    expect(datePickers[1]).toHaveValue(formatDate(selectedDates.to));
  });

  it('swaps the dates if the From date is greater than the To date', async () => {
    const updatedFromDate = subYears(latestDate, 1);
    const updatedToDate = subYears(latestDate, 3);
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');
    act(() => {
      fireEvent.change(datePickers[0], { target: { value: formatDate(updatedFromDate) } });
      jest.runAllTimers();
    });

    act(() => {
      fireEvent.change(datePickers[1], { target: { value: formatDate(updatedToDate) } });
      jest.runAllTimers();
    });

    expect(datePickers[0]).toHaveValue(formatDate(updatedToDate));
    expect(datePickers[1]).toHaveValue(formatDate(updatedFromDate));
  });

  it(`updates the selected dates of the KeyboardDatePicker when a new range of maximal dates are
    passed (different table)`, () => {
    const newTableDates = {
      from: new Date(1800, 9, 15),
      to: new Date(2018, 3, 2),
    };
    const { getAllByRole, rerender } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    rerender(<DatePickers availableDateRange={newTableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />);
    const datePickers = getAllByRole('textbox');

    jest.runAllTimers();

    // No need to check the min+max on both datepickers as this was done above.
    expect(datePickers[0].props.minDate).toEqual(newTableDates.from);
    expect(datePickers[1].props.maxDate).toEqual(newTableDates.to);
  });

  it('calls setSelectedDates when valid dates are selected by the date picker', () => {
    setSelectedDates.mockClear();
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');
    act(() => {
      fireEvent.change(datePickers[0], { target: { value: formatDate(new Date(2000, 1, 1)) } });
    });
    jest.runAllTimers();

    expect(setSelectedDates).toHaveBeenCalledTimes(1);
  });

  it('creates KeyboardDatePicker with default settings if no/invalid params are passed in', () => {
    const { getAllByRole, rerender } = render(<DatePickers availableDateRange={null} selectedDateRange={null} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    let curDatePickers = getAllByRole('textbox');
    expect(curDatePickers[0]).toHaveValue('');
    expect(curDatePickers[1]).toHaveValue('');

    rerender(<DatePickers availableDateRange={{}} selectedDateRange={{}} setSelectedDates={setSelectedDates} />);
    jest.runAllTimers();
    curDatePickers = getAllByRole('textbox');
    expect(curDatePickers[0]).toHaveValue('');
    expect(curDatePickers[1]).toHaveValue('');
  });

  it('does not trigger the dateRangeFilter when either of the popups are open', () => {
    const { getAllByRole } = render(
      <DatePickers availableDateRange={availableDates} selectedDateRange={selectedDates} setSelectedDates={setSelectedDates} />
    );
    const datePickers = getAllByRole('textbox');
    fireEvent.click(datePickers[0]);
    jest.runAllTimers();
    setSelectedDates.mockClear();
    act(() => {
      fireEvent.change(datePickers[0], { target: { value: dateRange.startDate } });
      fireEvent.change(datePickers[1], { target: { value: dateRange.endDate } });
    });
    jest.runAllTimers();

    expect(setSelectedDates).not.toHaveBeenCalled();
    fireEvent.click(datePickers[0]);
    fireEvent.click(datePickers[1]);
    jest.runAllTimers();

    expect(setSelectedDates).not.toHaveBeenCalled();

    fireEvent.click(datePickers[1]);

    jest.runAllTimers();

    expect(setSelectedDates).toHaveBeenCalled();
  });
});
