import React from 'react';
import { render } from '@testing-library/react';
import DatePresets from './date-presets';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();

describe('Range Presets Component, without the current report radio option', () => {
  const selectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A' }],
  };

  const mockPresets = [
    { label: '1 Year', key: '1yr', years: 1 },
    { label: '5 Years', key: '5yr', years: 5 },
    { label: '10 Years', key: '10yr', years: 10 },
  ];

  const activePresetKey = '5yr';

  it('contains a radio button for all of the preset dates', async () => {
    const { getByText } = render(<DatePresets selectedTable={selectedTable} presets={mockPresets} />);
    const oneYearBtn = getByText('1 Year');
    const fiveYearBtn = getByText('5 Years');
    const tenYearBtn = getByText('10 Years');
    expect(oneYearBtn).toBeInTheDocument();
    expect(fiveYearBtn).toBeInTheDocument();
    expect(tenYearBtn).toBeInTheDocument();
  });

  it('makes the active button selected by default', async () => {
    const { getByRole } = render(<DatePresets selectedTable={selectedTable} presets={mockPresets} activePresetKey={activePresetKey} />);
    const selectedBtn = getByRole('radio', { name: '5 Years' });
    expect(selectedBtn).toBeChecked();
  });

  it('updates active preset upon button click', async () => {
    const { getByRole } = render(<DatePresets selectedTable={selectedTable} presets={mockPresets} activePresetKey={activePresetKey} />);
    const selectedBtn = getByRole('radio', { name: '10 Years' });
    userEvent.click(selectedBtn);
    expect(selectedBtn).toBeChecked();
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

// describe('Range Presets Component - datatable banner', () => {
//   const selectedTable = {
//     earliestDate: '2002-01-01',
//     latestDate: '2020-01-01',
//     dateField: 'column A',
//     fields: [{ columnName: 'column A', prettyName: 'Column A' }],
//   };
//
//   const setDateRangeMock = jest.fn();
//   const setIsFilteredMock = jest.fn();
//   const setIsCustomDateRangeMock = jest.fn();
//
//   it(`does not render the datatable banner when no datatableBanner is passed in`, () => {
//     const { queryByTestId } = render(
//       <DatePresets
//         selectedTable={selectedTable}
//         setIsFiltered={setIsFilteredMock}
//         handleDateRangeChange={setDateRangeMock}
//         setIsCustomDateRange={setIsCustomDateRangeMock}
//         setPickerDateRange={jest.fn()}
//       />
//     );
//     expect(queryByTestId('datatable-banner')).not.toBeInTheDocument();
//   });
// });
