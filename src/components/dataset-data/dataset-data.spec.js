import React from 'react';
import renderer from 'react-test-renderer';
import { DatasetDataComponent, tabletMobileTitle } from './dataset-data';
import FilterAndDownload from '../filter-download-container/filter-download-container';
import DataTableSelect from '../datatable-select/datatable-select';
import { format } from 'date-fns';
import { pivotData } from '../../utils/api-utils';
import TableSectionContainer from './table-section-container/table-section-container';
import {
  config, mockApiData, latestDate, fivePrior, mockLocation,
  mockLocationWithTablePathName, mockPivotableData, mockAccumulableData
} from './test-helper';
import * as DatasetDataHelpers from './dataset-data-helper/dataset-data-helper';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import ReportDataToggle from './report-data-toggle/report-data-toggle';
import PublishedReports from '../published-reports/published-reports';
import Analytics from '../../utils/analytics/analytics';
import {
  whiteListIds,
  mockPublishedReportsMTS
} from '../../helpers/published-reports/published-reports';
import PagingOptionsMenu from '../pagination/paging-options-menu';
import DownloadWrapper from '../download-wrapper/download-wrapper';
import RangePresets from '../filter-download-container/range-presets/range-presets';
import {fireEvent, render} from '@testing-library/react';
import { reports } from '../published-reports/test-helper';

jest.useFakeTimers();
jest.mock('../truncate/truncate.jsx', () => () => 'Truncator');
jest.mock('../../helpers/dataset-detail/report-helpers', function() {
  return {
    __esModule: true,
    getPublishedDates: jest.fn().mockImplementation(() => [{
      "path": "/downloads/mspd_reports/opdm092020.pdf",
      "report_group_desc": "Entire (.pdf)",
      "report_date": new Date("2020-09-30"),
      "filesize": "188264",
      "report_group_sort_order_nbr": 0,
      "report_group_id": 3
    }]),
    getLatestReport: jest.fn().mockImplementation(() => ({
      "path": "/downloads/mspd_reports/opdm092020.pdf",
      "report_group_desc": "Entire (.pdf)",
      "report_date": new Date("2020-09-30"),
      "filesize": "188264",
      "report_group_sort_order_nbr": 0,
      "report_group_id": 3
    })),
    getDateLabelForReport: jest.fn().mockImplementation(() => "Sept 2020")
  };
});
jest.mock('../../variables.module.scss', () => {
  return {
    breakpointSm: 600
  }
})

