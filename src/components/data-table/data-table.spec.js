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
} from './data-table-test-helper';

describe('react-table', () => {
  const setTableColumnSortData = jest.fn();

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
        />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
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
    fireEvent.click(sortButton);
    // Now sorted in desc order
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/7/2023');
    fireEvent.click(sortButton);
    fireEvent.click(sortButton);
    //Sorting should be reset
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/12/2023');
  });

  it('column sort keyboard accessibility', () => {
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
    expect(getAllByTestId('row')[0].innerHTML).toContain('7/7/2023');
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

    fireEvent.click(getByTestId('page-next-button'));

    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(getByText('3 - 4', { exact: false })).toBeInTheDocument();
  });

  it('initially renders all columns showing when no defaults specified', () => {
    const instance = render(
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
        />
      </RecoilRoot>
    );

    allColLabels.forEach(label => {
      expect(instance.getAllByRole('columnheader', { name: label })[0]).toBeInTheDocument();
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
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
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
        />
      </RecoilRoot>
    );

    const header = getByRole('columnheader', { name: 'Record Date' });
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
        />
      </RecoilRoot>
    );
    const hiddenCol = 'Source Line Number';
    expect(queryByRole('columnheader', { name: hiddenCol })).not.toBeInTheDocument();
    allColLabels
      .filter(x => x !== hiddenCol)
      .forEach(label => {
        expect(getAllByRole('columnheader', { name: label })[0]).toBeInTheDocument();
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
        />
      </RecoilRoot>
    );

    // default col in table
    defaultColLabels.forEach(index => {
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
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.00067898');
  });
  it('formats STRING types that are percentage values correctly', () => {
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
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('45%');
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
        />
      </RecoilRoot>
    );
    expect(getAllByTestId('row')[0].innerHTML).toContain('$6,884,574,686,385.150');
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
        />
      </RecoilRoot>
    );

    expect(getAllByTestId('row')[0].innerHTML).toContain('0.111111111');
    expect(getAllByTestId('row')[0].innerHTML).toContain('0.222222222');
    expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120');
  });
});
