import React from 'react';
import DtgTable from './dtg-table';
import {
  DetailViewTestData,
  mockPaginatedTableProps,
  mockReactTableProps_rawData_apiError,
  mockReactTableProps_rawData_emptyTable,
  MoreTestData,
  TestData,
  TestDataOneRow,
} from './test-data';
import * as helpers from './dtg-table-helper';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  additionalColLabels,
  allColLabels,
  defaultColLabels,
  defaultColumnsTypeCheckMock,
  defaultSelectedColumnsMock,
  mockColumnConfig,
  mockColumnConfigDownloadWithTextQualifier,
  mockDetailApiData,
  mockDetailViewColumnConfig,
  mockPublishedReports,
  mockTableData,
  mockTableDownloadWithTextQualifier,
} from '../table-components/helpers/table-test-helper';

import { smallTableDownloadData } from '../../recoil/smallTableDownloadData';
import fetchMock from 'fetch-mock';

describe('DTG table component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  it('renders a table', () => {
    const { getByRole } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestData, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('renders a row for each item in the data array', () => {
    const { getAllByRole } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestData, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getAllByRole('row')).toHaveLength(TestData.length + 1);
  });

  it('renders a column for every item in the data', () => {
    const { getAllByRole } = render(
      <>
        <DtgTable
          tableProps={{ rawData: mockTableData, perPage: 5, columnConfig: mockColumnConfig, config: {} }}
          setManualPagination={jest.fn()}
          setTableColumnSortData={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getAllByRole('columnheader')).toHaveLength(Object.keys(mockTableData.data[0]).length);
  });

  it('does not blow up when a column config is not provided', () => {
    const { getAllByRole } = render(
      <>
        <DtgTable
          tableProps={{ rawData: mockTableData, columnConfig: mockColumnConfig, config: {} }}
          setManualPagination={jest.fn()}
          setTableColumnSortData={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getAllByRole('columnheader').length).toBeGreaterThan(0);
  });

  it('does not blow up when there is no data in a table', () => {
    const noDataComponent = render(
      <>
        <DtgTable tableProps={{ config: {} }} setIsLoading={jest.fn()} />
      </>
    );
    expect(noDataComponent).toBeDefined();
  });

  it('renders the defaultRowsPer if shouldPage === true but perPage is not specified and shows range of rows showing out of total number of rows with correct default itemsPerPage', () => {
    const perPage = 10;
    const { getAllByRole, getByTestId } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: MoreTestData, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getAllByRole('row').length).toEqual(perPage + 1); // per page plus header
    const maxRows = MoreTestData.length;
    const rowsShowing = getByTestId('rows-showing');
    expect(within(rowsShowing).getByText(`1 - 10`)).toBeInTheDocument();
    expect(within(rowsShowing).getByText(`rows of ${maxRows} rows`, { exact: false })).toBeInTheDocument();
  });

  it('sets a timer for the loading indicator', async () => {
    const spy = jest.spyOn(helpers, 'loadingTimeout');
    spy.mockClear();
    render(
      <>
        <DtgTable
          tableProps={{ ...mockPaginatedTableProps, config: {} }}
          tableMeta={{ meta: { 'total-count': 20001 }, table: 'test table' }}
          setManualPagination={jest.fn()}
          setTableColumnSortData={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    jest.advanceTimersByTime(helpers.loadTimerDelay * 2);
    await expect(spy).toHaveBeenCalledTimes(1);
  });

  // it('sets table aria prop with a single attribute and value', () => {
  //   const aria = { 'aria-describedby': 'my-test-id' };
  //   const { getByRole } = render(
  //     <>
  //       <DtgTable
  //         tableProps={{
  //           data: TestData,
  //           aria: aria,
  //         }}
  //       />
  //     </>
  //   );
  //   const table = getByRole('table');
  //   expect(table).toHaveAttribute('aria-describedby', 'my-test-id');
  // });

  describe('Pagination Controls', () => {
    it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { getByText, getByRole } = render(
        <>
          <DtgTable
            tableProps={{ rawData: { data: MoreTestData, meta: { dataTypes: [] } }, tableName: 'tableName', config: {} }}
            setManualPagination={jest.fn()}
            setIsLoading={jest.fn()}
          />
        </>
      );

      expect(getByText('Rows Per Page')).toBeInTheDocument();

      const nextPage = getByRole('button', { name: 'tableName-page2' });
      await user.click(nextPage);

      expect(getByText('Showing', { exact: false })).toBeInTheDocument();
      expect(getByText('11 - 11', { collapseWhitespace: false })).toBeInTheDocument();
      expect(getByText('of 11 rows', { exact: false })).toBeInTheDocument();
    });

    it(
      'renders pagination Controls when the table is configured to load page-by-page, ' +
        'so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(
          <>
            <DtgTable
              tableProps={{ rawData: { data: TestDataOneRow, meta: { dataTypes: [] } }, config: {} }}
              setManualPagination={jest.fn()}
              setIsLoading={jest.fn()}
            />
          </>
        );

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );

    it(
      'does not render pagination Controls even when the table is configured to load page-by-page,' +
        ' so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true',
      async () => {
        const { getByText } = render(
          <>
            <DtgTable
              tableProps={{ rawData: { data: MoreTestData, meta: { dataTypes: [] } }, config: {} }}
              setManualPagination={jest.fn()}
              setIsLoading={jest.fn()}
            />
          </>
        );

        expect(getByText('Rows Per Page')).toBeInTheDocument();
      }
    );
  });

  // it('assigns data with a userFilterSelection', () => {
  //   const mockSetIsLoading = jest.fn();
  //   const mockSetManualPagination = jest.fn();
  //   const { getByRole } = render(
  //     <>
  //       <DtgTable
  //         tableMeta={{ 'total-count': 500 }}
  //         userFilterSelection={{ value: 'A' }}
  //         tableProps={{ rawData: { data: ['hello'], meta: { dataTypes: [] } }, config: {} }}
  //         setManualPagination={mockSetManualPagination}
  //         setIsLoading={mockSetIsLoading}
  //       />
  //     </>
  //   );
  //   expect(getByRole('table')).toBeInTheDocument();
  //   expect(mockSetManualPagination).toHaveBeenCalledWith(false);
  //   expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  // });
});

