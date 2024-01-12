import { mockDateRange, mockTableWithNoChartAvailable, mockTableWithPivot, mockTableWithUserFilterAvailable, selectedPivot } from './testHelpers';
import { SetNoChartMessage } from './set-no-chart-message';

describe('setNoChartMessage helper', () => {
  it('returns an unable-to-render message when All Data Tables is selected', async () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange, true);
    expect(notShownMessage.props.heading).toEqual(
      'With the current "All Data Tables" selection, we are unable to render a Table or Chart at this time.'
    );
  });

  it('returns a not-available message when a selected table has no pivot options and a chartType of "none" for the default view', async () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange);
    expect(notShownMessage.props.heading).toEqual('There are no charts for this Data Table.');
  });

  it('Produces chart issue message when customNoChartMessage is true', async () => {
    const notShownMessage = SetNoChartMessage(mockTableWithNoChartAvailable, selectedPivot, mockDateRange, null, null, null, true);
    expect(notShownMessage.props.bodyText.props.children[0]).toContain(
      'The Fiscal Data team is working to address an issue with the charts for this dataset.'
    );
  });

  it('returns a date range too narrow message when the selected date range spans no more than a day', async () => {
    const dateMock = new Date(2020, 2, 15);
    const notShownMessage = SetNoChartMessage(mockTableWithPivot, selectedPivot, {
      to: dateMock,
      from: dateMock,
    });
    expect(notShownMessage.props.heading).toEqual('Select a different date range to display a chart');
    expect(notShownMessage.props.bodyText).toEqual(
      'No chart is available for the selected date range because it is too narrow to effectively chart.'
    );
  });

  it('Produces no dateRange-too-narrow message when the date range includes at least two days', async () => {
    const fromDateMock = new Date(2019, 11, 24);
    const toDateMock = new Date(2019, 11, 25);
    const notShownMessage = SetNoChartMessage(mockTableWithPivot, selectedPivot, {
      to: toDateMock,
      from: fromDateMock,
    });
    expect(notShownMessage).toBeUndefined(); // no message
  });

  it('Produces no chart message when userFilter is available but unselected days', async () => {
    const fromDateMock = new Date(2019, 11, 24);
    const toDateMock = new Date(2019, 11, 25);
    const notShownMessage = SetNoChartMessage(mockTableWithUserFilterAvailable, null, {
      to: toDateMock,
      from: fromDateMock,
    });
    expect(notShownMessage.props.heading).toContain('Select');
    expect(notShownMessage.props.heading).toContain('from Facility Description options above to display the chart.');
  });
});