describe('DatasetData', () => {
  global.console.error = jest.fn();
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiData)
    })
  });

  const analyticsSpy = jest.spyOn(Analytics, 'event');

  let component;
  let instance;
  const setSelectedTableMock = jest.fn();
  const urlRewriteSpy = jest.spyOn(DatasetDataHelpers, 'rewriteUrl');
  const fetchSpy = jest.spyOn(global, 'fetch');

  beforeEach(async () => {
    await renderer.act(async () => {
      component = await renderer.create(
        <DatasetDataComponent
          config={config}
          width={2000}
          setSelectedTableProp={setSelectedTableMock}
          location={mockLocation}
        />
      );
      instance = component.root;
    });
  });

  afterEach(() => {
    fetchSpy.mockClear();
    global.fetch.mockClear();
    analyticsSpy.mockClear();
    global.console.error.mockClear();
  });

  const updateTable = async (tableName) => {
    const fdSectionInst = instance.findByType(FilterAndDownload);
    const toggleBtn = fdSectionInst.findByProps({ 'name': 'dropdownToggle' });
    await renderer.act(() => {
      toggleBtn.props.onClick()
    });
    instance.findByProps({ 'data-testid': 'selectorList' }); // will throw error if not found
    const dropdownOptions = instance.findAllByProps({
      'data-testid': 'selector-option'
    });
    await renderer.act(async () => {
      const opt = dropdownOptions.find(ddo => ddo.props.children === tableName);
      await opt.props.onClick();
    });
    return dropdownOptions;
  };

  it(`renders the DatasetData component which has the expected title text at desktop mode`,
    () => {
      const { getByTestId } = render(
        <DatasetDataComponent
          config={config}
          width={2000}
          setSelectedTableProp={setSelectedTableMock}
          location={mockLocation}
        />
      );
      const title = getByTestId('sectionHeader');
      expect(title.innerHTML).toBe('Preview &amp; Download');
    });

  it(`renders the expected title at table/mobile mode`, async () => {
    const { getByTestId } = render(
      <DatasetDataComponent
        config={config}
        width={500}
        setSelectedTableProp={setSelectedTableMock}
      />
    );
    const title = getByTestId('sectionHeader');
    expect(title.innerHTML).toBe(tabletMobileTitle);
  });

  it(`contains a FilterAndDownload component`, () => {
    expect(instance.findByType(FilterAndDownload)).toBeDefined();
  });

  it(`contains a DataTableSelect component with defaulted props`, () => {
    expect(instance.findByType(DataTableSelect).props.apis).toBe(config.apis);
  });

  it(`initializes the selected table to the first element in the apis array`, () => {
    expect(instance.findByType(FilterAndDownload).props.selectedTable.tableName)
    .toBe(config.apis[0].tableName);
  });

  it('calls rewriteUrl to append the table name but does not send a lastUrl' +
    '(in order to prevent triggering an analytics hit)', () => {
    expect(urlRewriteSpy).toHaveBeenNthCalledWith(1, config.apis[0], '/mock-dataset/', {
      pathname: '/datasets/mock-dataset/'
    });
  });

  it('selects the correct table when it is specified in the url', async () => {
    const setSelectedTableFromUrl = jest.fn();
    render(
      <DatasetDataComponent
        config={config}
        width={2000}
        setSelectedTableProp={setSelectedTableFromUrl}
        location={mockLocationWithTablePathName}
      />
    );

    expect(setSelectedTableFromUrl).toHaveBeenCalledWith(config.apis[2])
  });

  it(`initializes the dateRange to the appropriate values`, () => {
    const dateRange = instance.findByType(FilterAndDownload).props.dateRange;
    const from = format(dateRange.from, 'yyyy-MM-dd');
    const to = format(dateRange.to, 'yyyy-MM-dd');
    expect(to).toContain(latestDate);
    // should be previous 5 years since the earliestDate is more than 5 years
    expect(from).toContain(fivePrior);
  });

  it(`updates date range to appropriate values when new table is selected`, async () => {
    await updateTable('Table 3');
    const dateRange = instance.findAllByType(FilterAndDownload)
    .find(dr => dr.props && dr.props.dateRange !== undefined).props.dateRange;
    const from = format(dateRange.from, 'yyyy-MM-dd');
    const to = format(dateRange.to, 'yyyy-MM-dd');
    expect(to).toContain(latestDate);
    // should be earliestDate since the earliestDate is less than 5 years
    expect(from).not.toContain(fivePrior);
  });

  it(`sends the updated props to FilterAndDownload component when a new data table is
  selected`, async () => {
    const dropdownOptions = await updateTable('Table 2');
    expect(dropdownOptions.length).toBe(11);
    expect(instance.findByType(FilterAndDownload).props.selectedTable.tableName)
    .toBe(config.apis[1].tableName);
  });

  it(`records an analytics event when a new table is selected`, async () => {
    await updateTable('Table 2');
    expect(analyticsSpy).toHaveBeenLastCalledWith({
      category: 'Data Table Selector',
      action: 'Pick Table Click',
      label: 'Table 2'
    });
  });

  it(`correctly prepares pivoted data without aggregation`, () => {
    const pivotedData = pivotData(
      mockPivotableData,
      'reporting_date',
      {
        dimensionField: 'security_desc',
        title: 'by sec type'
      },
      'avg_interest_rate_amt',
      null,
      '2016-03-25',
      '2021-03-25'
    );
    expect(pivotedData).toMatchSnapshot();

    // ensure that when some columns are not populated on some rows,
    // all columns are still captured in the meta.dataTypes & meta.labels
    const dataTypes = Object.keys(pivotedData.meta.dataTypes)
    expect(dataTypes.length).toEqual(9);
    expect(dataTypes.includes('Treasury Nickels')).toBeTruthy();
    expect(pivotedData.meta.labels['Treasury Nickels']).toEqual('Treasury Nickels');
    expect(dataTypes.includes('Treasury Notes')).toBeTruthy();
    expect(pivotedData.meta.labels['Treasury Notes']).toEqual('Treasury Notes');
  });

  it(`correctly prepares pivoted data with aggregation and summing and handles non-numeric
  values`, () => {
    const mockPivotView = {dimensionField: 'class_desc', title: 'By Classification'};

    const mockAggregation = [
      {
        field: 'record_calendar_year',
        type: 'YEAR'
      },
      {
        field: 'record_calendar_month',
        type: 'MONTH'
      }
    ];

    const pivotedData = pivotData(mockAccumulableData, 'reporting_date',
      mockPivotView, 'cost', mockAggregation, '2020-01-01', '2021-03-25');
    expect(pivotedData).toMatchSnapshot();

    // ensure that the summing operation occurs instead of using lastRow snapshots
    expect(pivotedData.data[0]['Federal Bank'].toFixed(4)).toEqual('1010.1010');
    expect(pivotedData.data[1]['Medical Safe'].toFixed(4)).toEqual('3000000.7000');
  });

  it(`correctly prepares pivoted data with aggregation when configured with
  lastRowSnapshot=true`, () => {
    const mockPivotView = {
      dimensionField: 'class_desc',
      title: 'By Classification',
      lastRowSnapshot: true
    };

    const mockAggregation = [
      {
        field: 'record_calendar_year',
        type: 'YEAR'
      },
      {
        field: 'record_calendar_month',
        type: 'MONTH'
      }
    ];

    const pivotedData = pivotData(mockAccumulableData, 'reporting_date',
      mockPivotView, 'cost', mockAggregation, '2020-01-01', '2021-03-25');

    // ensure that last Row values are used, rather that cross-row summing
    const lastRowForMayFedBankVal = mockAccumulableData.data[0]['cost']; // '1000.0000'
    expect(pivotedData.data[0]['Federal Bank']).toStrictEqual(lastRowForMayFedBankVal);
    const lastRowForAprilMedSafeVal = mockAccumulableData.data[11]['cost'];  // '2000000'
    expect(pivotedData.data[1]['Medical Safe']).toStrictEqual(lastRowForAprilMedSafeVal);
  });


  it(`does not pass the pagination endpoint to DTGTable when the rowCount is above 5000
  and an a pivot dimension IS active`, async () => {
    await updateTable('Table 5');
    const tableSectionContainer = instance.findAllByType(TableSectionContainer)
    .find(tsc => tsc.props && tsc.props.config !== undefined);
    expect(tableSectionContainer.props.serverSidePagination).toBe(null);
    expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn.length).toEqual(2);
    expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn[0].field)
    .toEqual('record_calendar_year');
  });

  it(`passes the endpoint to DTGTable for serverside loading when the rowCount is above
    the large table threshold and no pivot dimension or complete table chart is
    is active`, async () => {
    await updateTable('Table 2');
    let tableSectionContainer = instance.findAllByType(TableSectionContainer)
    .find(tsc => tsc.props && tsc.props.config !== undefined);
    expect(tableSectionContainer.props.serverSidePagination).toBeNull();
    await updateTable('Table 4');
    tableSectionContainer = instance.findAllByType(TableSectionContainer)
    .find(tsc => tsc.props && tsc.props.config !== undefined);
    expect(tableSectionContainer.props.serverSidePagination).toBe('mockEndpoint4');
  });

  it(`does not send the endpoint to DTGTable for serverside loading when the rowCount is above
    the large table threshold but the Complete Table view is chartable`, async () => {
    await updateTable('Table 9');
    const tableSectionContainer = instance.findAllByType(TableSectionContainer)
    .find(tsc => tsc.props && tsc.props.config !== undefined);
    expect(tableSectionContainer.props.serverSidePagination).toBeNull();
  });

  it(`raises state on setSelectedTable when the table is updated`, async() => {
    await updateTable('Table 5');
    expect(setSelectedTableMock).toHaveBeenCalledWith(config.apis[4]);
  });

  it(`calls rewriteUrl with correct args including a lastUrl arg when the table is updated
  interactively`, async() => {
    const spy = jest.spyOn(DatasetDataHelpers, 'rewriteUrl');
    await updateTable('Table 5');
    expect(spy).toHaveBeenCalledWith(
      config.apis[4],
      '/mock-dataset/',
      {
        pathname: '/datasets/mock-dataset/'
      }
    );
  });

  it(`does not duplicate API calls when a user switches between two tables with
  paginated data`, async () => {
    jest.useFakeTimers();
    await updateTable('Table 7'); // select one paginated table
    await updateTable('Table 6'); // then change the selection to another paginated table
    // to await makePagedRequest() debounce timer in DtgTable
    await jest.advanceTimersByTime(800);
    await updateTable('Table 7');
    // confirm that the second table's api url was called only once
    const callsToApiForUpdatedTable = fetchSpy.mock.calls
    .filter(callSig => callSig[0].indexOf('/mockEndpoint6?') !== -1);
    // With paginated tables, 2 extra calls are now made to get data for react-table implementation
    expect(callsToApiForUpdatedTable.length).toEqual(7);
  });

  it(`does not duplicate api calls when switching from a large table to a small one`,
    async () => {
      jest.useFakeTimers();
      await updateTable('Table 7'); // select one paginated table
      await updateTable('Table 8'); // then change the selection to a non-paginated table
      // to await makePagedRequest() debounce timer in DtgTable
      const callsToApiForUpdatedTable = fetchSpy.mock.calls
      .filter(callSig => callSig[0].indexOf('/mockEndpoint8?') !== -1);
      expect(callsToApiForUpdatedTable.length).toEqual(1);
    });

  it(`includes ReportDataToggle on the page`, async () => {
    const toggleReport = instance.findByType(ReportDataToggle);

    expect(typeof toggleReport.props.onChange).toBe('function');
    expect(Array.isArray(toggleReport.props.reports)).toBeTruthy();
  });

  it(`includes ReportDataToggle on the page`, () => {
    const toggleReport = instance.findByType(ReportDataToggle);

    expect(typeof toggleReport.props.onChange).toBe('function');
    expect(Array.isArray(toggleReport.props.reports)).toBeTruthy();
  });

  it(`grabs the published reports from the publishedReports prop if the dataset is whitelisted`,
    async () => {

      const origId = config.datasetId;
      const mockDatasetId = Object.keys(mockPublishedReportsMTS)[0];
      if (whiteListIds && whiteListIds.length) {
        config.datasetId = whiteListIds[0];
      }

      getPublishedDates.mockClear();

      await renderer.act(async () => {
        await renderer.create(
          <DatasetDataComponent
            config={config}
            setSelectedTableProp={setSelectedTableMock}
            publishedReportsProp={mockPublishedReportsMTS[mockDatasetId]}
          />
        );
      });
      expect(getPublishedDates).toBeCalledTimes(1);
      expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReportsMTS[mockDatasetId]);

      config.datasetId = origId;
    });

  it(`published report dates are refreshed when the published reports `, async () => {
    const mockDatasetId = Object.keys(mockPublishedReportsMTS)[0];
    const mockPublishedReports = mockPublishedReportsMTS[mockDatasetId];
    getPublishedDates.mockClear();
    const { rerender } = render(
      <DatasetDataComponent config={config}
                            setSelectedTableProp={setSelectedTableMock}
                            publishedReportsProp={mockPublishedReports}
      />);
    expect(getPublishedDates).toBeCalledTimes(1);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReports);

    const updatedMockPublishedReportsMTS = [
      {
        "path": "/downloads/mts_reports/mts102020.pdf",
        "report_group_desc": "Entire (.pdf)",
        "report_date": "2020-10-30",
        "filesize": "188264",
        "report_group_sort_order_nbr": 0,
        "report_group_id": 3
      },
      {
        "path": "/downloads/mts_reports/mts102020.xls",
        "report_group_desc": "Primary Dealers (.xls)",
        "report_date": "2020-10-30",
        "filesize": "810496",
        "report_group_sort_order_nbr": 1,
        "report_group_id": 3
      },
      ...mockPublishedReports
    ];

    rerender(
      <DatasetDataComponent config={config}
                            setSelectedTableProp={setSelectedTableMock}
                            publishedReportsProp={updatedMockPublishedReportsMTS}
      />);

    expect(getPublishedDates).toBeCalledTimes(2);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReports);

  });

  it(`passes down the captured published reports to the PublishedReports component`, async () => {
    let rgInstance = null;
    await renderer.act(async () => {
      const comp = await renderer.create(
        <DatasetDataComponent
          config={config}
          publishedReportsProp={['mockReports Array']}
          setSelectedTableProp={setSelectedTableMock}
        />
      );
      rgInstance = comp.root;
    });

    // select tab to instantiate <PublishedReport /> and test the reports property passed in
    const toggleReport = rgInstance.findByType(ReportDataToggle).props.onChange;
    await renderer.act(async () => {
      await toggleReport(2);
    });
    const publishedReportsTab = rgInstance.findByType(PublishedReports);
    expect(publishedReportsTab.props.reports.length).toBe(1);
  });

  it(`transmits a preview-loaded analytics event when reports tab is first selected but not when
  toggling back and forth reveals a preview that was already loaded`, async () => {
    analyticsSpy.mockClear();

    const { getByLabelText } = render(
      <DatasetDataComponent
        config={config}
        publishedReportsProp={reports.slice()}
        setSelectedTableProp={setSelectedTableMock}
      />
    );

    // it's not called at at page load
    expect(analyticsSpy
      .mock
      .calls
      .every(callGroup => callGroup.every(call => call.action !== 'load pdf preview'))
    ).toBeTruthy();

    // select tab to instantiate <PublishedReport />
    // and test that analytics was called to transmit a preview-loaded event
    const rawDataButton = getByLabelText('Raw Data');
    const publishedReportsButton = getByLabelText('Published Reports');

    fireEvent.click(publishedReportsButton);

    expect(analyticsSpy).toHaveBeenLastCalledWith({
      "action": "load pdf preview",
      "category": "Published Report Preview",
      "value": "/downloads/mspd_reports/opdm092020.pdf"
    });
    analyticsSpy.mockClear();
    expect(analyticsSpy).not.toHaveBeenCalled();
    // go back to raw data
    fireEvent.click(rawDataButton);

    // and then back again to published reports
    fireEvent.click(publishedReportsButton);

    // expect that no duplicate event for report preview-loading will have been transmitted
    expect(analyticsSpy).not.toHaveBeenCalled();
  });

  it(`keeps the rows per page selection when a pivot is updated`, async() => {
    await updateTable('Table 4');
    jest.runAllTimers();

    const tableSectionContainer = instance.findByType(TableSectionContainer);
    const pagingOptionsMenu = instance.findByType(PagingOptionsMenu);
    expect(pagingOptionsMenu.props.menuProps.selected).toBe(5);
    expect(tableSectionContainer).toBeDefined();

    pagingOptionsMenu.props.menuProps.updateSelected(2);
    jest.runAllTimers();

    expect(pagingOptionsMenu.props.menuProps.selected).toBe(2);

    tableSectionContainer.props.setSelectedPivot({ pivotView:
        { chartType: null, 'dimensionField': 'birthplace', title: 'By Facility' },
      pivotValue: 'age' });

    jest.runAllTimers();

    expect(tableSectionContainer.props.perPage).toBe(2);
  });

  it(`does not reload data from an api when switching from complete table view to a pivot
  view and back when pivoting a non-large table`, async() => {
    jest.useFakeTimers();
    await updateTable('Table 3'); // select one paginated table
    jest.runAllTimers();
    await updateTable('Table 10'); // then change the selection to another paginated table
    await jest.advanceTimersByTime(500); // to await makePagedRequest() debounce timer in DtgTable

    // confirm that the second table's api url was called only once
    const callsToApiForUpdatedTable = fetchSpy
    .mock
    .calls
    .filter(callSig => callSig[0].indexOf('/mockEndpoint10?') !== -1);
    expect(callsToApiForUpdatedTable.length).toEqual(1);

    // update from complete table to a pivoted view
    const tableSectionContainer = instance.findByType(TableSectionContainer);
    tableSectionContainer.props.setSelectedPivot({
      pivotView: {
        chartType: null,
        dimensionField: 'facility_desc',
        title: 'By Facility'
      },
      pivotValue: {
        columnName: 'published_count'
      }
    });
    jest.runAllTimers();

    // confirm that the second table's api url has still only been called once
    const callsToApiForUpdatedPivot = fetchSpy
    .mock
    .calls
    .filter(callSig => callSig[0].indexOf('/mockEndpoint10?') !== -1);
    expect(callsToApiForUpdatedPivot.length).toEqual(1);

    // update back to non-pivoted Complete Table view
    tableSectionContainer.props.setSelectedPivot({
      chartType: 'none',
      dimensionField: null,
      title: 'Complete Table'
    });
    jest.runAllTimers();

    // confirm the endpoint has still not been called when returning to the complete table view
    const callsToApiForRevertToCompleteTableView = fetchSpy
    .mock
    .calls
    .filter(callSig => callSig[0].indexOf('/mockEndpoint10?') !== -1);
    expect(callsToApiForRevertToCompleteTableView.length).toEqual(1);
  });

  it(`correctly notifies the download control when all tables are selected`, () => {
    const datatableSelect = instance.findByType(DataTableSelect);
    const downloadWrapper = instance.findByType(DownloadWrapper);
    expect(downloadWrapper.props.allTablesSelected).toBeFalsy();
    datatableSelect.props.setSelectedTable({allDataTables: true});
    const downloadWrapperAfter = instance.findByType(DownloadWrapper);
    expect(downloadWrapperAfter.props.allTablesSelected).toBeTruthy();
  });

  it('supplies the dataset\'s full dateRange to RangePresets', () => {
    const rangePresets = instance.findByType(RangePresets);
    expect(rangePresets.props.datasetDateRange).toEqual({
      "earliestDate": "2002-01-01",
      "latestDate": "2020-04-13"
    });
  });

  it(`reflects whether "All Tables" is selected to RangePresets`, async () => {
    const datatableSelect = instance.findByType(DataTableSelect);

    // passing down a falsy value to range Presets initially
    let rangePresets = instance.findByType(RangePresets);
    expect(rangePresets.props.allTablesSelected).toBeFalsy();

    // select the All Tables option, and confirm the tables have been sent to Range Presets
    datatableSelect.props.setSelectedTable({allDataTables: true});
    rangePresets = instance.findByType(RangePresets);
    expect(rangePresets.props.allTablesSelected).toBeTruthy();

    // confirm that switching back to a single selected table makes downloadTables falsy again
    await updateTable('Table 2');
    rangePresets = instance.findByType(RangePresets);
    expect(rangePresets.props.allTablesSelected).toBeFalsy();
  });
});
