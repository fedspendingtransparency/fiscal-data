import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';

import TableSectionContainer from './table-section-container';
import DtgTable from '../../dtg-table/dtg-table';
import PivotToggle from './pivot-toggle/pivot-toggle';
import ChartTableToggle from '../chart-table-toggle/chart-table-toggle';
import DatasetChart from '../dataset-chart/dataset-chart';
import AggregationNotice from './aggregation-notice/aggregation-notice';

import GLOBALS from '../../../helpers/constants';
import * as setNoChartMessageMod from './set-no-chart-message';

import {
  mockConfig,
  mockDateRange,
  mockTableWithPivot,
  mockTableWithNoChartAvailable,
  mockApiData,
  mockTableWithUserFilterAvailable,
  mockApiDataUserFilterable,
  selectedTableLessFields,
  selectedPivot,
  selectedPivotWithAggregation,
  pivotFields,
  selectedPivotWithRoundingDenomination,
  mockTableWithApiFilterAvailable,
  mockTableWithApiFilterAvailableDisplayDefaultData,
  mockDetailConfig,
} from './testHelpers';

describe('TableSectionContainer initial state', () => {
  it('hides the table component when there is no data', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          selectedTable={selectedTableLessFields}
          dateRange={mockDateRange}
          apiData={{}}
          setSelectedPivot={jest.fn()}
          config={mockConfig}
          setUserFilterSelection={jest.fn()}
        />
      </RecoilRoot>
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});

describe('TableSectionContainer while loading', () => {
  it('expects the table name to display', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={true}
          apiError={false}
          setSelectedPivot={jest.fn()}
          setUserFilterSelection={jest.fn()}
          selectedPivot={selectedPivot}
        />
      </RecoilRoot>
    );
    expect(screen.getByTestId('tableName')).toBeInTheDocument();
  });

  it('provides the loading section while the table is loading', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={true}
          apiError={false}
          setSelectedPivot={jest.fn()}
          setUserFilterSelection={jest.fn()}
          selectedPivot={selectedPivot}
        />
      </RecoilRoot>
    );

    expect(screen.getByTestId('loadingSection')).toBeInTheDocument();
  });

  it('does not show detailView on initial render', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={{ data: [], meta: { labels: {} } }}
          isLoading={true}
          apiError={false}
          setSelectedPivot={jest.fn()}
          setUserFilterSelection={jest.fn()}
          selectedPivot={selectedPivot}
        />
      </RecoilRoot>
    );

    expect(screen.queryByTestId('detailViewCloseButton')).not.toBeInTheDocument();
  });
});

