import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import DataTable from './data-table';
import { RecoilRoot } from 'recoil';
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
  mockMeta,
  mockPublishedReports,
  mockTableData,
  mockTableData1Row,
  mockTableDownloadWithTextQualifier,
} from './data-table-test-helper';
import userEvent from '@testing-library/user-event';
import { smallTableDownloadDataCSV } from '../../recoil/smallTableDownloadData';
import { RecoilObserver } from '../../utils/test-utils';

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
    shouldPage: true,
    publishedReports: mockPublishedReports,
    hasPublishedReports: false,
  };

  it('table renders', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          hideCellLinks={false}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('table renders with select columns option', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          hideCellLinks={false}
          setFiltersActive={jest.fn()}
          selectColumnPanel={true}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('renders headers', () => {
    const mostResetFilter = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          resetFilters
          setResetFilters={mostResetFilter}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' })).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
    const mockSorting = jest.fn();
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('defaultSortArrow');
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
    userEvent.click(sortButton);
    // Now sorted in desc order
    expect(mockSorting).toHaveBeenCalledWith(['record_date-sort']);
    userEvent.click(sortButton);
    userEvent.click(sortButton);
    //Sorting should be reset
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
  });

  it('column sort keyboard accessibility', () => {
    const mockSorting = jest.fn();
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
          tableProps={{ ...tableProps }}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('defaultSortArrow');
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    // Now sorted in desc order
    expect(mockSorting).toHaveBeenCalledWith(['record_date-sort']);
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    //Sorting should be reset
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
  });

  it('column sort asc keyboard accessibility', () => {
    const mockSorting = jest.fn();
    const mockSetSorting = jest.fn();

    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          sorting={[{ id: 'record_date', desc: false }]}
          setSorting={mockSetSorting}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' })).toBeInTheDocument();
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('sortArrow');
    fireEvent.click(sortButton);
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    expect(sortButton).toHaveClass('sortArrow');
  });

  it('column sort desc keyboard accessibility', () => {
    const mockSorting = jest.fn();
    const mockSetSorting = jest.fn();

    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          sorting={[{ id: 'record_date', desc: true }]}
          setSorting={mockSetSorting}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' })).toBeInTheDocument();
    expect(getAllByTestId('row').length).toEqual(6);

    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('sortArrow');
    fireEvent.click(sortButton);
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    expect(sortButton).toHaveClass('sortArrow');
  });

  it('Filter column by text search', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          maxRows={5}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    // Column header
    const header = getByRole('columnheader', { name: 'Debt Held by the Public' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const columnFilter = within(header).getByRole('textbox');
    expect(columnFilter).toBeInTheDocument();
    fireEvent.change(columnFilter, { target: { value: '25633821130387.02' } });
    // Rows filtered down to 1
    expect(getAllByTestId('row').length).toEqual(1);
    expect(getAllByTestId('row')[0].innerHTML).toContain('$25,633,821,130,387.02');

    //clear results to view full table
    const clearButton = within(header).getByRole('button', { name: 'Clear search bar' });
    userEvent.click(clearButton);
    expect(getAllByTestId('row').length).toEqual(6);
  });

  it('Filter column by text search with null string value', () => {
    const { getAllByTestId, getByRole, queryAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
          maxRows={5}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );
    // Column header
    const header = getByRole('columnheader', { name: 'Mock Percent String' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const columnFilter = within(header).getByRole('textbox');
    expect(columnFilter).toBeInTheDocument();

    // Search should not match to 'null' values
    fireEvent.change(columnFilter, { target: { value: 'null' } });
    expect(queryAllByTestId('row').length).toEqual(0);
  });

  it('pagination', () => {
    const { getAllByTestId, getByText, getByRole, getByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(2);

    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 2', { exact: false })).toBeInTheDocument();
    expect(getByText('rows of 6 rows', { exact: false })).toBeInTheDocument();
    expect(getByTestId('page-next-button')).toBeInTheDocument();

    userEvent.click(getByTestId('page-next-button'));

    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('3 - 4', { exact: false })).toBeInTheDocument();
  });

  it('initially renders all columns showing when no defaults specified', () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );

    const visibleColumns = getAllByRole('columnheader');
    expect(visibleColumns.length).toBe(allColLabels.length);
    visibleColumns.forEach(col => {
      const header = col.children[0].children[0].innerHTML;
      expect(allColLabels.includes(header));
    });
  });

  it('pagination for 0 rows of data', () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={{ data: [], meta: mockMeta }}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    expect(header).toBeInTheDocument();
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('rows of 0 rows', { exact: false })).toBeInTheDocument();
  });

  it('pagination for 1 row of data', () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={{ data: [mockTableData1Row], meta: mockMeta }}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date mm/dd/yyyy - mm/dd/yyyy' });
    expect(header).toBeInTheDocument();
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 1', { exact: false })).toBeInTheDocument();
    expect(getByText('of 1 row', { exact: false })).toBeInTheDocument();
  });

  it('hides specified columns', () => {
    const { getAllByRole, queryByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={{ ...tableProps, hideColumns: ['src_line_nbr'] }}
        />
      </RecoilRoot>
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
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultSelectedColumnsMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
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
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={tableProps}
        />
      </RecoilRoot>
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
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={['spread']}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={{ ...tableProps, customFormatting: customFormatter }}
        />
      </RecoilRoot>
    );

    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120000');
  });

  it('formats custom data types correctly', () => {
    const customFormatter = [
      { type: 'NUMBER', fields: ['spread'], noFormatting: true },
      { type: 'STRING', fields: ['additional_date'], breakChar: ',', customType: 'dateList' },
    ];

    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={['spread', 'additional_date']}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          tableProps={{ ...tableProps, customFormatting: customFormatter }}
        />
      </RecoilRoot>
    );

    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.1200');
    expect(getAllByTestId('row')[0].innerHTML).toContain('1/1/2024, 2/2/2023');
  });

  it('renders with download timestamp enabled', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          hasDownloadTimestamp={true}
          tableProps={{
            ...tableProps,
            dateRange: {
              from: '2022-08-31',
              to: '2024-08-31',
            },
          }}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('updates recoil state for csv download with text qualifiers', () => {
    const setSmallTableDownloadDataCSV = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={smallTableDownloadDataCSV} onChange={setSmallTableDownloadDataCSV} />
        <DataTable
          rawData={mockTableDownloadWithTextQualifier}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfigDownloadWithTextQualifier}
          setTableSorting={jest.fn()}
          tableProps={{
            ...tableProps,
            columnConfig: mockColumnConfigDownloadWithTextQualifier,
            dateRange: {
              from: '2022-08-31',
              to: '2024-08-31',
            },
          }}
        />
      </RecoilRoot>
    );
    expect(setSmallTableDownloadDataCSV).toHaveBeenCalledWith([
      ['Record Date', 'String Value', 'String Value with Commas'],
      ['2023-07-12', 'just a normal string', '"comma, separated, list"'],
    ]);
  });

  it('renders detail view links', async () => {
    const setDetailViewSpy = jest.fn();
    const setSummaryValuesSpy = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          showPaginationControls
          setFiltersActive={jest.fn()}
          detailColumnConfig={mockDetailViewColumnConfig}
          detailView={{ field: 'record_date' }}
          detailViewAPI={{ endpoint: '/test/endpoint/', alwaysSortWith: ['-record_date'], dateField: 'record_date', hideColumns: [] }}
          setDetailViewState={setDetailViewSpy}
          setSummaryValues={setSummaryValuesSpy}
          setTableSorting={jest.fn()}
          tableProps={{ ...tableProps, tableName: 'FRN Daily Indexes' }}
        />
      </RecoilRoot>
    );
    const detailViewButton = getByRole('button', { name: '7/12/2023' });
    expect(detailViewButton).toBeInTheDocument();

    userEvent.click(detailViewButton);
    expect(setDetailViewSpy).toHaveBeenCalledWith({ secondary: null, value: '2023-07-12' });
    expect(setSummaryValuesSpy).toHaveBeenCalledWith(mockTableData.data[0]);
  });
});
