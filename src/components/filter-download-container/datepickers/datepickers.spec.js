import React from 'react';
import renderer from 'react-test-renderer';
import DatePickers from './datepickers';
import { subYears } from 'date-fns';
import {KeyboardDatePicker} from "@material-ui/pickers";
import {dateRange} from "../../datasets/filters/test-helpers";

jest.useFakeTimers();
describe('DDP Datepickers', () => {

  let component = renderer.create();
  let datePickers = [];
  let instance;

  const latestDate = new Date(2021, 0, 1);

  const availableDates = {
    from: subYears(latestDate, 21),
    to: latestDate
  };

  const selectedDates = {
    from: subYears(latestDate, 5),
    to: latestDate
  };

  const setSelectedDates = jest.fn();

  beforeAll(() => {
    component = renderer.create(
      <DatePickers
        availableDateRange={availableDates}
        selectedDateRange={selectedDates}
        setSelectedDates={setSelectedDates}
      />
    );
    instance = component.root;
    datePickers = instance.findAllByType(KeyboardDatePicker);
    jest.runAllTimers();
  });

  it('contains two instances of KeyboardDatePicker', () => {
    expect(datePickers.length).toEqual(2);
  });

  it('sets the min and max allowable dates on KeyboardDatePicker', () => {
    expect(datePickers[0].props.minDate).toEqual(availableDates.from);
    expect(datePickers[0].props.maxDate).toEqual(availableDates.to);
    expect(datePickers[1].props.minDate).toEqual(availableDates.from);
    expect(datePickers[1].props.maxDate).toEqual(availableDates.to);
  });

  it(`sets the selected dates on the KeyboardDatePicker upon entry using the selectedDateRange
    params`, () => {
    expect(datePickers[0].props.value).toEqual(selectedDates.from);
    expect(datePickers[1].props.value).toEqual(selectedDates.to);
  });

  it('updates the selected dates when triggered after the onChange event', async () => {
    const updatedFromDate = subYears(latestDate, 2);
    const updatedToDate = subYears(latestDate, 1);
    renderer.act(() => {
      datePickers[0].props.onChange(updatedFromDate);
      datePickers[1].props.onChange(updatedToDate);
    });
    jest.runAllTimers();

    expect(datePickers[0].props.value).toEqual(updatedFromDate);
    expect(datePickers[1].props.value).toEqual(updatedToDate);
  });

  it('swaps the dates if the From date is greater than the To date', () => {
    const updatedFromDate = subYears(latestDate, 1);
    const updatedToDate = subYears(latestDate, 3);
    renderer.act(() => {
      datePickers[0].props.onChange(updatedFromDate);
      datePickers[1].props.onChange(updatedToDate);
    });
    jest.runAllTimers();

    expect(datePickers[0].props.value).toEqual(updatedToDate);
    expect(datePickers[1].props.value).toEqual(updatedFromDate);
  });

  it(`updates the selected dates of the KeyboardDatePicker when a new range of maximal dates are
    passed (different table)`, () => {
    const newTableDates = {
      from: new Date(1800, 9, 15),
      to: new Date(2018, 3, 2)
    };
    renderer.act(() => {
      component.update(
        <DatePickers
          availableDateRange={newTableDates}
          selectedDateRange={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      );
    });
    jest.runAllTimers();

    // No need to check the min+max on both datepickers as this was done above.
    expect(datePickers[0].props.minDate).toEqual(newTableDates.from);
    expect(datePickers[1].props.maxDate).toEqual(newTableDates.to);
  });

  it('calls setSelectedDates when valid dates are selected by the date picker', () => {
    setSelectedDates.mockClear();

    renderer.act(() => {
      datePickers[0].props.onChange(new Date(2000,1,1))
    });
    jest.runAllTimers();

    expect(setSelectedDates).toHaveBeenCalledTimes(1);
  });

  it('creates KeyboardDatePicker with default settings if no/invalid params are passed in', () => {
    let curComponent = renderer.create(), curInstance, curDatePickers;
    renderer.act(() => {
      curComponent = renderer.create(
        <DatePickers
          availableDateRange={null}
          selectedDateRange={null}
          setSelectedDates={setSelectedDates}
        />
      );
    });
    curInstance = curComponent.root;
    jest.runAllTimers();
    curDatePickers = curInstance.findAllByType(KeyboardDatePicker);

    expect(curDatePickers[0].props.value).toEqual(null);
    expect(curDatePickers[0].props.minDate).toEqual(null);
    expect(curDatePickers[0].props.maxDate).toEqual(null);
    expect(curDatePickers[1].props.value).toEqual(null);
    expect(curDatePickers[1].props.minDate).toEqual(null);
    expect(curDatePickers[1].props.maxDate).toEqual(null);

    renderer.act(() => {
      curComponent = renderer.create(
        <DatePickers
          availableDateRange={{}}
          selectedDateRange={{}}
          setSelectedDates={setSelectedDates}
        />
      );
    });
    curInstance = curComponent.root;
    jest.runAllTimers();
    curDatePickers = curInstance.findAllByType(KeyboardDatePicker);

    expect(curDatePickers[0].props.value).toEqual(null);
    expect(curDatePickers[0].props.minDate).toEqual(null);
    expect(curDatePickers[0].props.maxDate).toEqual(null);
    expect(curDatePickers[1].props.value).toEqual(null);
    expect(curDatePickers[1].props.minDate).toEqual(null);
    expect(curDatePickers[1].props.maxDate).toEqual(null);
  });

  it('does not trigger the dateRangeFilter when either of the popups are open', () => {
    renderer.act(() => {
      datePickers[0].props.onOpen();
    });
    jest.runAllTimers();
    setSelectedDates.mockClear();
    renderer.act(() => {
      datePickers[0].props.onChange(dateRange.startDate);
      datePickers[1].props.onChange(dateRange.endDate);
    });
    jest.runAllTimers();

    expect(setSelectedDates).not.toHaveBeenCalled();

    renderer.act(() => {
      datePickers[0].props.onClose();
      datePickers[1].props.onOpen();
    });
    jest.runAllTimers();

    expect(setSelectedDates).not.toHaveBeenCalled();

    renderer.act(() => {
      datePickers[1].props.onClose();
    });
    jest.runAllTimers();

    expect(setSelectedDates).toHaveBeenCalled();
  });
});
