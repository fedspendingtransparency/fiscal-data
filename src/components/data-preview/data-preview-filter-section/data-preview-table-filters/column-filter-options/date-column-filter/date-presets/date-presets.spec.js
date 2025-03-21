import React from 'react';
import { monthNames } from '../../../../../../../utils/api-utils';
import Analytics from '../../../../../../../utils/analytics/analytics';
import { fireEvent, render } from '@testing-library/react';
import DatePresets from './date-presets';

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

  it('contains a preset radio button for All which sets is filtered to true', async () => {
    const { getByRole } = render(
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        setPickerDateRange={jest.fn()}
      />
    );
    const radioBtn = getByRole('radio', { name: 'All' });
    expect(radioBtn).toBeInTheDocument();
  });

  it('does not contain a preset radio button for the latest report by default', () => {
    const { getAllByRole, getByRole } = render(
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        setPickerDateRange={jest.fn()}
      />
    );
    const radioBtns = getAllByRole('radio');
    expect(radioBtns).toHaveLength(4);
    expect(getByRole('radio', { name: '1 Year' })).toBeInTheDocument();
    expect(getByRole('radio', { name: '5 Years' })).toBeInTheDocument();
    expect(getByRole('radio', { name: '10 Years' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'All' })).toBeInTheDocument();
  });

  it('defaults the "5 Years" date Range preset button on first load', () => {
    const { getByRole } = render(
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        setPickerDateRange={jest.fn()}
      />
    );
    const radioBtn = getByRole('radio', { name: '5 Years' });
    expect(radioBtn).toBeChecked();
  });

  // it(`persists the selected year option when changing tables and if the new table has that option available`, () => {
  //   // Select the 1 Year option
  //   const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-1yr' });
  //   renderer.act(() => {
  //     radioBtn.props.onChange();
  //   });
  //   expect(radioBtn.props.checked).toBeTruthy();
  //
  //   const newTable = {
  //     earliestDate: '2012-01-02',
  //     latestDate: '2020-01-02',
  //     dateField: 'column B',
  //     fields: [{ columnName: 'column B', prettyName: 'Column B' }],
  //   };
  //   setDateRangeMock.mockClear();
  //   renderer.act(() => {
  //     component.update(
  //       <DatePresets
  //         selectedTable={newTable}
  //         setIsFiltered={setIsFilteredMock}
  //         handleDateRangeChange={setDateRangeMock}
  //         setIsCustomDateRange={setIsCustomDateRangeMock}
  //       />
  //     );
  //   });
  //   jest.runAllTimers();
  //
  //   // The 1 year option is still available
  //   expect(radioBtn.props.checked).toBeTruthy();
  // });

  // it(`selects the default "5 year" option when changing tables if the previously selected date
  //   range is not available for the current data table`, () => {
  //   let radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-10yr' });
  //   renderer.act(() => {
  //     radioBtn.props.onChange();
  //   });
  //   expect(radioBtn.props.checked).toBeTruthy();
  //   const newTable = {
  //     earliestDate: '2012-01-02',
  //     latestDate: '2020-01-02',
  //     dateField: 'column B',
  //     fields: [{ columnName: 'column B', prettyName: 'Column B' }],
  //   };
  //   renderer.act(() => {
  //     component.update(
  //       <DatePresets
  //         selectedTable={newTable}
  //         setIsFiltered={setIsFilteredMock}
  //         handleDateRangeChange={setDateRangeMock}
  //         setIsCustomDateRange={setIsCustomDateRangeMock}
  //       />
  //     );
  //   });
  //   jest.runAllTimers();
  //   radioBtn = instance.findAllByProps({ 'data-test-id': 'preset-radio-10yr' });
  //   expect(radioBtn.length).toBe(0);
  //   expect(instance.findByProps({ 'data-test-id': 'preset-radio-5yr' }).props.checked).toBeTruthy();
  // });

  it('initially selects the "1 Year" option when date range is > 1 year and < 5 years', () => {
    const mockTable = Object.assign({}, selectedTable, { earliestDate: '2017-01-01' });

    const { getByRole, queryByRole } = render(
      <DatePresets
        selectedTable={mockTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={true}
        setPickerDateRange={jest.fn()}
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
      <DatePresets
        selectedTable={mockTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton={true}
        datePreset="current"
        setPickerDateRange={jest.fn()}
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

  //   it('expands the range of available dates when allTablesSelected is set to true', () => {
  //     const mockTableRange = { earliestDate: '2005-01-01', latestDate: '2015-01-01' };
  //
  //     renderer.act(() => {
  //       component.update(
  //         <DatePresets
  //           selectedTable={mockTableRange}
  //           allTablesSelected={false}
  //           setIsFiltered={setIsFilteredMock}
  //           handleDateRangeChange={setDateRangeMock}
  //           datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
  //           setIsCustomDateRange={jest.fn}
  //         />
  //       );
  //     });
  //
  //     setDateRangeSpy.mockClear();
  //
  //     const radioBtn = instance.findByProps({ 'data-test-id': 'preset-radio-all' });
  //     renderer.act(() => {
  //       radioBtn.props.onChange();
  //     });
  //
  //     expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('2005-01-01 - 2015-01-01');
  //
  //     setDateRangeSpy.mockClear();
  //     renderer.act(() => {
  //       component.update(
  //         <DatePresets
  //           selectedTable={mockTableRange}
  //           allTablesSelected={true}
  //           setIsFiltered={setIsFilteredMock}
  //           handleDateRangeChange={setDateRangeMock}
  //           datasetDateRange={{ earliestDate: '1998/01/01', latestDate: '2021/06/01' }}
  //           setIsCustomDateRange={jest.fn}
  //         />
  //       );
  //     });
  //
  //     expect(testReformatter(setDateRangeSpy.mock.calls[0][0])).toEqual('1998-01-01 - 2021-06-01');
  //   });
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
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byMonth"
        setPickerDateRange={jest.fn()}
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
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byMonth"
        setPickerDateRange={jest.fn()}
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
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byDay"
        setPickerDateRange={jest.fn()}
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
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byLast30Days"
        setPickerDateRange={jest.fn()}
      />
    );
    jest.runAllTimers();
    const expectedLabel = 'Last 30 Days';
    const radioBtn = getByRole('radio', { name: expectedLabel });
    expect(radioBtn).toBeInTheDocument();
  });

  it('initiates Analytics.event with correct parameters for all buttons', async () => {
    const { getByRole } = render(
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        currentDateButton="byLast30Days"
        setPickerDateRange={jest.fn()}
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
      <DatePresets
        selectedTable={selectedTable}
        setIsFiltered={setIsFilteredMock}
        handleDateRangeChange={setDateRangeMock}
        setIsCustomDateRange={setIsCustomDateRangeMock}
        setPickerDateRange={jest.fn()}
      />
    );
    expect(queryByTestId('datatable-banner')).not.toBeInTheDocument();
  });
});
