import React from 'react';
import renderer from 'react-test-renderer';
import TableSectionContainer from './table-section-container';
import DtgTable from '../../dtg-table/dtg-table';
import PivotToggle from './pivot-toggle/pivot-toggle';
import * as styles from './table-section-container.module.scss';
import {
  mockConfig,
  mockDateRange,
  mockTableWithPivot,
  mockApiData,
  mockTableWithNoChartAvailable,
  selectedTableLessFields,
  selectedPivot,
  pivotFields,
  selectedPivotWithAggregation,
  mockTableWithUserFilterAvailable,
  mockApiDataUserFilterable
} from './testHelpers';
import * as setNoChartMessageMod from './set-no-chart-message';
import ChartTableToggle from '../chart-table-toggle/chart-table-toggle';
import DatasetChart from '../dataset-chart/dataset-chart';
import AggregationNotice from './aggregation-notice/aggregation-notice';
import GLOBALS from '../../../helpers/constants';
import { render, fireEvent, waitFor } from "@testing-library/react"
import NotShownMessage from "./not-shown-message/not-shown-message";
import userEvent from '@testing-library/user-event';


describe('TableSectionContainer initial state', () => {
  let component, instance;
  const mockSetSelectedPivot = jest.fn();

  beforeAll(() => {
    component = renderer.create(<TableSectionContainer
      selectedTable={selectedTableLessFields}
      dateRange={mockDateRange}
      apiData={mockApiData}
      setSelectedPivot={mockSetSelectedPivot}
      config={mockConfig}
                                />);

    instance = component.root;
  });

  it('hides the table component when there is no data', () => {
    expect(instance.findAllByType(DtgTable).length).toBe(0);
  });
});

describe('TableSectionContainer while loading', () => {
  const mockSetSelectedPivot = jest.fn();
  let queryTestId;
  beforeAll(() => {
    const {queryByTestId} = render(<TableSectionContainer
      config={mockConfig}
      dateRange={mockDateRange}
      selectedTable={selectedTableLessFields}
      apiData={{ data: [], meta: { labels: {}} }}
      isLoading={true}
      apiError={false}
      setSelectedPivot={mockSetSelectedPivot}
      selectedPivot={selectedPivot}
                                   />);
    queryTestId = queryByTestId;
  })

  it('expects the table name to display', () => {
    expect(queryTestId('tableName')).toBeInTheDocument();
  });

  it('provides the loading section while the table is loading', () => {
    expect(queryTestId('loadingSection')).toBeNull();
  });
});

describe('TableSectionContainer with data', () => {
  const selectedTable = selectedTableLessFields;
  let component = renderer.create(), instance;
  const mockSetSelectedPivot = jest.fn();

  renderer.act(() => {
    component = renderer.create(<TableSectionContainer
      config={mockConfig}
      dateRange={mockDateRange}
      selectedTable={selectedTable}
      apiData={mockApiData}
      isLoading={false}
      apiError={false}
      selectedPivot={selectedPivot}
      setSelectedPivot={mockSetSelectedPivot}
                                />);
  });

  instance = component.root;

  it('displays the table component when there is data', () => {
    expect(instance.findAllByType(DtgTable).length).toBe(1);
  });

  it('sets noBorder on the table', () => {
    expect(instance.findByType(DtgTable).props.tableProps.noBorder).toBeDefined();
  });

  it('sends slug and currentTableName props to DatasetChart', () => {
    const datasetChartElement = instance.findByType(DatasetChart);
    expect(datasetChartElement.props.slug).toBe(mockConfig.slug);
    expect(datasetChartElement.props.currentTable).toBe(selectedTable);
  });

  it('shows no pivot options toggle when none are available', () => {
    renderer.act(() => {
      component.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithNoChartAvailable}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });
    instance = component.root;
    expect(instance.findAllByType(PivotToggle).length).toEqual(0);
  });
});

describe('TableSectionContainer with userFilter Options', () => {
  it('displays the NotShownMessage when a user filter is engaged that matches no rows', () => {
    let tableSectionContainer = {};
    renderer.act(() => {
      tableSectionContainer = renderer.create(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithUserFilterAvailable}
          userFilterSelection={{label: 'Auditorium', value: 'Auditorium'}}
          apiData={mockApiDataUserFilterable}
          isLoading={false}
          apiError={false}
          setSelectedPivot={jest.fn()}
        />
      );
    });

    const notShownMessages = tableSectionContainer.root.findAllByType(NotShownMessage);
    expect(notShownMessages.length).toStrictEqual(2);
    notShownMessages.forEach(notShownMessage => {
      expect(notShownMessage.props.heading)
        .toContain('The Facility Description specified does not have');
      expect(notShownMessage.props.heading)
        .toContain('available data within the date range selected.');
      expect(notShownMessage.props.bodyText)
        .toStrictEqual(mockTableWithUserFilterAvailable.userFilter.dataUnmatchedMessage);
    });
  });
});

