import React from 'react';
import { pivotData } from '../../utils/api-utils';
import {
  bannerTableConfig,
  config,
  mockAccumulableData,
  mockApiData,
  mockLocation,
  mockLocationWithTablePathName,
  mockPivotableData,
  noPivotConfig,
} from '../../components/dataset-data/test-helper';
import * as DatasetDataHelpers from '../../components/dataset-data/dataset-data-helper/dataset-data-helper';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import Analytics from '../../utils/analytics/analytics';
import { mockPublishedReportsMTS, whiteListIds } from '../../helpers/published-reports/published-reports';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { DataPreview } from './data-preview';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
// jest.mock('../truncate/truncate.jsx', () => () => 'Truncator');
jest.mock('../../helpers/dataset-detail/report-helpers', function() {
  return {
    __esModule: true,
    formatReportDate: jest.fn().mockImplementation(),
    getPublishedDates: jest.fn().mockImplementation(() => [
      {
        path: '/downloads/mspd_reports/opdm092020.pdf',
        report_group_desc: 'Entire (.pdf)',
        report_date: new Date('2020-09-30'),
        filesize: '188264',
        report_group_sort_order_nbr: 0,
        report_group_id: 3,
      },
    ]),
    getLatestReport: jest.fn().mockImplementation(() => ({
      path: '/downloads/mspd_reports/opdm092020.pdf',
      report_group_desc: 'Entire (.pdf)',
      report_date: new Date('2020-09-30'),
      filesize: '188264',
      report_group_sort_order_nbr: 0,
      report_group_id: 3,
    })),
    getDateLabelForReport: jest.fn().mockImplementation(() => 'Sept 2020'),
  };
});
jest.mock('../../variables.module.scss', () => {
  return {
    breakpointSm: '600px',
    breakpointLg: '992px',
  };
});

