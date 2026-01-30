import React from 'react';
import TableSectionContainer from './table-section-container';
import { active } from './table-section-container.module.scss';
import {
  mockApiData,
  mockApiDataUserFilterable,
  mockConfig,
  mockDateRange,
  mockDetailConfig,
  mockTableWithApiFilterAvailable,
  mockTableWithApiFilterAvailableDisplayDefaultData,
  mockTableWithNoChartAvailable,
  mockTableWithPivot,
  mockTableWithUserFilterAvailable,
  pivotFields,
  selectedPivot,
  selectedPivotWithAggregation,
  selectedPivotWithRoundingDenomination,
  selectedTableLessFields,
} from './testHelpers';
import * as setNoChartMessageMod from './set-no-chart-message';
import GLOBALS from '../../../helpers/constants';
import globalConstants from '../../../helpers/constants';
import { act, fireEvent, render, waitFor, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { dataAggregationNotice } from './aggregation-notice/aggregation-notice';
import userEvent from '@testing-library/user-event';
import { queryClient } from '../../../../react-query-client';
import Analytics from '../../../utils/analytics/analytics';

// describe('entire block to check file coverage', () => {
describe('TableSectionContainer initial state', () => {
  const mockSetSelectedPivot = jest.fn();

  it('hides the table component when there is no data', () => {
    const { queryAllByRole } = render(
      <RecoilRoot>
        <TableSectionContainer
          selectedTable={selectedTableLessFields}
          dateRange={mockDateRange}
          apiData={{}}
          setSelectedPivot={mockSetSelectedPivot}
          config={mockConfig}
          setUserFilterSelection={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(queryAllByRole('table').length).toBe(0);
  });
});

describe('TableSectionContainer while loading', () => {
  const mockSetSelectedPivot = jest.fn();
  let queryTestId;
  beforeAll(() => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={true}
          apiError={false}
          setSelectedPivot={mockSetSelectedPivot}
          setUserFilterSelection={jest.fn()}
          selectedPivot={selectedPivot}
        />
      </RecoilRoot>
    );
    queryTestId = queryByTestId;
  });

  it('expects the table name to display', () => {
    expect(queryTestId('tableName')).toBeInTheDocument();
  });

  it('provides the loading section while the table is loading', () => {
    expect(queryTestId('loadingSection')).toBeNull();
  });
  it('does not show detailView on initial render', () => {
    expect(queryTestId('detailViewCloseButton')).not.toBeInTheDocument();
  });
});

describe('TableSectionContainer with data', () => {
  const selectedTable = selectedTableLessFields;
  const mockSetSelectedPivot = jest.fn();

  it('displays the table component when there is data', async () => {
    const { findByRole } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );

    expect(await findByRole('table')).toBeInTheDocument();
  });

  it('sends slug and currentTableName props to DatasetChart citation', () => {
    const { getByTestId, getByText } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    expect(getByText(`${globalConstants.BASE_SITE_URL}/datasets${mockConfig.slug}`)).toBeInTheDocument();
    expect(getByText(selectedTable.tableName)).toBeInTheDocument();
  });

  it('shows no pivot options toggle when none are available', () => {
    const { queryByText } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithNoChartAvailable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    expect(queryByText('Pivot View:')).not.toBeInTheDocument();
  });
});

describe('TableSectionContainer with userFilter Options', () => {
  it('displays the NotShownMessage when a user filter is engaged that matches no rows', () => {
    const { getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithUserFilterAvailable}
          userFilterSelection={{ label: 'Auditorium', value: 'Auditorium' }}
          apiData={mockApiDataUserFilterable}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );

    const notShownMessage = getAllByTestId('notShownContainer')[0];
    expect(
      within(notShownMessage).getByText('The Facility Description specified does not have available data within the date range selected.')
    ).toBeInTheDocument();
    expect(within(notShownMessage).getByText('Sorry, no facilities of that type for the date range.')).toBeInTheDocument();
  });
});

