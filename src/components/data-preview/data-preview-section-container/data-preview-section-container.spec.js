import React from 'react';
import renderer from 'react-test-renderer';
import { active } from './data-preview-section-container.module.scss';
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
  mockApiDataUserFilterable,
  selectedPivotWithRoundingDenomination,
  mockTableWithApiFilterAvailable,
  mockDetailConfig,
  mockTableWithApiFilterAvailableDisplayDefaultData,
} from '../../dataset-data/table-section-container/testHelpers';
// import * as setNoChartMessageMod from './set-no-chart-message';
// import AggregationNotice from './aggregation-notice/aggregation-notice';
import GLOBALS from '../../../helpers/constants';
import { render, fireEvent } from '@testing-library/react';
// import NotShownMessage from './not-shown-message/not-shown-message';
import { RecoilRoot } from 'recoil';
import DataPreviewTable from '../data-preview-table/data-preview-table';
import DataPreviewSectionContainer from './data-preview-section-container';

// describe('DataPreviewSectionContainer initial state', () => {
//   let component, instance;
//   const mockSetSelectedPivot = jest.fn();
//
//   beforeAll(() => {
//     component = renderer.create(
//       <RecoilRoot>
//         <DataPreviewSectionContainer
//           selectedTable={selectedTableLessFields}
//           dateRange={mockDateRange}
//           apiData={{}}
//           setSelectedPivot={mockSetSelectedPivot}
//           config={mockConfig}
//           setUserFilterSelection={jest.fn()}
//         />
//       </RecoilRoot>
//     );
//
//     instance = component.root;
//   });

//   it('hides the table component when there is no data', () => {
//     expect(instance.findAllByType(DataPreviewTable).length).toBe(0);
//   });
// });

describe('DataPreviewSectionContainer while loading', () => {
  const mockSetSelectedPivot = jest.fn();
  let queryTestId;
  beforeAll(() => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DataPreviewSectionContainer
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

  // it('provides the loading section while the table is loading', () => {
  //   expect(queryTestId('loadingSection')).toBeNull();
  // });
  it('does not show detailView on initial render', () => {
    expect(queryTestId('detailViewCloseButton')).not.toBeInTheDocument();
  });
});

describe('DataPreviewSectionContainer with data', () => {
  const selectedTable = selectedTableLessFields;
  let component = renderer.create(),
    instance;
  const mockSetSelectedPivot = jest.fn();

  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataPreviewSectionContainer
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
  });

  instance = component.root;

  it('displays the table component when there is data', () => {
    expect(instance.findAllByType(DataPreviewTable).length).toBe(1);
  });

  it('sets noBorder on the table', () => {
    expect(instance.findByType(DataPreviewTable).props.tableProps.noBorder).toBeDefined();
  });

  //   it('sends slug and currentTableName props to DatasetChart', () => {
  //     const datasetChartElement = instance.findByType(DatasetChart);
  //     expect(datasetChartElement.props.slug).toBe(mockConfig.slug);
  //     expect(datasetChartElement.props.currentTable).toBe(selectedTable);
  //   });
  //
  //   it('shows no pivot options toggle when none are available', () => {
  //     renderer.act(() => {
  //       component.update(
  //         <RecoilRoot>
  //           <DataPreviewSectionContainer
  //             config={mockConfig}
  //             dateRange={mockDateRange}
  //             selectedTable={mockTableWithNoChartAvailable}
  //             apiData={mockApiData}
  //             isLoading={false}
  //             apiError={false}
  //             selectedPivot={selectedPivot}
  //             setUserFilterSelection={jest.fn()}
  //             setSelectedPivot={mockSetSelectedPivot}
  //           />
  //         </RecoilRoot>
  //       );
  //     });
  //     instance = component.root;
  //     expect(instance.findAllByType(PivotToggle).length).toEqual(0);
  //   });
});

describe('DataPreviewSectionContainer with userFilter Options', () => {
  // it('displays the NotShownMessage when a user filter is engaged that matches no rows', () => {
  //   let tableSectionContainer = {};
  //   renderer.act(() => {
  //     tableSectionContainer = renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithUserFilterAvailable}
  //           userFilterSelection={{ label: 'Auditorium', value: 'Auditorium' }}
  //           apiData={mockApiDataUserFilterable}
  //           isLoading={false}
  //           apiError={false}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={jest.fn()}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //
  //   const notShownMessages = tableSectionContainer.root.findAllByType(NotShownMessage);
  //   expect(notShownMessages.length).toStrictEqual(2);
  //   notShownMessages.forEach(notShownMessage => {
  //     expect(notShownMessage.props.heading).toContain('The Facility Description specified does not have');
  //     expect(notShownMessage.props.heading).toContain('available data within the date range selected.');
  //     expect(notShownMessage.props.bodyText).toStrictEqual(mockTableWithUserFilterAvailable.userFilter.dataUnmatchedMessage);
  //   });
  // });
});