describe('DataPreview', () => {
  global.console.error = jest.fn();
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    });
  });

  const analyticsSpy = jest.spyOn(Analytics, 'event');
  const setSelectedTableMock = jest.fn();
  const urlRewriteSpy = jest.spyOn(DatasetDataHelpers, 'rewriteUrl');
  const fetchSpy = jest.spyOn(global, 'fetch');

  afterEach(() => {
    fetchSpy.mockClear();
    global.fetch.mockClear();
    analyticsSpy.mockClear();
  });

  it(`renders the DataPreview component which has the expected title text at desktop mode`, () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const title = getByRole('heading', { level: 2 });
    expect(title.innerHTML).toBe('Data Preview');
  });

  it(`contains a DataPreviewFilterSection component`, async () => {
    const { findByTestId } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const filterDownload = await findByTestId('filterDownloadContainer');
    expect(filterDownload).toBeInTheDocument();
  });

  it(`contains a DataTableSelect component with api options`, () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const dataTableSelect = getByRole('button', { name: 'Data Table: Table 1' });
    userEvent.click(dataTableSelect);
    const tableOneSelect = getByRole('button', { name: 'Table 1' });
    const tableTwoSelect = getByRole('button', { name: 'Table 2' });
    const tableFourSelect = getByRole('button', { name: 'Table 4' });
    const tableTenSelect = getByRole('button', { name: 'Table 10' });
    expect(tableOneSelect).toBeInTheDocument();
    expect(tableTwoSelect).toBeInTheDocument();
    expect(tableFourSelect).toBeInTheDocument();
    expect(tableTenSelect).toBeInTheDocument();
  });

  it(`initializes the selected table to the first element in the apis array`, () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    //selected table name will display within dropdown button
    const tableSelect = getByRole('button', { name: `Data Table: ${config.apis[0].tableName}` });
    expect(tableSelect).toBeInTheDocument();
  });

  it('calls rewriteUrl to append the table name but does not send a lastUrl (in order to prevent triggering an analytics hit)', () => {
    render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    expect(urlRewriteSpy).toHaveBeenNthCalledWith(1, config.apis[0], '/mock-dataset/', {
      pathname: '/datasets/mock-dataset/',
    });
  });

  it('selects the correct table when it is specified in the url', async () => {
    const setSelectedTableFromUrl = jest.fn();
    render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableFromUrl} location={mockLocationWithTablePathName} />
      </RecoilRoot>
    );

    expect(setSelectedTableFromUrl).toHaveBeenCalledWith(config.apis[2]);
  });

  // it(`initializes the dateRange to the appropriate values`, () => {
  //   const dateRange = instance.findByType(DataPreviewFilterSection).props.dateRange;
  //   const from = format(dateRange.from, 'yyyy-MM-dd');
  //   const to = format(dateRange.to, 'yyyy-MM-dd');
  //   expect(to).toContain(latestDate);
  //   // should be previous 5 years since the earliestDate is more than 5 years
  //   expect(from).toContain(fivePrior);
  // });

  // it(`updates date range to appropriate values when new table is selected`, async () => {
  //   await updateTable('Table 3');
  //   const dateRange = instance.findAllByType(DataPreviewFilterSection).find(dr => dr.props && dr.props.dateRange !== undefined).props.dateRange;
  //   const from = format(dateRange.from, 'yyyy-MM-dd');
  //   const to = format(dateRange.to, 'yyyy-MM-dd');
  //   expect(to).toContain(latestDate);
  //   // should be earliestDate since the earliestDate is less than 5 years
  //   expect(from).not.toContain(fivePrior);
  // });
  //
  // it(`sends the updated props to DataPreviewFilterSection  component when a new data table is
  // selected`, async () => {
  //   const dropdownOptions = await updateTable('Table 2');
  //   expect(dropdownOptions.length).toBe(12);
  //   expect(instance.findByType(DataPreviewFilterSection).props.selectedTable.tableName).toBe(config.apis[1].tableName);
  // });
  //
  // it(`records an analytics event when a new table is selected`, async () => {
  //   await updateTable('Table 2');
  //   expect(analyticsSpy).toHaveBeenLastCalledWith({
  //     category: 'Data Table Selector',
  //     action: 'Pick Table Click',
  //     label: 'Table 2',
  //   });
  // });

  describe('pivot functionality', () => {
    const mockAggregation = [
      {
        field: 'record_calendar_year',
        type: 'YEAR',
      },
      {
        field: 'record_calendar_month',
        type: 'MONTH',
      },
    ];

    it('display selected pivot with the table name', () => {
      const { getByRole } = render(
        <RecoilRoot>
          <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
        </RecoilRoot>
      );

      const tableSelect = getByRole('button', { name: `Data Table: ${config.apis[0].tableName}` });
      fireEvent.click(tableSelect);

      const pivotSelect = getByRole('radio', { name: 'Pivot Data' });
      fireEvent.click(pivotSelect);

      const apply = getByRole('button', { name: 'Apply' });
      fireEvent.click(apply);

      const tableName = getByRole('heading', { level: 3 });

      expect(within(tableName).getByText('Table 1: Opening Balance Today (By Facility)')).toBeInTheDocument();
    });

    it(`correctly prepares pivoted data without aggregation`, () => {
      const pivotedData = pivotData(
        mockPivotableData,
        'reporting_date',
        {
          dimensionField: 'security_desc',
          title: 'by sec type',
        },
        'avg_interest_rate_amt',
        null,
        '2016-03-25',
        '2021-03-25'
      );
      expect(pivotedData).toMatchSnapshot();

      // ensure that when some columns are not populated on some rows,
      // all columns are still captured in the meta.dataTypes & meta.labels
      const dataTypes = Object.keys(pivotedData.meta.dataTypes);
      expect(dataTypes.length).toEqual(9);
      expect(dataTypes.includes('Treasury Nickels')).toBeTruthy();
      expect(pivotedData.meta.labels['Treasury Nickels']).toEqual('Treasury Nickels');
      expect(dataTypes.includes('Treasury Notes')).toBeTruthy();
      expect(pivotedData.meta.labels['Treasury Notes']).toEqual('Treasury Notes');
    });

    it(`correctly prepares pivoted data with aggregation and summing and handles non-numeric values`, () => {
      const mockPivotView = { dimensionField: 'class_desc', title: 'By Classification' };

      const pivotedData = pivotData(mockAccumulableData, 'reporting_date', mockPivotView, 'cost', mockAggregation, '2020-01-01', '2021-03-25');
      expect(pivotedData).toMatchSnapshot();

      // ensure that the summing operation occurs instead of using lastRow snapshots
      expect(pivotedData.data[0]['Federal Bank'].toFixed(4)).toEqual('1010.1010');
      expect(pivotedData.data[1]['Medical Safe'].toFixed(4)).toEqual('3000000.7000');
    });

    it(`correctly prepares pivoted data with aggregation when configured with lastRowSnapshot=true`, () => {
      const mockPivotView = {
        dimensionField: 'class_desc',
        title: 'By Classification',
        lastRowSnapshot: true,
      };

      const pivotedData = pivotData(mockAccumulableData, 'reporting_date', mockPivotView, 'cost', mockAggregation, '2020-01-01', '2021-03-25');

      // ensure that last Row values are used, rather that cross-row summing
      const lastRowForMayFedBankVal = mockAccumulableData.data[0]['cost']; // '1000.0000'
      expect(pivotedData.data[0]['Federal Bank']).toStrictEqual(lastRowForMayFedBankVal);
      const lastRowForAprilMedSafeVal = mockAccumulableData.data[11]['cost']; // '2000000'
      expect(pivotedData.data[1]['Medical Safe']).toStrictEqual(lastRowForAprilMedSafeVal);
    });
  });

  //TODO: Adjust unit tests to fit new design

  // it(`does not pass the pagination endpoint to DTGTable when the rowCount is above 5000
  // and an a pivot dimension IS active`, async () => {
  //   await updateTable('Table 5');
  //   const tableSectionContainer = instance.findAllByType(TableSectionContainer).find(tsc => tsc.props && tsc.props.config !== undefined);
  //   expect(tableSectionContainer.props.serverSidePagination).toBe(null);
  //   expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn.length).toEqual(2);
  //   expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn[0].field).toEqual('record_calendar_year');
  // });

  // it(`passes the endpoint to DTGTable for serverside loading when the rowCount is above
  //   the large table threshold and no pivot dimension or complete table chart is
  //   is active`, async () => {
  //   await updateTable('Table 2');
  //   let tableSectionContainer = instance.findAllByType(TableSectionContainer).find(tsc => tsc.props && tsc.props.config !== undefined);
  //   expect(tableSectionContainer.props.serverSidePagination).toBeNull();
  //   await updateTable('Table 4');
  //   tableSectionContainer = instance.findAllByType(TableSectionContainer).find(tsc => tsc.props && tsc.props.config !== undefined);
  //   expect(tableSectionContainer.props.serverSidePagination).toBe('mockEndpoint4');
  // });
  //
  // it(`does not send the endpoint to DTGTable for serverside loading when the rowCount is above
  //   the large table threshold but the Complete Table view is chartable`, async () => {
  //   await updateTable('Table 9');
  //   const tableSectionContainer = instance.findAllByType(TableSectionContainer).find(tsc => tsc.props && tsc.props.config !== undefined);
  //   expect(tableSectionContainer.props.serverSidePagination).toBeNull();
  // });
  //
  // it(`raises state on setSelectedTable when the table is updated`, async () => {
  //   await updateTable('Table 5');
  //   expect(setSelectedTableMock).toHaveBeenCalledWith(config.apis[4]);
  // });
  //
  // it(`calls rewriteUrl with correct args including a lastUrl arg when the table is updated
  // interactively`, async () => {
  //   const spy = jest.spyOn(DatasetDataHelpers, 'rewriteUrl');
  //   await updateTable('Table 5');
  //   expect(spy).toHaveBeenCalledWith(config.apis[4], '/mock-dataset/', {
  //     pathname: '/datasets/mock-dataset/',
  //   });
  // });
  //
  it(`does not duplicate API calls when a user switches between two tables with paginated data`, async () => {
    jest.useFakeTimers();
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    // select one paginated table
    const tableSelect = getByRole('button', { name: 'Data Table: Table 1' });
    fireEvent.click(tableSelect);
    fireEvent.click(getByRole('button', { name: 'Table 7' }));
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    // then change the selection to another paginated table
    fireEvent.click(tableSelect);
    fireEvent.click(getByRole('button', { name: 'Table 6' }));
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    // to await makePagedRequest() debounce timer in DtgTable
    await jest.advanceTimersByTime(800);

    fireEvent.click(tableSelect);
    fireEvent.click(getByRole('button', { name: 'Table 7' })); // confirm that the second table's api url was called only once
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    const callsToApiForUpdatedTable = fetchSpy.mock.calls.filter(callSig => callSig[0].indexOf('/mockEndpoint6?') !== -1);
    expect(callsToApiForUpdatedTable.length).toEqual(1);
    fetchSpy.mockClear();
  });

  // it(`does not duplicate api calls when switching from a large table to a small one`, async () => {
  //   jest.useFakeTimers();
  //   fetchSpy.mockClear();
  //
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
  //     </RecoilRoot>
  //   );
  //   const tableSelect = getByRole('button', { name: 'Data Table: Table 1' });
  //   // select one paginated table
  //   fireEvent.click(tableSelect);
  //   fireEvent.click(getByRole('button', { name: 'Table 7' }));
  //   fireEvent.click(getByRole('button', { name: 'Apply' }));
  //
  //   // then change the selection to a non-paginated table
  //   fireEvent.click(tableSelect);
  //   fireEvent.click(getByRole('button', { name: 'Table 8' }));
  //   fireEvent.click(getByRole('button', { name: 'Apply' }));
  //   await jest.runAllTimers(); // to await makePagedRequest() debounce timer in DtgTable
  //   const callsToApiForUpdatedTable = fetchSpy.mock.calls.filter(callSig => callSig[0].indexOf('/mockEndpoint8?') !== -1);
  //   expect(callsToApiForUpdatedTable.length).toEqual(1);
  // });

  it(`grabs the published reports from the publishedReports prop if the dataset is whitelisted`, async () => {
    const origId = config.datasetId;
    const mockDatasetId = Object.keys(mockPublishedReportsMTS)[0];
    if (whiteListIds && whiteListIds.length) {
      config.datasetId = whiteListIds[0];
    }

    getPublishedDates.mockClear();
    render(
      <RecoilRoot>
        <DataPreview
          config={config}
          width={2000}
          setSelectedTableProp={setSelectedTableMock}
          location={mockLocation}
          publishedReportsProp={mockPublishedReportsMTS[mockDatasetId]}
        />
      </RecoilRoot>
    );
    expect(getPublishedDates).toBeCalledTimes(1);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReportsMTS[mockDatasetId]);

    config.datasetId = origId;
  });

  it(`published report dates are refreshed when the published reports `, async () => {
    const mockDatasetId = Object.keys(mockPublishedReportsMTS)[0];
    const mockPublishedReports = mockPublishedReportsMTS[mockDatasetId];
    getPublishedDates.mockClear();
    const { rerender } = render(
      <RecoilRoot>
        <DataPreview config={config} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={mockPublishedReports} />
      </RecoilRoot>
    );
    expect(getPublishedDates).toBeCalledTimes(1);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReports);

    const updatedMockPublishedReportsMTS = [
      {
        path: '/downloads/mts_reports/mts102020.pdf',
        report_group_desc: 'Entire (.pdf)',
        report_date: '2020-10-30',
        filesize: '188264',
        report_group_sort_order_nbr: 0,
        report_group_id: 3,
      },
      {
        path: '/downloads/mts_reports/mts102020.xls',
        report_group_desc: 'Primary Dealers (.xls)',
        report_date: '2020-10-30',
        filesize: '810496',
        report_group_sort_order_nbr: 1,
        report_group_id: 3,
      },
      ...mockPublishedReports,
    ];

    rerender(
      <RecoilRoot>
        <DataPreview config={config} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={updatedMockPublishedReportsMTS} />
      </RecoilRoot>
    );

    expect(getPublishedDates).toBeCalledTimes(2);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReports);
  });

  // it(`transmits a preview-loaded analytics event when reports tab is first selected but not when
  // toggling back and forth reveals a preview that was already loaded`, async () => {
  //   analyticsSpy.mockClear();
  //
  //   const { getByLabelText } = render(
  //     <RecoilRoot>
  //       <DataPreview config={config} publishedReportsProp={reports.slice()} setSelectedTableProp={setSelectedTableMock} />
  //     </RecoilRoot>
  //   );
  //
  //   // it's not called at at page load
  //   expect(analyticsSpy.mock.calls.every(callGroup => callGroup.every(call => call.action !== 'load pdf preview'))).toBeTruthy();
  //
  //   // select tab to instantiate <PublishedReport />
  //   // and test that analytics was called to transmit a preview-loaded event
  //   const rawDataButton = getByLabelText('Raw Data');
  //   const publishedReportsButton = getByLabelText('Published Reports');
  //
  //   fireEvent.click(publishedReportsButton);
  //
  //   expect(analyticsSpy).toHaveBeenLastCalledWith({
  //     action: 'Published Report Preview',
  //     category: 'Published Report Preview',
  //     label: '/downloads/mspd_reports/opdm092020.pdf',
  //   });
  //   analyticsSpy.mockClear();
  //   expect(analyticsSpy).not.toHaveBeenCalled();
  //   // go back to raw data
  //   fireEvent.click(rawDataButton);
  //
  //   // and then back again to published reports
  //   fireEvent.click(publishedReportsButton);
  //
  //   // expect that no duplicate event for report preview-loading will have been transmitted
  //   expect(analyticsSpy).not.toHaveBeenCalled();
  // });

  // it(`correctly notifies the download control when all tables are selected`, () => {
  //   const datatableSelect = instance.findByType(DataTableSelect);
  //   const downloadWrapper = instance.findByType(DataPreviewDownload);
  //   expect(downloadWrapper.props.allTablesSelected).toBeFalsy();
  //   datatableSelect.props.setSelectedTable({ allDataTables: true });
  //   const downloadWrapperAfter = instance.findByType(DataPreviewDownload);
  //   expect(downloadWrapperAfter.props.allTablesSelected).toBeTruthy();
  // });

  //TODO we need to add this test back end. its currently failing related to a bug in the custom date range picker.

  // it("supplies the dataset's full dateRange to DateRangeFilter  ", () => {
  //   const { getByRole, queryByRole } = render(
  //     <RecoilRoot>
  //       <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
  //     </RecoilRoot>
  //   );
  //   const filtersDropdown = getByRole('button', { name: 'Filters: 0 applied' });
  //   fireEvent.click(filtersDropdown);
  //   fireEvent.click(getByRole('button', { name: 'Record Date No filter selected' }));
  //   fireEvent.click(getByRole('radio', { name: 'Preset' }));
  //   fireEvent.click(getByRole('radio', { name: 'All' }));
  //   fireEvent.click(getByRole('radio', { name: 'Custom' }));
  //   const fromDatePicker = getByRole('button', { name: 'Select Start Date' });
  //   fireEvent.click(fromDatePicker);
  //   const fromDateYearEntry = getByRole('combobox', { name: 'Year:' });
  //   fireEvent.click(fromDateYearEntry);
  //   expect(getByRole('option', { name: '2002' })).toBeInTheDocument();
  //   expect(queryByRole('option', { name: '2001' })).not.toBeInTheDocument();
  //   expect(getByRole('option', { name: '2020' })).toBeInTheDocument();
  //   expect(queryByRole('option', { name: '2021' })).not.toBeInTheDocument();
  // });

  it(`limits table filters to just record date when "All Data Tables" is selected`, async () => {
    const { getByRole, getByText } = render(
      <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={null} />,
      {
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    const columnsDropdown = getByRole('button', { name: 'Columns: 3/3' });
    const tableSelectDropdown = getByRole('button', { name: 'Data Table: Table 1' });
    fireEvent.click(tableSelectDropdown);
    fireEvent.click(getByRole('button', { name: 'All Data Tables (Download Only)' }));
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    expect(columnsDropdown).toBeDisabled();
    const allTablesBanner = getByText(`The current "All Data Tables" selection is for download only`);
    expect(allTablesBanner).toBeInTheDocument();

    // Only filter available should be record date
    const filtersDropdown = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(filtersDropdown);

    //TODO: Add back in when filters dropdown is added
    // const filterOptions = within(filtersDropdown).getByRole('button');
    // expect(filterOptions).toHaveLength(1);
  });

  it(`renders the datatable banner when datatableBanner exists`, () => {
    const bannerText = 'This is a test';
    const { getByTestId } = render(
      <RecoilRoot>
        <DataPreview config={bannerTableConfig} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    expect(getByTestId('datatable-banner')).toHaveTextContent(bannerText);
  });

  it('Updates selected table and pivot view', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreview config={config} width={2000} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={null} />
      </RecoilRoot>
    );

    //Select and apply new table and pivot
    const tableSelectDropdown = getByRole('button', { name: 'Data Table: Table 1' });
    fireEvent.click(tableSelectDropdown);

    const newTableButton = getByRole('button', { name: 'Table 2' });
    fireEvent.click(newTableButton);

    const pivotDataButton = getByRole('radio', { name: 'Pivot Data' });
    fireEvent.click(pivotDataButton);

    const pivotSelect = getByRole('button', { name: 'Select Pivot View' });
    fireEvent.click(pivotSelect);

    const newPivotView = getByRole('button', { name: 'By Facility' });
    fireEvent.click(newPivotView);
    fireEvent.click(getByRole('button', { name: 'Apply' }));

    const updatedTableSelectDropdown = getByRole('button', { name: 'Data Table: Table 2' });
    expect(updatedTableSelectDropdown).toBeInTheDocument();
  });

  it('hides data table select when there is only one api with no pivot options', () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <DataPreview config={noPivotConfig} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={null} />
      </RecoilRoot>
    );
    const tableSelectDropdown = queryByRole('button', { name: 'Data Table: Table 1' });
    expect(tableSelectDropdown).not.toBeInTheDocument();
  });
});

