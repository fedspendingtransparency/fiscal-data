import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import RangePresets from './range-presets';
import { monthNames } from '../../../utils/api-utils';
import Analytics from '../../../utils/analytics/analytics';
import DatePickers from '../datepickers/datepickers';
import { testReformatter } from './helpers/test-helper';
import { addDays, subQuarters } from 'date-fns';

jest.useFakeTimers();

describe('Range Presets Component, without the current report radio option', () => {
  let instance = null;
  let isFilteredSpy = null;
  let setDateRangeSpy = null;
  let component = null;

  const selectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A' }],
  };

  const setDateRangeMock = jest.fn();
  const setIsFilteredMock = jest.fn();
  const setIsCustomDateRangeMock = jest.fn();

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(
        <RangePresets
          selectedTable={selectedTable}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          setIsCustomDateRange={setIsCustomDateRangeMock}
        />
      );
    });
    instance = component.root;
    setDateRangeSpy = jest.spyOn(instance.props, 'handleDateRangeChange');
    isFilteredSpy = jest.spyOn(instance.props, 'setIsFiltered');
  });

  it(`displays an h3 element that reads "Date Range:" and includes the correct label from the
    selectedTable object`, () => {
    const header = instance.findByType('h3');
    const label = instance.findByProps({ 'data-test-id': 'label' });
    expect(header.children[0]).toBe('Date Range');
    expect(label.children[0]).toBe(` (${selectedTable.fields[0].prettyName})`);
  });

  it('contains a preset radio button for All which sets is filtered to true', async () => {
    const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-all' });
    await renderer.act(async () => {
      await radioBtn.props.onChange();
    });
    expect(isFilteredSpy).toHaveBeenCalledWith(true);
  });

  it('does not contain a preset radio button for the latest report by default', () => {
    expect(instance.findAllByProps({ 'data-test-id': 'preset-radio-current' }).length).toBe(0);
  });

  it('defaults the "5 Years" date Range preset button on first load', () => {
    const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-5yr' });
    expect(radioBtn.props.checked).toBeTruthy();
  });

  it(`persists the selected year option when changing tables and if the new table has that option
    available`, () => {
    // Select the 1 Year option
    const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-1yr' });
    renderer.act(() => {
      radioBtn.props.onChange();
    });
    expect(radioBtn.props.checked).toBeTruthy();

    const newTable = {
      earliestDate: '2012-01-02',
      latestDate: '2020-01-02',
      dateField: 'column B',
      fields: [{ columnName: 'column B', prettyName: 'Column B' }],
    };
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(
        <RangePresets
          selectedTable={newTable}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          setIsCustomDateRange={setIsCustomDateRangeMock}
        />
      );
    });
    jest.runAllTimers();

    // The 1 year option is still available
    expect(radioBtn.props.checked).toBeTruthy();
  });

  it(`selects the default "5 year" option when changing tables if the previously selected date
    range is not available for the current data table`, () => {
    let radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-10yr' });
    renderer.act(() => {
      radioBtn.props.onChange();
    });
    expect(radioBtn.props.checked).toBeTruthy();
    const newTable = {
      earliestDate: '2012-01-02',
      latestDate: '2020-01-02',
      dateField: 'column B',
      fields: [{ columnName: 'column B', prettyName: 'Column B' }],
    };
    renderer.act(() => {
      component.update(
        <RangePresets
          selectedTable={newTable}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          setIsCustomDateRange={setIsCustomDateRangeMock}
        />
      );
    });
    jest.runAllTimers();
    radioBtn = instance.findAllByProps({ 'data-test-id': 'preset-radio-10yr' });
    expect(radioBtn.length).toBe(0);
    expect(instance.findByProps({ 'data-test-id': 'preset-radio-5yr' }).props.checked).toBeTruthy();
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
    renderer.act(() => {
      component = renderer.create(
        <RangePresets
          selectedTable={selectedTable}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          setIsCustomDateRange={setIsCustomDateRangeMock}
          datasetDateRange={{ earliestDate: selectedTable.earliestDate, latestDate: selectedTable.latestDate }}
          datePreset={'custom'}
          customRangePreset={'latestQuarter'}
        />
      );
    });
    instance = component.root;
    jest.runAllTimers();

    const dateObj = new Date(Date.parse(selectedTable.latestDate));
    const quarterDatesMock = {
      from: subQuarters(addDays(dateObj, 1), 1),
      to: dateObj,
    };

    const customRangeButton = instance.findByProps({ 'data-test-id': 'preset-radio-custom' });
    expect(customRangeButton.props.checked).toBeTruthy();

    const datePickers = instance.findAllByType(DatePickers);
    expect(datePickers.length).toBeGreaterThan(0);

    expect(datePickers[0].props.selectedDateRange.from).toEqual(quarterDatesMock.from);
    expect(datePickers[0].props.selectedDateRange.to).toEqual(quarterDatesMock.to);
  });

  it('provides a custom date range button', () => {
    const customRangeButton = instance.findByProps({ id: 'radio-custom' });
    expect(customRangeButton).toBeDefined();
  });

  it('only shows the date pickers when the custom date range button is selected', () => {
    let datePickers = instance.findAllByType(DatePickers);
    expect(datePickers.length).toBe(0);

    const customRangeButton = instance.findByProps({ id: 'radio-custom' });
    renderer.act(() => {
      customRangeButton.props.onChange();
    });
    jest.runAllTimers();
    datePickers = instance.findAllByType(DatePickers);
    expect(datePickers.length).toBeGreaterThan(0);
  });

  it('passes in expected parameters to DatePickers', async () => {
    const customRangeButton = instance.findByProps({ id: 'radio-custom' });
    renderer.act(() => {
      customRangeButton.props.onChange();
    });
    jest.runAllTimers();

    const datePickers = instance.findByType(DatePickers);
    const availableDateRange = {
      from: new Date(selectedTable.earliestDate.replace(/-/g, '/')),
      to: new Date(selectedTable.latestDate.replace(/-/g, '/')),
      earliestDate: selectedTable.earliestDate,
      latestDate: selectedTable.latestDate,
    };
    const dateRangeSelection = {
      from: new Date(2001, 1, 1),
      to: new Date(),
    };

    expect(datePickers.props.availableDateRange).toEqual(availableDateRange);

    setDateRangeSpy.mockClear();
    renderer.act(() => {
      datePickers.props.setSelectedDates(dateRangeSelection);
    });
    jest.runAllTimers();

    expect(setDateRangeSpy).toHaveBeenCalledWith(dateRangeSelection);
  });

  it(`fits a currently selected custom date to a newly selected table's available date
    range as needed`, () => {
    const mockFarLateTable = { earliestDate: '2021-01-01', latestDate: '2022-01-01' };
    const mockLateTable = { earliestDate: '2010-01-01', latestDate: '2021-06-01' };
    const mockFarEarlyTable = { earliestDate: '1995-01-01', latestDate: '1999-01-01' };
    const mockEarlyTable = { earliestDate: '1998-01-01', latestDate: '2011-01-01' };
    const mockInteriorTable = { earliestDate: '2005-01-01', latestDate: '2015-01-01' };
    const rangeSelected = { from: new Date(2004, 0, 1), to: new Date(2020, 0, 1) };
    const radioBtn = instance.findByProps({ id: 'radio-custom' });
    renderer.act(() => {
      radioBtn.props.onChange();
    });

    const datePickers = instance.findByType(DatePickers);
    setDateRangeSpy.mockClear();
    renderer.act(() => {
      datePickers.props.setSelectedDates(rangeSelected);
    });
    expect(setDateRangeSpy).toHaveBeenCalledWith(rangeSelected);

    // Change to a table whose range is later with no dates overlapping current custom dateRange
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={mockFarLateTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2021-01-01 - 2021-01-01');

    // Change to a table whose range is later but overlaps custom range
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={mockLateTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2010-01-01 - 2020-01-01');
    expect(testReformatter(datePickers.props.selectedDateRange)).toEqual('2010-01-01 - 2020-01-01');

    // Early without overlap
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={mockFarEarlyTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('1999-01-01 - 1999-01-01');
    expect(testReformatter(datePickers.props.selectedDateRange)).toEqual('1999-01-01 - 1999-01-01');

    // Overlapping early
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={mockEarlyTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2004-01-01 - 2011-01-01');
    expect(testReformatter(datePickers.props.selectedDateRange)).toEqual('2004-01-01 - 2011-01-01');

    // Inset on both ends
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={mockInteriorTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2005-01-01 - 2015-01-01');
    expect(testReformatter(datePickers.props.selectedDateRange)).toEqual('2005-01-01 - 2015-01-01');

    // Overlapping both ends
    setDateRangeMock.mockClear();
    renderer.act(() => {
      component.update(<RangePresets selectedTable={selectedTable} setIsFiltered={setIsFilteredMock} handleDateRangeChange={setDateRangeMock} />);
    });
    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2004-01-01 - 2020-01-01');
    expect(testReformatter(datePickers.props.selectedDateRange)).toEqual('2004-01-01 - 2020-01-01');
  });

  it('expands the range of available dates when allTablesSelected is set to true', () => {
    const mockTableRange = { earliestDate: '2005-01-01', latestDate: '2015-01-01' };

    renderer.act(() => {
      component.update(
        <RangePresets
          selectedTable={mockTableRange}
          allTablesSelected={false}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
          setIsCustomDateRange={jest.fn}
        />
      );
    });

    setDateRangeSpy.mockClear();

    const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-all' });
    renderer.act(() => {
      radioBtn.props.onChange();
    });

    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2005-01-01 - 2015-01-01');

    setDateRangeSpy.mockClear();
    renderer.act(() => {
      component.update(
        <RangePresets
          selectedTable={mockTableRange}
          allTablesSelected={true}
          setIsFiltered={setIsFilteredMock}
          handleDateRangeChange={setDateRangeMock}
          datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
          setIsCustomDateRange={jest.fn}
        />
      );
    });

    expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('1998-01-01 - 2021-06-01');
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