describe('TableSectionContainer - With Data', () => {
  it('displays the table component when there is data', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setSelectedPivot={jest.fn()}
          setUserFilterSelection={jest.fn()}
        />
      </RecoilRoot>
    );

    expect(screen.getByText('Table 1')).toBeInTheDocument();
  });

  it('sets noBorder on the table', () => {
    const { container } = render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );
  });

  it('sends slug and currentTableName props to DatasetChart', () => {
    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTableLessFields}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={jest.fn()}
          selectedTab={1}
        />
      </RecoilRoot>
    );
    expect(screen.getByTestId('dataviz-line')).toBeInTheDocument();
  });

  it('shows no pivot toggle when none are available', () => {
    render(
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
          setSelectedPivot={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(screen.queryByTestId('pivotToggle')).not.toBeInTheDocument();
  });
});
describe('TableSectionContainer with userFilter Options', () => {
  it('displays the NotShownMessage when a user filter is engaged that matches no rows', () => {
    render(
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
    expect(screen.getAllByText(/The Facility Description specified does not have/i).length).toBe(2);
  });
});
describe('TableSectionContainer with Pivot Options', () => {
  let mockSetSelectedPivot;

  beforeEach(() => {
    mockSetSelectedPivot = jest.fn();
  });

  it('shows a pivot options toggle button when pivots are available', () => {
    render(
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

    expect(screen.getByTestId('pivotToggle')).toBeInTheDocument();
  });

  it('pivot options are in view by default', () => {
    render(
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

    const drawer = screen.getByTestId('pivotOptionsDrawer');
    expect(drawer.className).toContain('active');
  });

  it('shows no aggregation notice when the selected pivot is not aggregated', () => {
    render(
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

    expect(screen.queryByText(/aggregate/i)).not.toBeInTheDocument();
  });

  it('collapses/expands the pivot options when the toggle button is clicked', async () => {
    render(
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

    const drawer = screen.getByTestId('pivotOptionsDrawer');
    expect(drawer.className).toContain('active');

    await userEvent.click(screen.getByTestId('pivotToggle'));
    expect(drawer.className).not.toContain('active');
  });

  it('shows a roundingDenomination pivot without crashing', async () => {
    render(
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

    await userEvent.click(screen.getByTestId('pivotToggle'));
  });

  it('passes serverSidePagination prop to DtgTable if provided', () => {
    render(
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

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls setNoChartMessage, shows the returned message if truthy', () => {
    jest.spyOn(setNoChartMessageMod, 'SetNoChartMessage').mockReturnValue('No-Chart Message Mock');

    render(
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
    expect(setNoChartMessageMod.SetNoChartMessage).toHaveBeenCalled();
    expect(screen.getByText('No-Chart Message Mock')).toBeInTheDocument();
    expect(screen.queryByText('Hide Legend')).not.toBeInTheDocument();
  });

  it('calls setNoChartMessage, shows DatasetChart if it returns falsy', () => {
    jest.spyOn(setNoChartMessageMod, 'SetNoChartMessage').mockReturnValue(undefined);

    render(
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

    expect(setNoChartMessageMod.SetNoChartMessage).toHaveBeenCalled();
    expect(screen.getByText('Hide Legend')).toBeInTheDocument();
    expect(screen.getByTestId('dataviz-line')).toBeInTheDocument();
  });

  it('displays the aggregation notice when an aggregated pivot option is selected', () => {
    render(
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

    expect(screen.getByText('This data is aggregated by the given Time Period for the selected pivot option')).toBeInTheDocument();
  });

  it('configures legend to hide/show by default based on window width (no user toggle)', async () => {
    const originalInnerWidth = global.innerWidth;
    global.innerWidth = GLOBALS.breakpoints.large;

    render(
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
    global.innerWidth = originalInnerWidth;
  });

  it('once user toggles legend, window resizing no longer changes legend state', async () => {
    global.innerWidth = GLOBALS.breakpoints.large + 1;
    const { rerender } = render(
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

    expect(screen.queryByText('Hide Pivot Options')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Hide Pivot Options'));
    await waitFor(() => expect(screen.queryByText('Hide Pivot Options')).not.toBeInTheDocument());

    global.innerWidth = GLOBALS.breakpoints.large - 5;
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

    expect(screen.queryByText('Hide Pivot Options')).not.toBeInTheDocument();

    global.innerWidth = 1024;
  });

  it('renders selected detail view key with the dataset header', () => {
    render(
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

    expect(screen.getByTestId('tableName')).toBeInTheDocument();
  });
});

describe('formatDate function', () => {
  it('formats date based on custom format if provided', () => {
    const selectedTable = {
      ...selectedTableLessFields,
      customFormatting: [{ type: 'DATE', dateFormat: 'MM/DD/YYYY' }],
    };

    render(
      <RecoilRoot>
        <TableSectionContainer
          config={mockDetailConfig}
          dateRange={mockDateRange}
          selectedTable={selectedTable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          detailViewState={{ value: new Date(2023, 5, 1) }}
          setUserFilterSelection={jest.fn()}
          setSelectedPivot={jest.fn()}
          selectedPivot={null}
        />
      </RecoilRoot>
    );

    expect(screen.getByTestId('tableName').textContent).toContain('06/01/2023');
  });
});

describe('Table with API filter', () => {
  it('Initializes table with an api filter', () => {
    const mockSetIsLoading = jest.fn();

    render(
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
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('Initializes table with an api filter and displayDefaultData is true', async () => {
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
