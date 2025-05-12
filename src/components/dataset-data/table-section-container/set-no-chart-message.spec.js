import {
  mockDateRange,
  mockTableWithNoChartAvailable,
  mockTableWithPivot,
  mockTableWithUserFilterAvailable,
  selectedPivot,
  selectedPivotWithNoChartType,
} from './testHelpers';
import { SetNoChartMessage } from './set-no-chart-message';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import React from 'react';

describe('setNoChartMessage helper', () => {
  it('returns an unable-to-render message when All Data Tables is selected', () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange, true);
    const { getByText } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(
      getByText('With the current "All Data Tables" selection, you may download the data, but the table and chart previews are not applicable.')
    ).toBeInTheDocument();
  });

  it('returns a not-available message when a selected table has no pivot options and a chartType of "none" for the default view', () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange);
    const { getByText } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(getByText('There are no charts for this Data Table.')).toBeInTheDocument();
  });

  it('produces chart issue message when customNoChartMessage is true', () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange, null, null, null, true);
    const { getByText, getByTestId } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(getByText('This chart is undergoing updates')).toBeInTheDocument();
    expect(getByTestId('mail-to link')).toBeInTheDocument();
  });

  it('returns a message prompting the user to select a pivot option to display the data', () => {
    const notShownMessage = SetNoChartMessage(selectedPivot, selectedPivotWithNoChartType);
    const { getByText } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(getByText('Use the dropdown to select a pivot option to display the chart')).toBeInTheDocument();
    expect(getByText('This data table cannot be rendered as a chart until a pivot option is applied.')).toBeInTheDocument();
  });

  it('returns a date range too narrow message when the selected date range spans no more than a day', () => {
    const dateMock = new Date(2020, 2, 15);
    const notShownMessage = SetNoChartMessage(mockTableWithPivot, selectedPivot, {
      to: dateMock,
      from: dateMock,
    });
    const { getByText } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(getByText('Select a different date range to display a chart')).toBeInTheDocument();
    expect(getByText('No chart is available for the selected date range because it is too narrow to effectively chart.')).toBeInTheDocument();
  });

  it('produces no dateRange-too-narrow message when the date range includes at least two days', async () => {
    const fromDateMock = new Date(2019, 11, 24);
    const toDateMock = new Date(2019, 11, 25);
    const notShownMessage = SetNoChartMessage(mockTableWithPivot, selectedPivot, {
      to: toDateMock,
      from: fromDateMock,
    });
    expect(notShownMessage).toBeUndefined(); // no message
  });

  it('produces no chart message when userFilter is available but unselected days', () => {
    const fromDateMock = new Date(2019, 11, 24);
    const toDateMock = new Date(2019, 11, 25);
    const notShownMessage = SetNoChartMessage(mockTableWithUserFilterAvailable, null, {
      to: toDateMock,
      from: fromDateMock,
    });
    const { getByText } = render(<RecoilRoot>{notShownMessage}</RecoilRoot>);
    expect(getByText('Select from Facility Description options above to display the chart.')).toBeInTheDocument();
  });
});