describe('DtgTable component - API Error', () => {
  it('shows an apiError message when apiError exists', () => {
    const { getByText } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestData, meta: { dataTypes: [] } }, apiError: 'Error', config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getByText('Table failed to load.')).toBeInTheDocument();
  });

  it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
    const { queryByRole } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestData, meta: { dataTypes: [] } }, apiError: 'Error', config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });
});

describe('DtgTable component with shouldPage property and tableData with only one row', () => {
  it('does show table footer if shouldPage property is included in tableProps', () => {
    const { getByTestId } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestDataOneRow, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getByTestId('table-footer')).toBeDefined();
  });
  it('shows the "x of x rows" message with correct grammar if only one row of data exists', () => {
    const { getByText } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestDataOneRow, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 1', { collapseWhitespace: false })).toBeInTheDocument();
    expect(getByText('of 1 row', { exact: false })).toBeInTheDocument();
  });

  it('does not render pagination controls when fewer rows than the lowest available rows-per-page option in the pagination controls', () => {
    const { getByTestId } = render(
      <>
        <DtgTable
          tableProps={{ rawData: { data: TestDataOneRow, meta: { dataTypes: [] } }, config: {} }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </>
    );
    const footer = getByTestId('table-footer');
    expect(within(footer).getByText('Rows Per Page')).toBeInTheDocument();
  });
});