describe('Nested Data Table', () => {
  global.console.error = jest.fn();
  const analyticsSpy = jest.spyOn(Analytics, 'event');
  const setSelectedTableMock = jest.fn();
  const fetchSpy = jest.spyOn(global, 'fetch');

  afterEach(() => {
    fetchSpy.mockClear();
    global.fetch.mockClear();
    analyticsSpy.mockClear();
    global.console.error.mockClear();
  });

  it('Renders the summary table', async () => {
    const { findByRole } = render(
      <RecoilRoot>
        <DataPreview
          config={{ ...config, detailView: { apiId: 300 } }}
          width={2000}
          setSelectedTableProp={setSelectedTableMock}
          location={mockLocation}
        />
      </RecoilRoot>
    );
    expect(await findByRole('table')).toBeInTheDocument();
  });
});

describe('published reports', () => {
  jest.mock('../../helpers/dataset-detail/report-helpers', function() {
    return {
      __esModule: true,
      formatReportDate: jest.fn().mockImplementation(),
      getPublishedDates: jest.fn().mockImplementation(() => [
        {
          path: '/downloads/mspd_reports/opdm092020.pdf',
          report_group_desc: 'Entire (.pdf)',
          report_date: new Date('2020-09-30'),
          filesize: '188264',
          report_group_sort_order_nbr: 0,
          report_group_id: 3,
        },
      ]),
      getLatestReport: jest.fn().mockImplementation(() => ({
        path: '/downloads/mspd_reports/opdm092020.pdf',
        report_group_desc: 'Entire (.pdf)',
        report_date: new Date('2020-09-30'),
        filesize: '188264',
        report_group_sort_order_nbr: 0,
        report_group_id: 3,
      })),
      getDateLabelForReport: jest.fn().mockImplementation(() => 'Sept 2020'),
    };
  });
});
