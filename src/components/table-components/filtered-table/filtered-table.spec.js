import { render, within } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import FilteredTable from './filtered-table';
import { RecoilRoot } from 'recoil';
import {
  mockColumnConfig,
  mockDetailApiData,
  mockGenericTableColumns,
  mockGenericTableData,
  mockTableData,
  mockTableData1Row,
} from '../../data-table/data-table-test-helper';
import userEvent from '@testing-library/user-event';

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

  it('column sort asc keyboard accessibility', () => {
    const mockSorting = jest.fn();
    const mockSetSorting = jest.fn();

    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockGenericTableData, columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setFiltersActive={jest.fn()}
          sorting={[{ id: 'record_date', desc: false }]}
          setSorting={mockSetSorting}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    expect(getAllByTestId('row').length).toEqual(6);
    const header = getByRole('columnheader', { name: 'Record Date' });
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
        <FilteredTable
          rawData={mockTableData}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          sorting={[{ id: 'record_date', desc: true }]}
          setSorting={mockSetSorting}
          setTableSorting={jest.fn()}
          setAllActiveFilters={mockSorting}
          allActiveFilters={[]}
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
    expect(getAllByTestId('row').length).toEqual(6);

    const header = getByRole('columnheader', { name: 'Record Date' });
    const sortButton = within(header).getAllByRole('img', { hidden: true })[0];
    expect(sortButton).toHaveClass('sortArrow');
    fireEvent.click(sortButton);
    fireEvent.keyDown(sortButton, { key: 'Enter' });
    expect(sortButton).toHaveClass('sortArrow');
  });

  it('Filter column by text search', () => {
    const { getAllByTestId, getByRole } = render(
      <RecoilRoot>
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig, shouldPage: true }}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          maxRows={5}
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
    const clearButton = within(header).getByRole('button', { name: 'Clear search bar' });
    userEvent.click(clearButton);
    expect(getAllByTestId('row').length).toEqual(6);
  });

  it('Filter column by text search with null string value', () => {
    const { getAllByTestId, getByRole, queryAllByTestId } = render(
      <RecoilRoot>
        <FilteredTable
          rawData={mockTableData}
          pagingProps={{ itemsPerPage: 10 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
          setAllActiveFilters={jest.fn()}
          allActiveFilters={[]}
          maxRows={5}
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
        <FilteredTable
          tableProps={{ data: mockTableData.data, columnConfig: mockColumnConfig }}
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
          tableProps={{ data: [], columnConfig: mockColumnConfig }}
          pagingProps={{ itemsPerPage: 2 }}
          setTableColumnSortData={setTableColumnSortData}
          setFiltersActive={jest.fn()}
          setTableSorting={jest.fn()}
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
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
});