describe('DTG Table Nested Table Detail View', () => {
  it('renders table with detail view', () => {
    const detailViewState = { value: 'Brennah', secondary: 'Smith' };
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <>
        <DtgTable
          tableProps={{
            rawData: { data: DetailViewTestData, meta: { dataTypes: [] } },
            selectedTable: { rowCount: 12 },
            config: { detailView: { field: 'first', secondaryField: 'last', apiId: 1 }, apis: [{ apiId: 1 }] },
          }}
          detailViewState={detailViewState}
          setManualPagination={mockSetManualPagination}
          setIsLoading={mockSetIsLoading}
        />
      </>
    );

    expect(getByRole('table')).toBeInTheDocument();
  });

  describe('react-table', () => {
    const setTableColumnSortData = jest.fn();

    global.fetch = jest.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDetailApiData),
      });
    });

    const tableProps = {
      columnConfig: mockColumnConfig,
      publishedReports: mockPublishedReports,
      hasPublishedReports: false,
    };

    it('renders column headers with table sort buttons', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockSorting = jest.fn();

      const { getByRole, getAllByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={mockSorting}
          />
        </>
      );
      // Rows render
      expect(getAllByRole('row')).toHaveLength(7);
      const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
      const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
      expect(sortButton).toHaveClass('defaultSortArrow');
      expect(getAllByRole('row')[1].innerHTML).toContain('7/12/2023');
      await user.click(sortButton);
      // Now sorted in desc order
      expect(mockSorting).toHaveBeenCalledWith(['record_date-sort']);
      await user.click(sortButton);
      await user.click(sortButton);
      //Sorting should be reset
      expect(getAllByRole('row')[1].innerHTML).toContain('7/12/2023');

      //confirm keyboard accessibility
      mockSorting.mockClear();
      fireEvent.keyDown(sortButton, { key: 'Enter' });
      expect(mockSorting).toHaveBeenCalledWith(['record_date-sort']);
    });

    it('Filter column by text search', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockSorting = jest.fn();
      const { getAllByRole, getByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={mockSorting}
          />
        </>
      );
      // Column header
      const header = getByRole('columnheader', { name: 'Debt Held by the Public' });
      expect(header).toBeInTheDocument();
      // Rows render
      expect(getAllByRole('row')).toHaveLength(7);
      const columnFilter = within(header).getByRole('textbox');
      expect(columnFilter).toBeInTheDocument();
      fireEvent.change(columnFilter, { target: { value: '25633821130387.02' } });
      // Rows filtered down to 1 (header plus one row)
      expect(getAllByRole('row')).toHaveLength(2);
      expect(getAllByRole('row')[1].innerHTML).toContain('$25,633,821,130,387.02');

      //clear results to view full table
      const clearButton = within(header).getByRole('button', { name: 'Clear search bar' });
      await user.click(clearButton);
      expect(getAllByRole('row')).toHaveLength(7);
    });

    it('Filter column by text search with null string value', () => {
      const mockSorting = jest.fn();
      const { getAllByRole, getByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={mockSorting}
          />
        </>
      );
      // Column header
      const header = getByRole('columnheader', { name: 'Mock Percent String' });
      expect(header).toBeInTheDocument();
      // Rows render
      expect(getAllByRole('row')).toHaveLength(7);
      const columnFilter = within(header).getByRole('textbox');
      expect(columnFilter).toBeInTheDocument();

      // Search should not match to 'null' values
      fireEvent.change(columnFilter, { target: { value: 'null' } });
      expect(getAllByRole('row')).toHaveLength(1);
    });

    it('renders a calendar filter for date columns', () => {
      const mockSorting = jest.fn();
      const { getAllByRole, getByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={mockSorting}
          />
        </>
      );

      // Rows render
      expect(getAllByRole('row')).toHaveLength(7);
      const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
      // Rows render
      expect(getAllByRole('row')).toHaveLength(7);
      const columnFilter = within(header).getByRole('button', { name: 'Open record_date Filter' });
      expect(columnFilter).toBeInTheDocument();
    });

    it('initially renders all columns showing when no defaults specified', () => {
      const { getAllByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );

      const visibleColumns = getAllByRole('columnheader');
      expect(visibleColumns.length).toBe(allColLabels.length);
      visibleColumns.forEach(col => {
        const header = col.children[0].children[0].innerHTML;
        expect(allColLabels.includes(header));
      });
    });

    it('hides specified columns', () => {
      const { getAllByRole, queryByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              hideColumns: ['src_line_nbr'],
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );
      const hiddenCol = 'Source Line Number';
      expect(queryByRole('columnheader', { name: hiddenCol })).not.toBeInTheDocument();

      const visibleColumns = getAllByRole('columnheader');
      const allVisibleColumnLabels = allColLabels.filter(x => x !== hiddenCol);
      expect(visibleColumns.length).toBe(allVisibleColumnLabels.length);

      visibleColumns.forEach(col => {
        const header = col.children[0].children[0].innerHTML;
        expect(allVisibleColumnLabels.includes(header));
      });
    });

    it('initially renders only default columns showing when defaults specified', () => {
      const { getAllByRole, queryAllByRole } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              selectColumns: defaultSelectedColumnsMock,
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );

      // default col in table
      defaultColLabels.forEach(index => {
        if (index === 'Record Date') {
          index = 'Record Date mm/dd/yyyy - mm/dd/yyyy';
        }
        expect(getAllByRole('columnheader', { name: index })[0]).toBeInTheDocument();
      });

      // additional col not in table
      expect(queryAllByRole('columnheader').length).toEqual(3);
      additionalColLabels.forEach(index => {
        expect(queryAllByRole('columnheader', { name: index })[0]).not.toBeDefined();
      });
    });

    it('formats data types correctly', () => {
      const { getAllByTestId } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              selectColumns: defaultColumnsTypeCheckMock,
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );

      //Percentage
      expect(getAllByTestId('row')[0].innerHTML).toContain('4%');

      //Small fraction
      expect(getAllByTestId('row')[0].innerHTML).toContain('0.00067898');

      //CURRENCY3
      expect(getAllByTestId('row')[0].innerHTML).toContain('$6,884,574,686,385.150');

      // * CURRENCY3
      expect(getAllByTestId('row')[2].innerHTML).toContain('*');
      expect(getAllByTestId('row')[2].innerHTML).not.toContain('(*)');

      //Negative CURRENCY3
      expect(getAllByTestId('row')[0].innerHTML).toContain('-$134.100');
    });

    it('formats custom NUMBER types correctly', () => {
      const customFormatter = [{ type: 'NUMBER', fields: ['spread'], decimalPlaces: 6 }];

      const { getAllByTestId } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              selectColumns: ['spread'],
              customFormatting: customFormatter,
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );

      expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120000');
    });

    it('formats custom data types correctly', () => {
      const customFormatter = [
        { type: 'NUMBER', fields: ['spread'], noFormatting: true },
        { type: 'STRING', fields: ['additional_date'], breakChar: ',', customType: 'dateList' },
      ];

      const { getAllByTestId } = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              selectColumns: ['spread', 'additional_date'],
              customFormatting: customFormatter,
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );

      expect(getAllByTestId('row')[0].innerHTML).toContain('-0.1200');
      expect(getAllByTestId('row')[0].innerHTML).toContain('1/1/2024, 2/2/2023');
    });

    it('renders with download timestamp enabled', () => {
      const instance = render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              tableName: 'tableName',
              config: {},
              selectColumns: defaultColumnsTypeCheckMock,
              dateRange: {
                from: '2022-08-31',
                to: '2024-08-31',
              },
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
            hasDownloadTimestamp={true}
          />
        </>
      );
      expect(instance).toBeTruthy();
    });

    it('updates csv download state with text qualifiers', () => {
      smallTableDownloadData.setState({ csv: [] });
      render(
        <>
          <DtgTable
            tableProps={{
              ...tableProps,
              rawData: mockTableDownloadWithTextQualifier,
              tableName: 'tableName',
              config: {},
              columnConfig: mockColumnConfigDownloadWithTextQualifier,
              dateRange: {
                from: '2022-08-31',
                to: '2024-08-31',
              },
            }}
            setTableColumnSortData={jest.fn()}
            selectColumnPanel={true}
            setManualPagination={jest.fn()}
            allActiveFilters={[]}
            setAllActiveFilters={jest.fn()}
          />
        </>
      );
      expect(smallTableDownloadData.getState().csv).toEqual([
        ['Record Date', 'String Value', 'String Value with Commas'],
        ['2023-07-12', 'just a normal string', '"comma, separated, list"'],
      ]);
    });

    it('renders detail view links', async () => {
      const setDetailViewSpy = jest.fn();
      const setSummaryValuesSpy = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { getByRole } = render(
        <>
          <DtgTable
            setTableColumnSortData={setTableColumnSortData}
            showPaginationControls
            setFiltersActive={jest.fn()}
            setManualPagination={jest.fn()}
            detailColumnConfig={mockDetailViewColumnConfig}
            setDetailViewState={setDetailViewSpy}
            setSummaryValues={setSummaryValuesSpy}
            setTableSorting={jest.fn()}
            tableProps={{
              ...tableProps,
              rawData: mockTableData,
              config: {
                detailView: { field: 'record_date', apiId: 1 },
                apis: [{ apiId: 1, endpoint: '/test/endpoint/', alwaysSortWith: ['-record_date'], dateField: 'record_date', hideColumns: [] }],
              },
              tableName: 'FRN Daily Indexes',
            }}
          />
        </>
      );
      const detailViewButton = getByRole('button', { name: '7/12/2023' });
      expect(detailViewButton).toBeInTheDocument();

      await user.click(detailViewButton);
      expect(setDetailViewSpy).toHaveBeenCalledWith({ secondary: null, value: '2023-07-12' });
      expect(setSummaryValuesSpy).toHaveBeenCalledWith(mockTableData.data[0]);
    });
  });
});