describe('TableSectionContainer with Pivot Options', () => {
  let component = renderer.create(), instance;
  const mockSetSelectedPivot = jest.fn();

  renderer.act(() => {
    component = renderer.create(<TableSectionContainer
      config={mockConfig}
      dateRange={mockDateRange}
      selectedTable={mockTableWithPivot}
      apiData={mockApiData}
      pivotFields={pivotFields}
      selectedPivot={selectedPivot}
      isLoading={false}
      apiError={false}
      setSelectedPivot={mockSetSelectedPivot}
                                />);
  });

  instance = component.root;

  it('shows a pivot options toggle button when pivots are available', () => {
    expect(instance.findAllByType(PivotToggle).length).toEqual(1);
  });

  it('pivot options are in view by default', () => {
    const { getByTestId } = render(
      <TableSectionContainer
        config={mockConfig}
        dateRange={mockDateRange}
        selectedTable={mockTableWithPivot}
        apiData={mockApiData}
        pivotFields={pivotFields}
        selectedPivot={selectedPivot}
        isLoading={false}
        apiError={false}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );
    expect(getByTestId('pivotOptionsDrawer').className).toContain(styles.active);
  });

  it('shows no aggregation notice when the selected pivot is not aggregated', () => {
    expect(instance.findAllByType(AggregationNotice)).toEqual([]);
  });

  it('collapses/expands the pivot options when the toggle button is clicked', () => {
    const { getByTestId } = render(
      <TableSectionContainer
        config={mockConfig}
        dateRange={mockDateRange}
        selectedTable={mockTableWithPivot}
        apiData={mockApiData}
        pivotFields={pivotFields}
        selectedPivot={selectedPivot}
        isLoading={false}
        apiError={false}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );
    expect(getByTestId('pivotOptionsDrawer').className).toContain(styles.active);
    fireEvent.click(getByTestId('pivotToggle'));
    expect(getByTestId('pivotOptionsDrawer').className).not.toContain(styles.active);
  });

  it('relays an endpoint value when it receives it in the serverSidePagination prop', async () => {
    renderer.act(() => {
      component.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithNoChartAvailable}
          apiData={{ data: [], meta: { labels: {}} }}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          serverSidePagination="ssp-endpoint"
          setSelectedPivot={mockSetSelectedPivot}
        />
      )
    });
    const table = instance.findByType(DtgTable);
    expect(table.props.tableProps.serverSidePagination).toEqual('ssp-endpoint');
  });

  it(`calls setNoChartMessage and if it returns something truthy,
  passes along the message returned rather than a chart`, () => {

    const noChartMsg = 'No-Chart Message Mock';
    // case with a no-chart message
    setNoChartMessageMod['SetNoChartMessage'] =
      jest.fn().mockImplementation(() => noChartMsg);

    let tableSectionContainer = {};
    renderer.act(() => {
      tableSectionContainer = renderer.create(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setSelectedPivot={mockSetSelectedPivot}
        />
      );
    });

    expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();
    const chartProp = tableSectionContainer.root.findByType(ChartTableToggle).props.chart;

    // in place of a chart it sends the message returned to chart table toggle
    expect(chartProp).toEqual(noChartMsg);
  });

  it('calls setNoChartMessage and if value returned is falsy, attempts to make a DatasetChart',
    () => {

    // case without a no-chart message
    setNoChartMessageMod['SetNoChartMessage'] =
      jest.fn().mockImplementation(() => undefined);

    let tableSectionContainer = {};
    renderer.act(() => {
      tableSectionContainer = renderer.create(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivot}
          setSelectedPivot={mockSetSelectedPivot}
        />
      );
    });

    expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();
    const chartProp = tableSectionContainer.root.findByType(ChartTableToggle).props.chart;
    expect(chartProp.type).toBe(DatasetChart); // the thing sent to chartTableToggle is a chart
  });

  it('displays the aggregation notice when an aggregated pivot option is selected', () => {
    let tableSectionContainer = {};
    renderer.act(() => {
      tableSectionContainer = renderer.create(
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
      );
    });

    const aggNotice = tableSectionContainer.root.findByType(AggregationNotice);
    expect(aggNotice).toBeDefined();
  });

  it(`configures the legend to be hidden by default when the screen size is tablet width
  or below  and keeps legend visibility tied to window size before the user interactively toggles
  the state.`, () => {

    let tableSectionContainer = renderer.create();
    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large;
      tableSectionContainer = renderer.create(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);

    });

    let datasetChart = tableSectionContainer.root.findByType(DatasetChart);

    expect(datasetChart.props.legend).toBeFalsy();

    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large + 6;
      tableSectionContainer.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });

    datasetChart = tableSectionContainer.root.findByType(DatasetChart);

    expect(datasetChart.props.legend).toBeTruthy();

    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large - 125;
      tableSectionContainer.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });

    datasetChart = tableSectionContainer.root.findByType(DatasetChart);

    expect(datasetChart.props.legend).toBeFalsy();
  });

  it(`configures the legend to be visible by default when the screen size is wider than tablet
  width, but once the user interactively toggles the state, changes in screen size are ignored
  with respect to legend visibility`, () => {
    let tableSectionContainer = renderer.create();
    const onToggleLegendEvent = { preventDefault: jest.fn() };

    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large + 1;
      tableSectionContainer = renderer.create(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });
    let datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    expect(datasetChart.props.legend).toBeTruthy();

    // "interactively" toggle the legend to INVISIBLE
    const chartTableToggle = tableSectionContainer.root.findByType(ChartTableToggle);
    renderer.act(() => {
      chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
    });
    datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    expect(datasetChart.props.legend).toBeFalsy();

    // "interactively" toggle the legend to VISIBLE
    renderer.act(() => {
      chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
    });
    datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    expect(datasetChart.props.legend).toBeTruthy();

    // Change the screen size be narrower than the tablet threshold
    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large - 5;
      tableSectionContainer.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });
    datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    // Expect legend to still be visible after change to tablet size
    expect(datasetChart.props.legend).toBeTruthy();

    // "interactively" toggle the legend to INVISIBLE
    renderer.act(() => {
      chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
    });
    datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    expect(datasetChart.props.legend).toBeFalsy();

    // re-widen the screen size to desktop width
    renderer.act(() => {
      global.window.innerWidth = GLOBALS.breakpoints.large + 50;
      tableSectionContainer.update(
        <TableSectionContainer
          config={mockConfig}
          dateRange={mockDateRange}
          selectedTable={mockTableWithPivot}
          apiData={mockApiData}
          isLoading={false}
          apiError={false}
          selectedPivot={selectedPivotWithAggregation}
          setSelectedPivot={mockSetSelectedPivot}
        />);
    });
    datasetChart = tableSectionContainer.root.findByType(DatasetChart);
    // Expect legend to still be invisible after change to tablet
    expect(datasetChart.props.legend).toBeFalsy();
  });

});

