import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import FilteredTable from './filtered-table';
import { RecoilRoot } from 'recoil';
import {
  mockColumnConfig,
  mockGenericTableColumns,
  mockGenericTableData,
  mockTableData,
  mockTableData1Row,
} from '../../data-table/data-table-test-helper';
import userEvent from '@testing-library/user-event';
import { smallTableDownloadDataCSV } from '../../../recoil/smallTableDownloadData';
import { RecoilObserver } from '../../../utils/test-utils';

describe('react-table', () => {
  const setTableColumnSortData = jest.fn();

  it('table renders', () => {
    const instance = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockGenericTableData, columnConfig: mockGenericTableColumns, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('renders headers', () => {
    const mockResetFilter = jest.fn();
    const { getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockGenericTableData, columnConfig: mockGenericTableColumns, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setResetFilters={mockResetFilter}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
    const mockSorting = jest.fn();
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date' });
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
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    // Column header
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    // Rows render
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date' });
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
    const { getAllByRole, getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockGenericTableData.data, columnConfig: mockGenericTableColumns, shouldPage: true }}
          pagingProps={{ itemsPerPage: 5 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          perPage={5}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    // Column header
    const header = getByRole('columnheader', { name: 'Name' });
    expect(header).toBeInTheDocument();
    // Rows render
    let tableBody = getAllByRole('rowgroup')[1];
    expect(within(tableBody).getAllByRole('row').length).toEqual(5);
    const columnFilter = within(header).getByRole('textbox');
    expect(columnFilter).toBeInTheDocument();
    fireEvent.change(columnFilter, { target: { value: 'Title' } });
    // Rows filtered down to 1
    tableBody = getAllByRole('rowgroup')[1];
    const filteredRows = within(tableBody).getAllByRole('row');
    expect(filteredRows.length).toEqual(1);
    expect(within(filteredRows[0]).getAllByRole('cell')[1].innerHTML).toContain('120 Day Delinquent Debt Referral Compliance Report');

    //clear results to view full table
    const clearButton = within(header).getByRole('button', { name: 'Clear search bar' });
    userEvent.click(clearButton);
    expect(getAllByTestId('row').length).toEqual(5);
  });

  it('Filter column by text search with null string value', () => {
    const { getByRole, getAllByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockGenericTableData.data, columnConfig: mockGenericTableColumns }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
          perPage={10}
        />
      </RecoilRoot>
    );
    // Column header
    const header = getByRole('columnheader', { name: 'Name' });
    expect(header).toBeInTheDocument();
    // Rows render
    const tableBody = getAllByRole('rowgroup')[1];
    expect(within(tableBody).getAllByRole('row').length).toEqual(7);
    const columnFilter = within(header).getByRole('textbox');
    expect(columnFilter).toBeInTheDocument();

    // Search should not match to 'null' values
    fireEvent.change(columnFilter, { target: { value: 'null' } });
    expect(within(tableBody).queryAllByRole('row').length).toEqual(0);
  });

  it('pagination', () => {
    const { getAllByTestId, getByText, getByRole, getByTestId } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig, shouldPage: true }}
          perPage={2}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
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

  it('pagination for 0 rows of data', () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: [], columnConfig: mockGenericTableColumns, shouldPage: true }}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Name' });
    expect(header).toBeInTheDocument();
    expect(getByText('rows of 0 rows', { exact: false })).toBeInTheDocument();
  });

  it('pagination for 1 row of data', () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: [mockTableData1Row], columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
    expect(header).toBeInTheDocument();
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('1 - 1', { exact: false })).toBeInTheDocument();
    expect(getByText('of 1 row', { exact: false })).toBeInTheDocument();
  });

  it('updates rows per page', () => {
    const { getByText, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    userEvent.click(getByRole('button', { name: 'rows-per-page-menu' }));
    userEvent.click(getByText('5'));
    expect(getByText('1 - 5', { exact: false })).toBeInTheDocument();
  });

  it('resets table filters', () => {
    const activeFilterSpy = jest.fn();
    const setResetFiltersSpy = jest.fn();
    render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: [mockTableData1Row], columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={activeFilterSpy}
          resetFilters={true}
          setResetFilters={setResetFiltersSpy}
        />
      </RecoilRoot>
    );

    expect(activeFilterSpy).toHaveBeenCalledWith([]);
    expect(setResetFiltersSpy).toHaveBeenCalledWith(false);
  });

  it('set data for download', () => {
    const setSmallTableDownloadDataCSV = jest.fn();

    render(
      <RecoilRoot>
        <RecoilObserver node={smallTableDownloadDataCSV} onChange={setSmallTableDownloadDataCSV} />
        <FilteredTable
          tableProps={{ data: [mockTableData1Row], columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          enableDownload={true}
        />
      </RecoilRoot>
    );

    expect(setSmallTableDownloadDataCSV).toHaveBeenCalled();
  });
});