describe('Empty table and API Error', () => {
  jest.useFakeTimers();
  const setManualPaginationSpy = jest.fn();
  const base = 'https://www.transparency.treasury.gov/services/api/fiscal_service/';
  const table2 = mockReactTableProps_rawData_emptyTable.serverSidePagination;
  const table3 = mockReactTableProps_rawData_apiError.serverSidePagination;

  beforeAll(() => {
    fetchMock
      .mockGlobal()
      .route(`${base}${table2}?filter=record_date:gte:2021-01-21,record_date:lte:2021-01-21&sort=-record_date&page[number]=1&page[size]=10`, {
        data: [],
        meta: { 'total-count': 0 },
      })
      .route(`${base}${table3}?filter=record_date:gte:2021-01-21,record_date:lte:2021-01-21&sort=-record_date&page[number]=1&page[size]=10`, () => {
        throw new Error('failed to fetch');
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('handles an empty api response for server paginated tables', async () => {
    const setIsLoadingSpy = jest.fn();
    const { getByRole, findByRole, getByText } = render(
      <>
        <DtgTable
          tableProps={mockReactTableProps_rawData_emptyTable}
          tableMeta={{ meta: { 'total-count': 20001 } }}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={setIsLoadingSpy}
          setTableColumnSortData={jest.fn()}
        />
      </>
    );

    act(() => {
      jest.runAllTimers();
    });
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    expect(await findByRole('table')).toBeInTheDocument();
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    //TODO: Add empty data message and api error message to data-table
    //   expect(getByText('Change selections in order to preview data')).toBeInTheDocument();
    expect(setIsLoadingSpy).toHaveBeenCalledWith(false);
  });

  it('catches api errors', async () => {
    const setIsLoadingSpy = jest.fn();
    const { getByText } = render(
      <>
        <DtgTable
          tableProps={mockReactTableProps_rawData_apiError}
          tableMeta={{ meta: { 'total-count': 20001 } }}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={setIsLoadingSpy}
          setTableColumnSortData={jest.fn()}
        />
      </>
    );

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(getByText('Table failed to load.')).toBeInTheDocument());
    expect(setIsLoadingSpy).toHaveBeenCalledWith(false);
  });
});
