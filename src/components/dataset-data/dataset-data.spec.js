import React from 'react';
import { DatasetDataComponent } from './dataset-data';
import { pivotData } from '../../utils/api-utils';
import {
  bannerTableConfig,
  config,
  fivePriorFormatted,
  latestDateFormatted,
  mockAccumulableData,
  mockApiData,
  mockLocation,
  mockLocationWithTablePathName,
  mockPivotableData,
} from './test-helper';
import * as DatasetDataHelpers from './dataset-data-helper/dataset-data-helper';
import { getPublishedDates } from '../../helpers/dataset-detail/report-helpers';
import Analytics from '../../utils/analytics/analytics';
import { mockPublishedReportsMTS, whiteListIds } from '../../helpers/published-reports/published-reports';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
jest.mock('../../helpers/dataset-detail/report-helpers', function() {
  return {
    __esModule: true,
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
    breakpointSm: 600,
  };
});

describe('DatasetData', () => {
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
    global.console.error.mockClear();
  });

  it(`renders the DatasetData component which has the expected title text at desktop mode`, () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const title = getByTestId('sectionHeader');
    expect(title.innerHTML).toBe('Data Preview');
  });

  it(`contains a FilterAndDownload component`, () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const filterDownload = getByTestId('filterDownloadContainer');
    expect(filterDownload).toBeInTheDocument();
  });

  it(`contains a DataTableSelect component with api options`, () => {
    const { getByRole, getAllByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const dataTableSelect = getByRole('button', { name: 'Table 1' });
    userEvent.click(dataTableSelect);
    const tableOneSelect = getAllByRole('button', { name: 'Table 1' });
    const tableTwoSelect = getByRole('button', { name: 'Table 2' });
    const tableFourSelect = getByRole('button', { name: 'Table 4' });
    const tableTenSelect = getByRole('button', { name: 'Table 10' });
    expect(tableOneSelect).toHaveLength(2); // select dropdown plus dropdown option
    expect(tableTwoSelect).toBeInTheDocument();
    expect(tableFourSelect).toBeInTheDocument();
    expect(tableTenSelect).toBeInTheDocument();
  });

  it(`initializes the selected table to the first element in the apis array`, () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    //selected table name will display within dropdown button
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    expect(tableSelect).toBeInTheDocument();
  });

  it('calls rewriteUrl to append the table name but does not send a lastUrl (in order to prevent triggering an analytics hit)', () => {
    render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
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
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableFromUrl} location={mockLocationWithTablePathName} />
      </RecoilRoot>
    );

    expect(setSelectedTableFromUrl).toHaveBeenCalledWith(config.apis[2]);
  });

  it(`initializes the dateRange to the appropriate values`, () => {
    const { getByTestId, getByText } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const filterAndDownload = getByTestId('filterDownloadContainer');
    expect(filterAndDownload).toBeInTheDocument();
    const dateRange = `${fivePriorFormatted} - ${latestDateFormatted}`;
    expect(getByText(dateRange)).toBeInTheDocument();
  });

  it(`updates date range to appropriate values when new table is selected`, async () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const dataTableSelect = getByRole('button', { name: 'Table 1' });
    userEvent.click(dataTableSelect);
    userEvent.click(getByRole('button', { name: 'Table 3' }));
    // should be earliestDate since the earliestDate is less than 5 years
    const dateRange = `04/14/2019 - ${latestDateFormatted}`;
    expect(getByText(dateRange)).toBeInTheDocument();
  });

  it(`sends the updated props to FilterAndDownload component when a new data table is selected`, async () => {
    const { getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    const dropdownOptions = getAllByTestId('dropdown-list-option');
    expect(dropdownOptions).toHaveLength(12);
    userEvent.click(dropdownOptions[2]);
    expect(getByRole('button', { name: config.apis[1].tableName })).toBeInTheDocument();
  });

  it(`records an analytics event when a new table is selected`, async () => {
    const { getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    const dropdownOptions = getAllByTestId('dropdown-list-option');
    userEvent.click(dropdownOptions[2]);
    expect(analyticsSpy).toHaveBeenLastCalledWith({
      category: 'Data Table Selector',
      action: 'Pick Table Click',
      label: 'Table 2',
    });
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

    const pivotedData = pivotData(mockAccumulableData, 'reporting_date', mockPivotView, 'cost', mockAggregation, '2020-01-01', '2021-03-25');

    // ensure that last Row values are used, rather that cross-row summing
    const lastRowForMayFedBankVal = mockAccumulableData.data[0]['cost']; // '1000.0000'
    expect(pivotedData.data[0]['Federal Bank']).toStrictEqual(lastRowForMayFedBankVal);
    const lastRowForAprilMedSafeVal = mockAccumulableData.data[11]['cost']; // '2000000'
    expect(pivotedData.data[1]['Medical Safe']).toStrictEqual(lastRowForAprilMedSafeVal);
  });

  it(`does not pass the pagination endpoint to DTGTable when the rowCount is above 5000 and a pivot dimension IS active`, async () => {
    const { getByRole, findByText } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    //Update selected table to table 5
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 5' }));
    const pivotView = getByRole('button', { name: 'Change pivot view from Complete Table' });
    userEvent.click(pivotView);
    userEvent.click(getByRole('button', { name: 'By Facility' }));
    const aggregationNotice = 'This data is aggregated by the given Time Period for the selected pivot option';
    expect(await findByText(aggregationNotice)).toBeInTheDocument();
    //TODO add assertions
    // const tableSectionContainer = instance.findAllByType(TableSectionContainer).find(tsc => tsc.props && tsc.props.config !== undefined);
    // expect(tableSectionContainer.props.serverSidePagination).toBe(null);
    // expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn.length).toEqual(2);
    // expect(tableSectionContainer.props.selectedPivot.pivotView.aggregateOn[0].field).toEqual('record_calendar_year');
  });

  it(`raises state on setSelectedTable when the table is updated`, async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    //Update selected table to table 5
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 5' }));
    expect(setSelectedTableMock).toHaveBeenCalledWith(config.apis[4]);
  });

  it(`calls rewriteUrl with correct args including a lastUrl arg when the table is updated interactively`, async () => {
    const spy = jest.spyOn(DatasetDataHelpers, 'rewriteUrl');
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    //Update selected table to table 5
    const tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 5' }));
    expect(spy).toHaveBeenCalledWith(config.apis[4], '/mock-dataset/', {
      pathname: '/datasets/mock-dataset/',
    });
  });

  it(`does not duplicate API calls when a user switches between two tables with paginated data`, async () => {
    jest.useFakeTimers();
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    // select one paginated table
    let tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 7' }));

    // then change the selection to another paginated table
    tableSelect = getByRole('button', { name: 'Table 7' });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 6' }));

    // to await makePagedRequest() debounce timer in DtgTable
    await jest.advanceTimersByTime(800);

    tableSelect = getByRole('button', { name: 'Table 6' });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 7' })); // confirm that the second table's api url was called only once
    const callsToApiForUpdatedTable = fetchSpy.mock.calls.filter(callSig => callSig[0].indexOf('/mockEndpoint6?') !== -1);
    expect(callsToApiForUpdatedTable.length).toEqual(1);
  });

  it(`does not duplicate api calls when switching from a large table to a small one`, async () => {
    jest.useFakeTimers();
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetDataComponent config={config} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    // select one paginated table
    let tableSelect = getByRole('button', { name: config.apis[0].tableName });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 7' }));

    // then change the selection to a non-paginated table
    tableSelect = getByRole('button', { name: 'Table 7' });
    userEvent.click(tableSelect);
    userEvent.click(getByRole('button', { name: 'Table 8' }));
    await jest.advanceTimersByTime(800); // to await makePagedRequest() debounce timer in DtgTable
    const callsToApiForUpdatedTable = fetchSpy.mock.calls.filter(callSig => callSig[0].indexOf('/mockEndpoint8?') !== -1);
    expect(callsToApiForUpdatedTable.length).toEqual(1);
  });

  it(`grabs the published reports from the publishedReports prop if the dataset is whitelisted`, async () => {
    const origId = config.datasetId;
    const mockDatasetId = Object.keys(mockPublishedReportsMTS)[0];
    if (whiteListIds && whiteListIds.length) {
      config.datasetId = whiteListIds[0];
    }

    getPublishedDates.mockClear();

    render(
      <RecoilRoot>
        <DatasetDataComponent
          config={config}
          setSelectedTableProp={setSelectedTableMock}
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
        <DatasetDataComponent config={config} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={mockPublishedReports} />
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
        <DatasetDataComponent config={config} setSelectedTableProp={setSelectedTableMock} publishedReportsProp={updatedMockPublishedReportsMTS} />
      </RecoilRoot>
    );

    expect(getPublishedDates).toBeCalledTimes(2);
    expect(getPublishedDates).toHaveBeenCalledWith(mockPublishedReports);
  });

  //TODO: Data is not laoding into the table

  it(`renders the datatable banner when datatableBanner exists`, () => {
    const bannerText = 'This is a test';
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetDataComponent config={bannerTableConfig} width={2000} setSelectedTableProp={setSelectedTableMock} location={mockLocation} />
      </RecoilRoot>
    );
    expect(getByTestId('datatable-banner')).toHaveTextContent(bannerText);
  });
});