describe('TableSectionContainer with Select Column', () => {
  const mockSetSelectedPivot = jest.fn();
  const selectedTable = selectedTableLessFields;
  const selectColMockConfig = {
    name: 'my name',
    slug: 'mock/slug/here',
    apis: [
      selectedTableLessFields,
      mockTableWithNoChartAvailable,
      mockTableWithPivot
    ],
    selectColumns: ['facility_desc', 'book_value_amt']
  }

  it('should show select column panel when select column is toggled on', async() => {
    const {getByRole, getByTestId} = render(<TableSectionContainer
      config={selectColMockConfig}
      dateRange={mockDateRange}
      selectedTable={selectedTable}
      selectedTab={0}
      apiData={mockApiData}
      isLoading={false}
      apiError={false}
      selectedPivot={selectedPivot}
      setSelectedPivot={mockSetSelectedPivot} />);

      const selectColumns = getByTestId('selectColumnsMainContainer');
      expect(selectColumns).toHaveClass('selectColumnPanel');

      const selectColToggle = getByRole('button', {name: 'Select Columns'});
      userEvent.click(selectColToggle);

      await waitFor(() => {
        expect(selectColumns).toHaveClass('selectColumnPanelActive');
      });

  });

  it('should hide select column panel when select column is toggled off', async () => {
    const {getByRole, getByTestId} = render(<TableSectionContainer
      config={selectColMockConfig}
      dateRange={mockDateRange}
      selectedTable={selectedTable}
      selectedTab={0}
      apiData={mockApiData}
      isLoading={false}
      apiError={false}
      selectedPivot={selectedPivot}
      setSelectedPivot={mockSetSelectedPivot} />);

      const selectColumns = getByTestId('selectColumnsMainContainer');
      expect(selectColumns).toHaveClass('selectColumnPanel');

      const selectColToggle = getByRole('button', {name: 'Select Columns'});
      userEvent.click(selectColToggle);

      await waitFor(() => {
        expect(selectColumns).toHaveClass('selectColumnPanelActive');
      });

      userEvent.click(selectColToggle);

      await waitFor(() => {
        expect(selectColumns).toHaveClass('selectColumnPanel');
      });
  });

});
