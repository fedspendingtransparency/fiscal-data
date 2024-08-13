import { render, within } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import DataTable from './data-table';
import { RecoilRoot } from 'recoil';
import {
  mockTableData,
  mockPublishedReports,
  mockMeta,
  defaultColumnsTypeCheckMock,
  defaultSelectedColumnsMock,
  mockGenericTableData,
  allColLabels,
  mockTableData1Row,
  mockGenericTableColumns,
  defaultColLabels,
  additionalColLabels,
  mockColumnConfig,
  mockDetailViewColumnConfig,
  mockDetailApiData,
} from './data-table-test-helper';

describe('react-table', () => {
  const setTableColumnSortData = jest.fn();

  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockDetailApiData),
    });
  });

  it('table renders', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          publishedReports={mockPublishedReports}
          hasPublishedReports={true}
          hideCellLinks={false}
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
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
          shouldPage
          showPaginationControls
          publishedReports={mockPublishedReports}
          hasPublishedReports={true}
          hideCellLinks={false}
          setFiltersActive={jest.fn()}
          selectColumnPanel={true}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('table renders generic non raw data table', () => {
    const instance = render(
      <RecoilRoot>
        <DataTable
          rawData={mockGenericTableData}
          nonRawDataColumns={mockGenericTableColumns}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
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
          shouldPage
          showPaginationControls
          resetFilters
          setResetFilters={mostResetFilter}
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date Start | End' })).toBeInTheDocument();
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date Start | End' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date Start | End' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('defaultSortArrow');
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
    fireEvent.click(sortButton);
    // Now sorted in desc order
    expect(mockSorting).toHaveBeenCalledWith(['record_date-sort']);
    fireEvent.click(sortButton);
    fireEvent.click(sortButton);
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date Start | End' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date Start | End' });
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

  it('Filter column by text search', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          maxRows={5}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
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
    const clearButton = within(header).getAllByRole('button', { hidden: true })[1];
    expect(clearButton).toHaveClass('fa-circle-xmark');
    fireEvent.click(clearButton);
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
          maxRows={5}
          columnConfig={mockColumnConfig}
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date Start | End' });
    expect(header).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(2);

    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 2', { exact: false })).toBeInTheDocument();
    expect(getByText('rows of 6 rows', { exact: false })).toBeInTheDocument();
    expect(getByTestId('page-next-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('page-next-button'));

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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date Start | End' });
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date Start | End' });
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          hideColumns={['src_line_nbr']}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    // default col in table
    defaultColLabels.forEach(index => {
      if (index === 'Record Date Start | End') {
        index = 'Record Date Start | End';
      }
      expect(getAllByRole('columnheader', { name: index })[0]).toBeInTheDocument();
    });

    // additional col not in table
    expect(queryAllByRole('columnheader').length).toEqual(3);
    additionalColLabels.forEach(index => {
      expect(queryAllByRole('columnheader', { name: index })[0]).not.toBeDefined();
    });
  });
  it('formats PERCENTAGE types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('4%');
  });

  it('formats SMALL_FRACTION types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.00067898');
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          customFormatting={customFormatter}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120000');
  });

  it('formats custom STRING dateList types correctly', () => {
    const customFormatter = [{ type: 'STRING', fields: ['additional_date'], breakChar: ',', customType: 'dateList' }];

    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={['additional_date']}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          customFormatting={customFormatter}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('1/1/2024, 2/2/2023');
  });

  it('formats CURRENCY3 types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('$6,884,574,686,385.150');
  });

  it('formats * CURRENCY3 types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[2].innerHTML).toContain('*');
    expect(getAllByTestId('row')[2].innerHTML).not.toContain('(*)');
  });

  it('formats negative CURRENCY3 types correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={defaultColumnsTypeCheckMock}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          pagingProps={{ itemsPerPage: 10 }}
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('-$134.100');
  });

  it('formats FRN Daily Index number values correctly', () => {
    const { getAllByTestId } = render(
      <RecoilRoot>
        <DataTable
          rawData={mockTableData}
          defaultSelectedColumns={null}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          tableName="FRN Daily Indexes"
          columnConfig={mockColumnConfig}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    expect(getAllByTestId('row')[0].innerHTML).toContain('0.111111111');
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.222222222');
    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120');
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
          shouldPage
          showPaginationControls
          setFiltersActive={jest.fn()}
          tableName="FRN Daily Indexes"
          columnConfig={mockColumnConfig}
          detailColumnConfig={mockDetailViewColumnConfig}
          detailView={{ field: 'record_date' }}
          detailViewAPI={{ endpoint: '/test/endpoint/', alwaysSortWith: ['-record_date'], dateField: 'record_date', hideColumns: [] }}
          setDetailViewState={setDetailViewSpy}
          setSummaryValues={setSummaryValuesSpy}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    const detailViewButton = getByRole('button', { name: '2023-07-12' });
    expect(detailViewButton).toBeInTheDocument();

    detailViewButton.click();
    expect(setDetailViewSpy).toHaveBeenCalledWith('2023-07-12');
    expect(setSummaryValuesSpy).toHaveBeenCalledWith(mockTableData.data[0]);
  });
});