//TODO I don't believe this is doing anything
describe('Nested Data Table', () => {
  global.console.error = jest.fn();
  const analyticsSpy = jest.spyOn(Analytics, 'event');

  let instance;
  const setSelectedTableMock = jest.fn();
  const fetchSpy = jest.spyOn(global, 'fetch');
  beforeEach(async () => {
    instance = render(
      <RecoilRoot>
        <DatasetDataComponent
          config={{ ...config, detailView: { apiId: 300 } }}
          width={2000}
          setSelectedTableProp={setSelectedTableMock}
          location={mockLocation}
        />
      </RecoilRoot>
    );
  });

  afterEach(() => {
    fetchSpy.mockClear();
    global.fetch.mockClear();
    analyticsSpy.mockClear();
    global.console.error.mockClear();
  });

  it('Renders the summary table', () => {
    expect(instance).toBeDefined();
  });
});

const renderComp = (config, location = { pathname: '/datasets/mock-dataset/' }) =>
  render(
    <RecoilRoot>
      <DatasetDataComponent config={config} width={1200} location={location} setSelectedTableProp={() => {}} />
    </RecoilRoot>
  );

describe('DatasetDataComponent more coverage ', () => {
  jest.mock('../filter-download-container/filter-download-container', () =>
    jest.fn(({ children, ...rest }) => (
      <div data-testid="filter-download" data-props={JSON.stringify(rest)}>
        {children}
      </div>
    ))
  );

  jest.mock('../datatable-select/datatable-select', () =>
    jest.fn(({ setSelectedTable }) => (
      <button data-testid="datatable-select" onClick={() => setSelectedTable({ allDataTables: true, tableName: 'All Tables' })}>
        DataTableSelect
      </button>
    ))
  );

  jest.mock('../filter-download-container/range-presets/range-presets', () => jest.fn(() => <div data-testid="range-presets">RangePresets</div>));

  jest.mock('./table-section-container/table-section-container', () => jest.fn(() => <div data-testid="table-section-container" />));

  it('renders the date-range placeholder when no tables exist', () => {
    const baseConfig = { ...config, apis: [] };
    const { getByTestId } = renderComp(baseConfig);
    expect(getByTestId('dateRangePlaceholder')).toBeInTheDocument();
  });

  it('skips RangePresets when the selected table disables date-range filtering', async () => {
    const baseConfig = JSON.parse(JSON.stringify(config));
    baseConfig.apis[0].apiFilter = { disableDateRangeFilter: true };

    const { queryByTestId } = renderComp(baseConfig);
    await waitFor(() => {
      expect(queryByTestId('range-presets')).toBeNull();
    });
  });

  it('shows the detail-view lock notice when a detail API is configured', () => {
    const baseConfig = JSON.parse(JSON.stringify(config));
    baseConfig.detailView = {
      apiId: 300,
      field: 'record_date',
      label: 'Locked',
      dateRangeLockCopy: 'Locked Range',
    };

    const { getByText } = renderComp(baseConfig);
    expect(getByText('Locked Range')).toBeInTheDocument();
  });
});