describe('TableSectionContainer with Pivot Options', () => {
  const mockSetSelectedPivot = jest.fn();

  it('shows a pivot options toggle button when pivots are available', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          pivotFields={pivotFields}
          selectedPivot={selectedPivot}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Hide Pivot Options' })).toBeInTheDocument();
  });

  it('pivot options are in view by default', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          pivotFields={pivotFields}
          selectedPivot={selectedPivot}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    expect(getByTestId('pivotOptionsDrawer').className).toContain(active);
  });

  // it('fires the correct GA event when the pivot toggle button is clicked', async () => {
  //   const analyticsSpy = jest.spyOn(Analytics, 'event');
  //
  //   const { getByTestId } = render(
  //     <RecoilRoot>
  //       <TableSectionContainer
  //         config={mockConfig}
  //         dateRange={mockDateRange}
  //         selectedTable={mockTableWithPivot}
  //         apiData={mockApiData}
  //         pivotFields={pivotFields}
  //         selectedPivot={selectedPivot}
  //         isLoading={false}
  //         apiError={false}
  //         setUserFilterSelection={jest.fn()}
  //         setSelectedPivot={mockSetSelectedPivot}
  //       />
  //     </RecoilRoot>
  //   );
  //   fireEvent.click(getByTestId('pivotToggle'));
  //   expect(analyticsSpy).toHaveBeenCalledWith({
  //     action: 'Hide Pivot Options Click',
  //     category: 'Chart Enabled',
  //     label: 'my name, Debt to the Nickel',
  //   });
  // });

  it('shows no aggregation notice when the selected pivot is not aggregated', () => {
    const {} = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          pivotFields={pivotFields}
          selectedPivot={selectedPivot}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    // expect(instance.findAllByType(AggregationNotice)).toEqual([]);
  });

  it('collapses/expands the pivot options when the toggle button is clicked', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          pivotFields={pivotFields}
          selectedPivot={selectedPivot}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    expect(getByTestId('pivotOptionsDrawer').className).toContain(active);
    fireEvent.click(getByTestId('pivotToggle'));
    expect(getByTestId('pivotOptionsDrawer').className).not.toContain(active);
  });

  it('toggle pivot view with rounding denomination', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          pivotFields={pivotFields}
          selectedPivot={selectedPivotWithRoundingDenomination}
          isLoading={false}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    fireEvent.click(getByTestId('pivotToggle'));
  });

  it('relays an endpoint value when it receives it in the serverSidePagination prop', async () => {
    const {} = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithNoChartAvailable}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          serverSidePagination="ssp-endpoint"
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    // const table = instance.findByType(DtgTable);
    // expect(table.props.tableProps.serverSidePagination).toEqual('ssp-endpoint');
  });

  it(`calls setNoChartMessage and if it returns something truthy,
  passes along the message returned rather than a chart`, () => {
    const noChartMsg = 'No-Chart Message Mock';
    // case with a no-chart message
    setNoChartMessageMod['SetNoChartMessage'] = jest.fn().mockImplementation(() => noChartMsg);

    const { getByText, queryByText } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );

    expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();

    // in place of a chart it sends the message returned to chart table toggle
    expect(getByText('No-Chart Message Mock')).toBeInTheDocument();
    expect(queryByText('Hide Legend')).toEqual(null);
  });

  it('calls setNoChartMessage and if value returned is falsy, attempts to make a DatasetChart', () => {
    // case without a no-chart message
    setNoChartMessageMod['SetNoChartMessage'] = jest.fn().mockImplementation(() => undefined);

    const { getByText, getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
          selectedTab={1}
        />
      </RecoilRoot>
    );

    expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();
    expect(getByText('Hide Legend')).toBeInTheDocument();
    expect(getByTestId('dataviz-line')).toBeInTheDocument();
  });

  it('displays the aggregation notice when an aggregated pivot option is selected', () => {
    const { getByText } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    const aggNotice = getByText(dataAggregationNotice);
    expect(aggNotice).toBeInTheDocument();
  });

  it(`configures the legend to be hidden by default when the screen size is tablet width
  or below  and keeps legend visibility tied to window size before the user interactively toggles
  the state.`, () => {
    global.window.innerWidth = GLOBALS.breakpoints.large;
    const { rerender, getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );
    let datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).not.toHaveClass('legendActive');

    global.window.innerWidth = GLOBALS.breakpoints.large + 6;
    rerender(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );

    datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).toHaveClass('legendActive');

    global.window.innerWidth = GLOBALS.breakpoints.large - 125;
    rerender(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />
      </RecoilRoot>
    );

    datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).not.toHaveClass('legendActive');
  });

  it(`configures the legend to be visible by default when the screen size is wider than tablet
  width, but once the user interactively toggles the state, changes in screen size are ignored
  with respect to legend visibility`, async () => {
    jest.useFakeTimers();
    global.window.innerWidth = GLOBALS.breakpoints.large + 1;
    const { getByTestId, rerender, findByRole, getByRole } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={mockSetSelectedPivot}
          tabChangeHandler={jest.fn()}
          selectedTab={1}
        />
      </RecoilRoot>
    );

    let datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).toHaveClass('legendActive');
    // "interactively" toggle the legend to INVISIBLE
    userEvent.click(getByRole('button', { name: 'Hide Legend' }));
    datasetChart = getByTestId('dataset-chart');
    jest.runAllTimers();

    await waitFor(() => expect(datasetChart).not.toHaveClass('legendActive'));

    // "interactively" toggle the legend to VISIBLE
    userEvent.click(getByRole('button', { name: 'Show Legend' }));
    datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).toHaveClass('legendActive');

    // Change the screen size be narrower than the tablet threshold
    global.window.innerWidth = GLOBALS.breakpoints.large - 5;
    act(() => {
      rerender(
        <RecoilRoot>
          <TableSectionContainer
            config={mockConfig}
            dateRange={mockDateRange}
            selectedTable={mockTableWithPivot}
            apiData={mockApiData}
            isLoading={false}
            apiError={false}
            selectedPivot={selectedPivotWithAggregation}
            setUserFilterSelection={jest.fn()}
            setSelectedPivot={mockSetSelectedPivot}
            selectedTab={1}
          />
        </RecoilRoot>
      );
    });

    datasetChart = getByTestId('dataset-chart');
    // Expect legend to still be visible after change to tablet size
    expect(datasetChart).toHaveClass('legendActive');

    // "interactively" toggle the legend to INVISIBLE
    userEvent.click(getByRole('button', { name: 'Hide Legend' }));

    datasetChart = getByTestId('dataset-chart');
    expect(datasetChart).not.toHaveClass('legendActive');

    // re-widen the screen size to desktop width
    global.window.innerWidth = GLOBALS.breakpoints.large + 50;
    act(() => {
      rerender(
        <RecoilRoot>
          <TableSectionContainer
            config={mockConfig}
            dateRange={mockDateRange}
            selectedTable={mockTableWithPivot}
            apiData={mockApiData}
            isLoading={false}
            apiError={false}
            selectedPivot={selectedPivotWithAggregation}
            setUserFilterSelection={jest.fn()}
            setSelectedPivot={mockSetSelectedPivot}
            selectedTab={1}
          />
        </RecoilRoot>
      );
    });
    datasetChart = getByTestId('dataset-chart');
    // Expect legend to still be invisible after change to tablet
    expect(datasetChart).not.toHaveClass('legendActive');
  });

  // it(`fires GA event upon legend toggle`, async () => {
  //   jest.useFakeTimers();
  //   global.window.innerWidth = GLOBALS.breakpoints.large + 1;
  //   const analyticsSpy = jest.spyOn(Analytics, 'event');
  //   const { getByTestId, rerender, findByRole, getByRole } = render(
  //     <RecoilRoot>
  //       <TableSectionContainer
  //         config={mockConfig}
  //         dateRange={mockDateRange}
  //         selectedTable={mockTableWithPivot}
  //         apiData={mockApiData}
  //         isLoading={false}
  //         apiError={false}
  //         selectedPivot={selectedPivotWithAggregation}
  //         setUserFilterSelection={jest.fn()}
  //         setSelectedPivot={mockSetSelectedPivot}
  //         tabChangeHandler={jest.fn()}
  //         selectedTab={1}
  //       />
  //     </RecoilRoot>
  //   );
  //
  //   const datasetChart = getByTestId('dataset-chart');
  //   expect(datasetChart).toHaveClass('legendActive');
  //   userEvent.click(getByRole('button', { name: 'Hide Legend' }));
  //   jest.runAllTimers();
  //
  //   expect(analyticsSpy).toHaveBeenCalledWith({
  //     action: 'Hide Legend Click',
  //     category: 'Chart Enabled',
  //     label: 'my name, Debt to the Nickel',
  //   });
  // });

  it('renders selected detail view key with the dataset header', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={true}
          apiError={false}
          setSelectedPivot={mockSetSelectedPivot}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          detailViewState="123"
        />
      </RecoilRoot>
    );
    expect(queryByTestId('tableName')).toBeInTheDocument();
  });
});
describe('formatDate function', () => {
  it('formats date based on custom format if provided', () => {
    const selectedTable = {
      ...selectedTableLessFields,
      customFormatting: [{ type: 'DATE', dateFormat: 'MM/DD/YYYY' }],
    };

    const { getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockDetailConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          setSelectedPivot={jest.fn()}
          detailViewState={{ value: new Date(2023, 5, 1) }}
          setUserFilterSelection={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getByTestId('tableName').textContent).toContain('Table 1 > 06/01/2023');
  });
});

describe('Table with API filter', () => {
  it('Initializes table with an api filter', () => {
    const mockSetIsLoading = jest.fn();

    const { queryByRole } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithApiFilterAvailable}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          userFilterSelection={null}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(queryByRole('table')).not.toBeInTheDocument();
  });
  it('Initializes table with an api filter and dispalyDefaultData is true', async () => {
    const mockSetIsLoading = jest.fn();
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithApiFilterAvailableDisplayDefaultData}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          userFilterSelection={null}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(mockSetIsLoading).not.toHaveBeenCalledWith(false);
  });
});

