import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import RangePresets from './range-presets';
import { monthNames } from '../../../utils/api-utils';
import Analytics from '../../../utils/analytics/analytics';
import { testReformatter } from './helpers/test-helper';
import { addDays, subQuarters } from 'date-fns';
import userEvent from '@testing-library/user-event';
import { formatDate } from '../../download-wrapper/helpers';
import { compareValues, updateDatePicker } from '../datepickers/datepickers.spec';

jest.useFakeTimers();

describe('Range Presets Component, without the current report radio option', () => {
  const selectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A' }],
  };

  const setDateRangeMock = jest.fn();
  const setIsFilteredMock = jest.fn();
  const setIsCustomDateRangeMock = jest.fn();

  it(`displays an h3 element that reads "Date Range:" and includes the correct label from the
    selectedTable object`, () => {
    const { getByRole, getByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const header = getByRole('heading', { level: 3 });
    const label = getByTestId('label');
    expect(within(header).getByText('Date Range', { exact: false })).toBeInTheDocument();
    expect(within(label).getByText(`(${selectedTable.fields[0].prettyName})`, { exact: false })).toBeInTheDocument();
  });

  it('contains a preset radio button for All which sets is filtered to true', async () => {
    const { getByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const radioBtn = getByTestId('preset-radio-all');
    userEvent.click(radioBtn);
    expect(setIsFilteredMock).toHaveBeenCalledWith(true);
  });

  it('does not contain a preset radio button for the latest report by default', () => {
    const { queryByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    expect(queryByTestId('preset-radio-current')).toBeFalsy();
  });

  it('defaults the "5 Years" date Range preset button on first load', () => {
    const { getByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const radioBtn = getByTestId('preset-radio-5yr');
    expect(radioBtn).toBeChecked();
  });

  it(`persists the selected year option when changing tables and if the new table has that option
    available`, () => {
    // Select the 1 Year option
    const { getByTestId, rerender } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const radioBtn = getByTestId('preset-radio-1yr');
    userEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();

    const newTable = {
      earliestDate: '2012-01-02',
      latestDate: '2020-01-02',
      dateField: 'column B',
      fields: [{ columnName: 'column B', prettyName: 'Column B' }],
    };
    setDateRangeMock.mockClear();
    rerender(
      <RangePresets
        selectedTable={newTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );

    jest.runAllTimers();

    // The 1 year option is still available
    expect(radioBtn).toBeChecked();
  });

  it(`selects the default "5 year" option when changing tables if the previously selected date
    range is not available for the current data table`, () => {
    const { getByTestId, rerender, queryByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    let radioBtn = getByTestId('preset-radio-10yr');
    userEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();
    const newTable = {
      earliestDate: '2012-01-02',
      latestDate: '2020-01-02',
      dateField: 'column B',
      fields: [{ columnName: 'column B', prettyName: 'Column B' }],
    };
    rerender(
      <RangePresets
        selectedTable={newTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    jest.runAllTimers();
    radioBtn = queryByTestId('preset-radio-10yr');
    expect(radioBtn).not.toBeInTheDocument();
    expect(getByTestId('preset-radio-5yr')).toBeChecked();
  });

  it('initially selects the "1 Year" option when date range is > 1 year and < 5 years', () => {
    const mockTable = Object.assign({}, selectedTable, { earliestDate: '2017-01-01' });

    const { getByRole, queryByRole } = render(
      <RangePresets
        selectedTable={mockTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={true}
      />
    );
    jest.runAllTimers();

    let radioBtn = getByRole('radio', { name: '1 Year' });
    expect(radioBtn).toBeChecked();

    // 5 year button will not exist
    radioBtn = queryByRole('radio', { name: '5 Years' });
    expect(radioBtn).not.toBeInTheDocument();

    // 10 year button will also not exist
    radioBtn = queryByRole('radio', { name: '10 Years' });
    expect(radioBtn).not.toBeInTheDocument();
  });

  it('initially selects the current date option when datePreset is set to "current', () => {
    const mockTable = Object.assign({}, selectedTable, { earliestDate: '2017-01-01' });

    const { getByRole, queryByRole } = render(
      <RangePresets
        selectedTable={mockTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={true}
        datePreset={'current'}
      />
    );
    jest.runAllTimers();

    let radioBtn = getByRole('radio', { name: 'Jan 2020' });
    expect(radioBtn).toBeChecked();

    // 1 year button will exist, but will not be checked
    radioBtn = getByRole('radio', { name: '1 Year' });
    expect(radioBtn).not.toBeChecked();

    // 5 year button will not exist
    radioBtn = queryByRole('radio', { name: '5 Years' });
    expect(radioBtn).not.toBeInTheDocument();

    // 10 year button will also not exist
    radioBtn = queryByRole('radio', { name: '10 Years' });
    expect(radioBtn).not.toBeInTheDocument();
  });

  it('initially selects custom most recent quarter when set in customRangePreset', () => {
    const { getByTestId, getAllByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        datasetDateRange={{
          earliestDate: selectedTable.earliestDate,
          latestDate: selectedTable.latestDate,
        }}
        datePreset="custom"
        customRangePreset="latestQuarter"
      />
    );
    jest.runAllTimers();

    const dateObj = new Date(Date.parse(selectedTable.latestDate));
    const quarterDatesMock = {
      from: subQuarters(addDays(dateObj, 1), 1),
      to: dateObj,
    };

    const customRangeButton = getByTestId('preset-radio-custom');
    expect(customRangeButton).toBeChecked();

    const datePickers = getAllByRole('textbox');
    expect(datePickers.length).toBeGreaterThan(0);

    expect(datePickers[0]).toHaveValue(formatDate(quarterDatesMock.from));
    expect(datePickers[1]).toHaveValue(formatDate(quarterDatesMock.to));
  });

  it('provides a custom date range button', () => {
    const { getByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const customRangeButton = getByTestId('preset-radio-custom');
    expect(customRangeButton).toBeInTheDocument();
  });

  it('only shows the date pickers when the custom date range button is selected', () => {
    const { queryAllByRole, getByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    let datePickers = queryAllByRole('textbox');
    expect(datePickers.length).toBe(0);

    const customRangeButton = getByTestId('preset-radio-custom');
    userEvent.click(customRangeButton);
    jest.runAllTimers();
    datePickers = queryAllByRole('textbox');
    expect(datePickers.length).toBeGreaterThan(0);
  });

  it('passes in expected parameters to DatePickers', async () => {
    const { getAllByRole, getByTestId, getByText } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    const customRangeButton = getByTestId('preset-radio-custom');
    userEvent.click(customRangeButton);

    jest.runAllTimers();

    const [from, to] = getAllByRole('group');
    //Displays error message for out of range dates
    updateDatePicker(from, '01/01/2001');
    expect(getByText('Date should not be before minimal date')).toBeInTheDocument();

    updateDatePicker(from, '01/01/2025');
    expect(getByText('Date should not be after maximal date')).toBeInTheDocument();

    // setDateRangeMock.mockClear();

    updateDatePicker(from, '01/01/2005');
    // setDateRangeMock.mockClear();
    // updateDatePicker(to, '01/01/2019');
    compareValues([from, to], [new Date('01/01/2005'), new Date('01/01/2019')]);
  });

  it(`fits a currently selected custom date to a newly selected table's available date range as needed`, () => {
    const mockFarLateTable = { earliestDate: '2021-01-01', latestDate: '2022-01-01' };
    const mockLateTable = { earliestDate: '2010-01-01', latestDate: '2021-06-01' };
    const mockFarEarlyTable = { earliestDate: '1995-01-01', latestDate: '1999-01-01' };
    const mockEarlyTable = { earliestDate: '1998-01-01', latestDate: '2011-01-01' };
    const mockInteriorTable = { earliestDate: '2005-01-01', latestDate: '2015-01-01' };
    const rangeSelected = {
      from: new Date(2004, 0, 1),
      to: new Date(2020, 0, 1),
      earliestDate: '2002-01-01',
      latestDate: '2020-01-01',
      min: '2002-01-01',
      selectionPath: '5_years',
    };
    const rangeSelectedStr = { from: '01/01/2004', to: '01/01/2020' };
    const { getAllByRole, getByTestId, rerender } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );

    const radioBtn = getByTestId('preset-radio-custom');
    userEvent.click(radioBtn);

    const datePickers = getAllByRole('textbox');
    setDateRangeMock.mockClear();

    updateDatePicker(datePickers[0], rangeSelectedStr.from);
    updateDatePicker(datePickers[1], rangeSelectedStr.to);

    expect(setDateRangeMock).toHaveBeenCalledWith(rangeSelected);

    // Change to a table whose range is later with no dates overlapping current custom dateRange
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={mockFarLateTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2021-01-01 - 2021-01-01');

    // Change to a table whose range is later but overlaps custom range
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={mockLateTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);

    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2010-01-01 - 2020-01-01');

    // Early without overlap
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={mockFarEarlyTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('1999-01-01 - 1999-01-01');

    // Overlapping early
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={mockEarlyTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);

    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2004-01-01 - 2011-01-01');

    // Inset on both ends
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={mockInteriorTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2005-01-01 - 2015-01-01');

    // Overlapping both ends
    setDateRangeMock.mockClear();
    rerender(<RangePresets selectedTable={selectedTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2004-01-01 - 2020-01-01');
  });

  it('expands the range of available dates when allTablesSelected is set to true', () => {
    const mockTableRange = { earliestDate: '2005-01-01', latestDate: '2015-01-01' };

    const { getByTestId, rerender } = render(
      <RangePresets
        selectedTable={mockTableRange}
        allTablesSelected={false}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
        setIsCustomDateRange={jest.fn}
      />
    );

    setDateRangeMock.mockClear();

    const radioBtn = getByTestId('preset-radio-all');
    userEvent.click(radioBtn);

    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('2005-01-01 - 2015-01-01');

    setDateRangeMock.mockClear();
    rerender(
      <RangePresets
        selectedTable={mockTableRange}
        allTablesSelected={true}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
        setIsCustomDateRange={jest.fn}
      />
    );

    expect(testReformatter(setDateRangeMock.mock.calls[0][0])).toEqual('1998-01-01 - 2021-06-01');
  });
});
describe('Current report button available', () => {
  const selectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A' }],
  };

  const dateRange = {
    from: new Date('01/01/2002'),
    to: new Date('01/01/2020'),
    min: new Date('01/31/2002'),
  };
  const setDateRangeMock = jest.fn();
  const setIsFilteredMock = jest.fn();
  const setIsCustomDateRangeMock = jest.fn();

  it('updates the selected radio button when pressed', async () => {
    const { getByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={'byMonth'}
      />
    );
    // 1 year
    let radioBtn = getByRole('radio', { name: '1 Year' });
    fireEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();

    // 5 years
    radioBtn = getByRole('radio', { name: '5 Years' });
    fireEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();

    // 10 years
    radioBtn = getByRole('radio', { name: '10 Years' });
    fireEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();

    // current report
    radioBtn = getByRole('radio', { name: 'Jan 2020' });
    fireEvent.click(radioBtn);
    expect(radioBtn).toBeChecked();

    // The default of '5yr' happens naturally at load
    expect(setDateRangeMock).toHaveBeenCalledTimes(5);
  });

  it(`when requested, contains a preset radio button for the latest report date labeled by
    the three-letter month and four-digit year`, async () => {
    const { getByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={'byMonth'}
      />
    );
    const month = dateRange.to.getMonth();
    const fullYear = dateRange.to.getFullYear();
    const expectedLabel = `${monthNames[month]} ${fullYear.toString()}`;
    const radioLabel = getByRole('radio', { name: expectedLabel });
    expect(radioLabel).toBeInTheDocument();
  });

  it(`adds a preset radio button for the latest report date labeled "Mmm d, YYYY" when
    currentDateButton is "byDay"`, async () => {
    const { getByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={'byDay'}
      />
    );
    jest.runAllTimers();
    const expectedLabel = 'Jan 1, 2020';
    const radioBtn = getByRole('radio', { name: expectedLabel });
    expect(radioBtn).toBeInTheDocument();
  });

  it(`adds a preset radio button for the latest report date labeled "Last 30 Days" when
    currentDateButton is "byLast30Days"`, async () => {
    const { getByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={'byLast30Days'}
      />
    );
    jest.runAllTimers();
    const expectedLabel = 'Last 30 Days';
    const radioBtn = getByRole('radio', { name: expectedLabel });
    expect(radioBtn).toBeInTheDocument();
  });

  it('initiates Analytics.event with correct parameters for all buttons', async () => {
    const { getByRole } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byLast30Days"
      />
    );
    const radioBtn = getByRole('radio', { name: 'All' });
    const spy = jest.spyOn(Analytics, 'event');
    fireEvent.click(radioBtn);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ label: 'All' }));
  });
});

describe('Range Presets Component - datatable banner', () => {
  const selectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A' }],
  };

  const setDateRangeMock = jest.fn();
  const setIsFilteredMock = jest.fn();
  const setIsCustomDateRangeMock = jest.fn();

  it(`does not render the datatable banner when no datatableBanner is passed in`, () => {
    const { queryByTestId } = render(
      <RangePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
      />
    );
    expect(queryByTestId('datatable-banner')).not.toBeInTheDocument();
  });
});