describe('DataPreviewSectionContainer with Pivot Options', () => {
  let component = renderer.create(),
    instance;
  const mockSetSelectedPivot = jest.fn();

  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataPreviewSectionContainer
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
  });

  instance = component.root;

  // it('shows a pivot options toggle button when pivots are available', () => {
  //   expect(instance.findAllByType(PivotToggle).length).toEqual(1);
  // });

  // it('pivot options are in view by default', () => {
  //   const { getByTestId } = render(
  //     <RecoilRoot>
  //       <DataPreviewSectionContainer
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
  //   expect(getByTestId('pivotOptionsDrawer').className).toContain(active);
  // });

  // it('shows no aggregation notice when the selected pivot is not aggregated', () => {
  //   expect(instance.findAllByType(AggregationNotice)).toEqual([]);
  // });

  // it('collapses/expands the pivot options when the toggle button is clicked', () => {
  //   const { getByTestId } = render(
  //     <RecoilRoot>
  //       <DataPreviewSectionContainer
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
  //   expect(getByTestId('pivotOptionsDrawer').className).toContain(active);
  //   fireEvent.click(getByTestId('pivotToggle'));
  //   expect(getByTestId('pivotOptionsDrawer').className).not.toContain(active);
  // });

  // it('toggle pivot view with rounding denomination', () => {
  //   const { getByTestId } = render(
  //     <RecoilRoot>
  //       <DataPreviewSectionContainer
  //         config={mockConfig}
  //         dateRange={mockDateRange}
  //         selectedTable={mockTableWithPivot}
  //         apiData={mockApiData}
  //         pivotFields={pivotFields}
  //         selectedPivot={selectedPivotWithRoundingDenomination}
  //         isLoading={false}
  //         apiError={false}
  //         setUserFilterSelection={jest.fn()}
  //         setSelectedPivot={mockSetSelectedPivot}
  //       />
  //     </RecoilRoot>
  //   );
  //   fireEvent.click(getByTestId('pivotToggle'));
  // });

  it('relays an endpoint value when it receives it in the serverSidePagination prop', async () => {
    renderer.act(() => {
      component.update(
        <RecoilRoot>
          <DataPreviewSectionContainer
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
    });
    const table = instance.findByType(DataPreviewTable);
    expect(table.props.tableProps.serverSidePagination).toEqual('ssp-endpoint');
  });

  // it(`calls setNoChartMessage and if it returns something truthy,
  // passes along the message returned rather than a chart`, () => {
  //   const noChartMsg = 'No-Chart Message Mock';
  //   // case with a no-chart message
  //   setNoChartMessageMod['SetNoChartMessage'] = jest.fn().mockImplementation(() => noChartMsg);
  //
  //   const { getByText, queryByText } = render(
  //     <RecoilRoot>
  //       <DataPreviewSectionContainer
  //         config={mockConfig}
  //         dateRange={mockDateRange}
  //         selectedTable={mockTableWithPivot}
  //         apiData={mockApiData}
  //         isLoading={false}
  //         apiError={false}
  //         selectedPivot={selectedPivot}
  //         setUserFilterSelection={jest.fn()}
  //         setSelectedPivot={mockSetSelectedPivot}
  //       />
  //     </RecoilRoot>
  //   );
  //
  //   expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();
  //
  //   // in place of a chart it sends the message returned to chart table toggle
  //   expect(getByText('No-Chart Message Mock')).toBeInTheDocument();
  //   expect(queryByText('Hide Legend')).toEqual(null);
  // });

  // it('calls setNoChartMessage and if value returned is falsy, attempts to make a DatasetChart', () => {
  //   // case without a no-chart message
  //   setNoChartMessageMod['SetNoChartMessage'] = jest.fn().mockImplementation(() => undefined);
  //
  //   const { getByText, getByTestId } = render(
  //     <RecoilRoot>
  //       <DataPreviewSectionContainer
  //         config={mockConfig}
  //         dateRange={mockDateRange}
  //         selectedTable={mockTableWithPivot}
  //         apiData={mockApiData}
  //         isLoading={false}
  //         apiError={false}
  //         selectedPivot={selectedPivot}
  //         setUserFilterSelection={jest.fn()}
  //         setSelectedPivot={mockSetSelectedPivot}
  //         selectedTab={1}
  //       />
  //     </RecoilRoot>
  //   );
  //
  //   expect(setNoChartMessageMod.SetNoChartMessage).toBeCalled();
  //   expect(getByText('Hide Legend')).toBeInTheDocument();
  //   expect(getByTestId('dataviz-line')).toBeInTheDocument();
  // });

  // it('displays the aggregation notice when an aggregated pivot option is selected', () => {
  //   let tableSectionContainer = {};
  //   renderer.act(() => {
  //     tableSectionContainer = renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //
  //   const aggNotice = tableSectionContainer.root.findByType(AggregationNotice);
  //   expect(aggNotice).toBeDefined();
  // });

  // it(`configures the legend to be hidden by default when the screen size is tablet width
  // or below  and keeps legend visibility tied to window size before the user interactively toggles
  // the state.`, () => {
  //   let tableSectionContainer = renderer.create();
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large;
  //     tableSectionContainer = renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //
  //   let datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //
  //   expect(datasetChart.props.legend).toBeFalsy();
  //
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large + 6;
  //     tableSectionContainer.update(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //
  //   expect(datasetChart.props.legend).toBeTruthy();
  //
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large - 125;
  //     tableSectionContainer.update(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //
  //   expect(datasetChart.props.legend).toBeFalsy();
  // });
  //
  // it(`configures the legend to be visible by default when the screen size is wider than tablet
  // width, but once the user interactively toggles the state, changes in screen size are ignored
  // with respect to legend visibility`, () => {
  //   let tableSectionContainer = renderer.create();
  //   const onToggleLegendEvent = { preventDefault: jest.fn() };
  //
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large + 1;
  //     tableSectionContainer = renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //   let datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   expect(datasetChart.props.legend).toBeTruthy();
  //
  //   // "interactively" toggle the legend to INVISIBLE
  //   const chartTableToggle = tableSectionContainer.root.findByType(ChartTableToggle);
  //   renderer.act(() => {
  //     chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
  //   });
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   expect(datasetChart.props.legend).toBeFalsy();
  //
  //   // "interactively" toggle the legend to VISIBLE
  //   renderer.act(() => {
  //     chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
  //   });
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   expect(datasetChart.props.legend).toBeTruthy();
  //
  //   // Change the screen size be narrower than the tablet threshold
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large - 5;
  //     tableSectionContainer.update(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   // Expect legend to still be visible after change to tablet size
  //   expect(datasetChart.props.legend).toBeTruthy();
  //
  //   // "interactively" toggle the legend to INVISIBLE
  //   renderer.act(() => {
  //     chartTableToggle.props.onToggleLegend(onToggleLegendEvent);
  //   });
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   expect(datasetChart.props.legend).toBeFalsy();
  //
  //   // re-widen the screen size to desktop width
  //   renderer.act(() => {
  //     global.window.innerWidth = GLOBALS.breakpoints.large + 50;
  //     tableSectionContainer.update(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={mockTableWithPivot}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           selectedPivot={selectedPivotWithAggregation}
  //           setUserFilterSelection={jest.fn()}
  //           setSelectedPivot={mockSetSelectedPivot}
  //         />
  //       </RecoilRoot>
  //     );
  //   });
  //   datasetChart = tableSectionContainer.root.findByType(DatasetChart);
  //   // Expect legend to still be invisible after change to tablet
  //   expect(datasetChart.props.legend).toBeFalsy();
  // });

  //   it('renders selected detail view key with the dataset header', () => {
  //     const { queryByTestId } = render(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={selectedTableLessFields}
  //           apiData={{ data: [], meta: { labels: {} } }}
  //           isLoading={true}
  //           apiError={false}
  //           setSelectedPivot={mockSetSelectedPivot}
  //           selectedPivot={selectedPivot}
  //           setUserFilterSelection={jest.fn()}
  //           detailViewState="123"
  //         />
  //       </RecoilRoot>
  //     );
  //     expect(queryByTestId('tableName')).toBeInTheDocument();
  //   });
  // });
  // describe('formatDate function', () => {
  //   it('formats date based on custom format if provided', () => {
  //     const selectedTable = {
  //       ...selectedTableLessFields,
  //       customFormatting: [{ type: 'DATE', dateFormat: 'MM/DD/YYYY' }],
  //     };
  //
  //     const { getByTestId } = render(
  //       <RecoilRoot>
  //         <DataPreviewSectionContainer
  //           config={mockDetailConfig}
  //           dateRange={mockDateRange}
  //           selectedTable={selectedTable}
  //           apiData={mockApiData}
  //           isLoading={false}
  //           apiError={false}
  //           setSelectedPivot={jest.fn()}
  //           detailViewState={{ value: new Date(2023, 5, 1) }}
  //           setUserFilterSelection={jest.fn()}
  //         />
  //       </RecoilRoot>
  //     );
  //     expect(getByTestId('tableName').textContent).toContain('Table 1 > 06/01/2023');
  //   });
});

describe('Table with API filter', () => {
  it('Initializes table with an api filter', () => {
    const mockSetIsLoading = jest.fn();

    const { queryByRole } = render(
      <RecoilRoot>
        <DataPreviewSectionContainer
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
        <DataPreviewSectionContainer
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