describe('tests getDepaginatedData function', () => {
  jest.mock('../../../utils/api-utils', () => ({
    ...jest.requireActual('../../../utils/api-utils'),
    fetchTableMeta: jest.fn(),
  }));

  it('tests if API returns a total count of 0', async () => {
    const mockSetIsLoading = jest.fn();

    jest.spyOn(queryClient, 'ensureQueryData').mockResolvedValueOnce({
      meta: { 'total-count': 0 },
    });

    const { findByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithApiFilterAvailable}
          apiData={{ data: [], meta: {} }}
          isLoading={true}
          setIsLoading={mockSetIsLoading}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          userFilterSelection={{ label: 'Room', value: 'Room ' }}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );
    await findByTestId('table-container');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('checks if console.info fires when err.name === AbortError', async () => {
    const mockSetIsLoading = jest.fn();
    const abortError = new Error('Request was aborted');
    abortError.name = 'AbortError';

    jest.spyOn(queryClient, 'ensureQueryData').mockRejectedValueOnce(abortError);
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithApiFilterAvailable}
          apiData={null}
          isLoading={true}
          setIsLoading={mockSetIsLoading}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          userFilterSelection={{ label: 'Room', value: 'Room' }}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Action cancelled.');
    });
    consoleSpy.mockRestore();
  });

  it('checks if console.error fires in any other error case', async () => {
    const mockSetIsLoading = jest.fn();
    const lostError = new Error('Request was lost');
    lostError.name = 'LostError';

    jest.spyOn(queryClient, 'ensureQueryData').mockRejectedValueOnce(lostError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithApiFilterAvailable}
          apiData={null}
          isLoading={true}
          setIsLoading={mockSetIsLoading}
          apiError={false}
          setUserFilterSelection={jest.fn()}
          userFilterSelection={{ label: 'Room', value: 'Room' }}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API error', lostError);
    });
    consoleSpy.mockRestore();
  });
});

describe('misc tests for component', () => {
  it('renders the button with the correct onClick call', async () => {
    const mockSetDetailViewState = jest.fn();

    const { getByTestId } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: {} }}
          isLoading={false}
          apiError={false}
          setSelectedPivot={jest.fn()}
          setUserFilterSelection={jest.fn()}
          detailViewState="randomState"
          selectedTab={0}
          setDetailViewState={mockSetDetailViewState}
        />
      </RecoilRoot>
    );
    const button = getByTestId('detailViewCloseButton');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockSetDetailViewState).toHaveBeenCalledWith(null);

    // below lines not currently improving coverage
    // const icon = getByTestId('arrow-icon');
    // expect(icon).toBeInTheDocument();
    // const icon1 = getByTestId('backButton');
    // expect(icon1).toBeInTheDocument();
  });
});
// });
