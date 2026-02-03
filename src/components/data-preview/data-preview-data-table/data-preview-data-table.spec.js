import { render, within } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { RecoilRoot } from 'recoil';
import {
  additionalColLabels,
  allColLabels,
  contextProps,
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
} from '../../data-table/data-table-test-helper';
import userEvent from '@testing-library/user-event';
import DataPreviewDataTable from './data-preview-data-table';
import { smallTableDownloadDataCSV } from '../../../recoil/smallTableDownloadData';
import { RecoilObserver } from '../../../utils/test-utils';
import { DataTableContext } from '../data-preview-context';
import { columnsConstructorData } from '../../data-table/data-table-helper';

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
      <DataTableContext.Provider
        value={{
          ...contextProps,
        }}
      >
        <RecoilRoot>
          <DataPreviewDataTable
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
      </DataTableContext.Provider>
    );
    expect(instance).toBeTruthy();
  });

  it('renders headers', () => {
    const mostResetFilter = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
        }}
      >
        <RecoilRoot>
          <DataPreviewDataTable
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
      </DataTableContext.Provider>
    );
    expect(getByRole('columnheader', { name: 'Record Date' })).toBeInTheDocument();
  });

  describe('Column sorting and filtering', () => {
    it('column sort keyboard accessibility', () => {
      const mockSorting = jest.fn();
      const { getAllByTestId, getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            allColumns: columnsConstructorData(mockTableData, [], '', mockColumnConfig),
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
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
        </DataTableContext.Provider>
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
    // it('Filter column by text search', () => {
    //   const { getAllByTestId, getByRole } = render(
    //     <RecoilRoot>
    //       <DataPreviewDataTable
    //         rawData={mockTableData}
    //         defaultSelectedColumns={null}
    //         pagingProps={{ itemsPerPage: 10 }}
    //         setTableColumnSortData={setTableColumnSortData}
    //         shouldPage
    //         showPaginationControls
    //         setFiltersActive={jest.fn()}
    //         maxRows={5}
    //         columnConfig={mockColumnConfig}
    //         setTableSorting={jest.fn()}
    //         setAllActiveFilters={jest.fn()}
    //         allActiveFilters={[]}
    //       />
    //     </RecoilRoot>
    //   );
    //   // Column header
    //   const header = getByRole('columnheader', { name: 'Debt Held by the Public' });
    //   expect(header).toBeInTheDocument();
    //   // Rows render
    //   expect(getAllByTestId('row').length).toEqual(6);
    //   const columnFilter = within(header).getByRole('textbox');
    //   expect(columnFilter).toBeInTheDocument();
    //   fireEvent.change(columnFilter, { target: { value: '25633821130387.02' } });
    //   // Rows filtered down to 1
    //   expect(getAllByTestId('row').length).toEqual(1);
    //   expect(getAllByTestId('row')[0].innerHTML).toContain('$25,633,821,130,387.02');
    //
    //   //clear results to view full table
    //   const clearButton = within(header).getByRole('button', { name: 'Clear search bar' });
    //   userEvent.click(clearButton);
    //   expect(getAllByTestId('row').length).toEqual(6);
    // });

    // it('Filter column by text search with null string value', () => {
    //   const { getAllByTestId, getByRole, queryAllByTestId } = render(
    //     <RecoilRoot>
    //       <DataPreviewDataTable
    //         rawData={mockTableData}
    //         defaultSelectedColumns={null}
    //         pagingProps={{ itemsPerPage: 10 }}
    //         setTableColumnSortData={setTableColumnSortData}
    //         shouldPage
    //         showPaginationControls
    //         setFiltersActive={jest.fn()}
    //         setTableSorting={jest.fn()}
    //         setAllActiveFilters={jest.fn()}
    //         allActiveFilters={[]}
    //         maxRows={5}
    //         columnConfig={mockColumnConfig}
    //       />
    //     </RecoilRoot>
    //   );
    //   // Column header
    //   const header = getByRole('columnheader', { name: 'Mock Percent String' });
    //   expect(header).toBeInTheDocument();
    //   // Rows render
    //   expect(getAllByTestId('row').length).toEqual(6);
    //   const columnFilter = within(header).getByRole('textbox');
    //   expect(columnFilter).toBeInTheDocument();
    //
    //   // Search should not match to 'null' values
    //   fireEvent.change(columnFilter, { target: { value: 'null' } });
    //   expect(queryAllByTestId('row').length).toEqual(0);
    // });

    it('highlights columns with active filters or sorting', () => {
      const mockSorting = jest.fn();
      const { getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            allColumns: columnsConstructorData(mockTableData, [], '', mockColumnConfig),
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
              setAllActiveFilters={mockSorting}
              allActiveFilters={['record_date-sort']}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );

      const recordDateHeader = getByRole('columnheader', { name: 'Record Date' });
      const recordDateCell = getByRole('cell', { name: '7/12/2023' });
      expect(recordDateHeader).toHaveClass('filtersActive');
      expect(recordDateCell).toHaveClass('filtersActive');
    });
  });

  describe('Pagination', () => {
    it('renders pagination buttons', () => {
      const { getAllByTestId, getByText, getByRole, getByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
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
        </DataTableContext.Provider>
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
        <DataTableContext.Provider
          value={{
            ...contextProps,
            reactTableData: { data: [], meta: mockMeta },
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 2 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );

      const header = getByRole('columnheader', { name: 'Record Date' });
      expect(header).toBeInTheDocument();
      expect(getByText('Showing', { exact: false })).toBeInTheDocument();
      expect(getByText('rows of 0 rows', { exact: false })).toBeInTheDocument();
    });

    it('pagination for 1 row of data', () => {
      const { getByText, getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            reactTableData: { data: [mockTableData1Row], meta: mockMeta },
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 2 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );

      const header = getByRole('columnheader', { name: 'Record Date' });
      expect(header).toBeInTheDocument();
      expect(getByText('Showing', { exact: false })).toBeInTheDocument();
      expect(getByText('1 - 1', { exact: false })).toBeInTheDocument();
      expect(getByText('of 1 row', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Column select', () => {
    it('initially renders all columns showing when no defaults specified', () => {
      const { getAllByRole } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
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
        <DataTableContext.Provider
          value={{
            ...contextProps,
            allColumns: columnsConstructorData(mockTableData, ['src_line_nbr'], '', mockColumnConfig),
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
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
        </DataTableContext.Provider>
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
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultSelectedColumnsMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );

      // default col in table
      defaultColLabels.forEach(index => {
        if (index === 'Record Date') {
          index = 'Record Date';
        }
        expect(getAllByRole('columnheader', { name: index })[0]).toBeInTheDocument();
      });

      // additional col not in table
      expect(queryAllByRole('columnheader').length).toEqual(3);
      additionalColLabels.forEach(index => {
        expect(queryAllByRole('columnheader', { name: index })[0]).not.toBeDefined();
      });
    });
  });

  describe('Data formatting', () => {
    it('formats PERCENTAGE types correctly', () => {
      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('4%');
    });

    it('formats SMALL_FRACTION types correctly', () => {
      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('0.00067898');
    });

    it('formats custom NUMBER types correctly', () => {
      const customFormatter = [{ type: 'NUMBER', fields: ['spread'], decimalPlaces: 6 }];

      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            tableProps: { selectedTable: { rowCount: 11 }, shouldPage: true, dePaginated: null, customFormatting: customFormatter },
            defaultSelectedColumns: ['spread'],
            allColumns: columnsConstructorData(mockTableData, [], '', mockColumnConfig, customFormatter),
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('-0.120000');
    });

    it('formats custom STRING dateList types correctly', () => {
      const customFormatter = [{ type: 'STRING', fields: ['additional_date'], breakChar: ',', customType: 'dateList' }];

      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            tableProps: { selectedTable: { rowCount: 11 }, shouldPage: true, dePaginated: null, customFormatting: customFormatter },
            defaultSelectedColumns: ['additional_date'],
            allColumns: columnsConstructorData(mockTableData, [], '', mockColumnConfig, customFormatter),
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
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
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('1/1/2024, 2/2/2023');
    });

    it('formats CURRENCY3 types correctly', () => {
      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('$6,884,574,686,385.150');
    });

    it('formats * CURRENCY3 types correctly', () => {
      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[2].innerHTML).toContain('*');
      expect(getAllByTestId('row')[2].innerHTML).not.toContain('(*)');
    });

    it('formats negative CURRENCY3 types correctly', () => {
      const { getAllByTestId } = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              pagingProps={{ itemsPerPage: 10 }}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(getAllByTestId('row')[0].innerHTML).toContain('-$134.100');
    });

    it('renders with download timestamp enabled', () => {
      const instance = render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            defaultSelectedColumns: defaultColumnsTypeCheckMock,
          }}
        >
          <RecoilRoot>
            <DataPreviewDataTable
              defaultSelectedColumns={defaultColumnsTypeCheckMock}
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfig}
              setTableSorting={jest.fn()}
              hasDownloadTimestamp={true}
              dateRange={{
                from: '2022-08-31',
                to: '2024-08-31',
              }}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(instance).toBeTruthy();
    });

    it('updates recoil state for csv download with text qualifiers', () => {
      const setSmallTableDownloadDataCSV = jest.fn();
      render(
        <DataTableContext.Provider
          value={{
            ...contextProps,
            reactTableData: mockTableDownloadWithTextQualifier,
            allColumns: columnsConstructorData(mockTableDownloadWithTextQualifier, [], '', mockColumnConfigDownloadWithTextQualifier),
          }}
        >
          <RecoilRoot>
            <RecoilObserver node={smallTableDownloadDataCSV} onChange={setSmallTableDownloadDataCSV} />
            <DataPreviewDataTable
              pagingProps={{ itemsPerPage: 10 }}
              setTableColumnSortData={setTableColumnSortData}
              shouldPage
              showPaginationControls
              setFiltersActive={jest.fn()}
              columnConfig={mockColumnConfigDownloadWithTextQualifier}
              setTableSorting={jest.fn()}
              dateRange={{
                from: '2022-08-31',
                to: '2024-08-31',
              }}
            />
          </RecoilRoot>
        </DataTableContext.Provider>
      );
      expect(setSmallTableDownloadDataCSV).toHaveBeenCalledWith([
        ['Record Date', 'String Value', 'String Value with Commas'],
        ['2023-07-12', 'just a normal string', '"comma, separated, list"'],
      ]);
    });
  });

  it('renders detail view links', async () => {
    const setDetailViewSpy = jest.fn();
    const setSummaryValuesSpy = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          allColumns: columnsConstructorData(mockTableData, [], '', mockColumnConfig),
        }}
      >
        <RecoilRoot>
          <DataPreviewDataTable
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
      </DataTableContext.Provider>
    );
    const detailViewButton = getByRole('button', { name: '7/12/2023' });
    expect(detailViewButton).toBeInTheDocument();

    userEvent.click(detailViewButton);
    expect(setDetailViewSpy).toHaveBeenCalledWith({ secondary: null, value: '2023-07-12' });
    expect(setSummaryValuesSpy).toHaveBeenCalledWith(mockTableData.data[0]);
  });
});
