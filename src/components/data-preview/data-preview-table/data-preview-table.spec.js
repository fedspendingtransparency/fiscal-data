import React from 'react';
import { DetailViewTestData, mockPaginatedTableProps, MoreTestData, MoreTestDataColumnConfig, TestData } from '../../dtg-table/test-data';
import * as helpers from '../../dtg-table/dtg-table-helper';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';
import DataPreviewTable from './data-preview-table';
import { DataTableContext } from '../data-preview-context';
import { contextProps } from '../../data-table/data-table-test-helper';
import { columnsConstructorData } from '../../data-table/data-table-helper';

describe('DataPreviewTable component', () => {
  jest.useFakeTimers();

  beforeEach(() => jest.resetAllMocks());

  it('does not blow up when there is no data in a table', () => {
    const instance = render(
      <DataTableContext.Provider
        value={{
          tableProps: {},
        }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );

    expect(instance).toBeDefined();
  });

  it('does not show pagination controls by default', () => {
    const { queryByRole } = render(
      <DataTableContext.Provider
        value={{
          tableProps: { data: TestData },
        }}
      >
        <RecoilRoot>
          <DataPreviewTable />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });

  it('does not show table footer if shouldPage property is not included in tableProps', () => {
    const { queryByText } = render(
      <DataTableContext.Provider
        value={{
          tableProps: { data: TestData },
        }}
      >
        <RecoilRoot>
          <DataPreviewTable />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(queryByText('Rows Per Page')).not.toBeInTheDocument();
    expect(queryByText('Showing', { exact: false })).not.toBeInTheDocument();
  });

  it('renders the number of rows specified in props', () => {
    const perPage = 3;
    const { getAllByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          tableProps: { rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, shouldPage: true },
        }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} perPage={perPage} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    const tableBody = getAllByRole('rowgroup')[1];
    expect(within(tableBody).getAllByRole('row')).toHaveLength(perPage);
  });

  it(`renders the defaultRowsPer if shouldPage === true but perPage is not specified and shows range of rows
   showing out of total number of rows with correct default itemsPerPage`, () => {
    const { getByText, getAllByRole } = render(
      <DataTableContext.Provider
        value={{
          // ...contextProps,
          setReactTableData: jest.fn(),
          tableProps: { rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, shouldPage: true },
          reactTableData: MoreTestData,
          allColumns: columnsConstructorData(MoreTestData, [], '', MoreTestDataColumnConfig),
        }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );

    const tableBody = getAllByRole('rowgroup')[1];
    // expect(within(tableBody).getAllByRole('row').length).toBe(10);
    const maxRows = MoreTestData.length;
    expect(getByText(`Showing `, { exact: false })).toBeInTheDocument();
    expect(getByText(`rows of ${maxRows} rows`, { exact: false })).toBeInTheDocument();
  });

  it('sets a timer for the loading indicator', async () => {
    const spy = jest.spyOn(helpers, 'loadingTimeout');
    spy.mockClear();

    render(
      <DataTableContext.Provider
        value={{
          tableProps: mockPaginatedTableProps,
        }}
      >
        <RecoilRoot>
          <DataPreviewTable />
        </RecoilRoot>
      </DataTableContext.Provider>
    );

    jest.advanceTimersByTime(helpers.loadTimerDelay * 2);
    await expect(spy).toBeCalledTimes(1);
  });

  it('sets table aria prop with a single attribute and value', () => {
    const aria = { 'aria-describedby': 'my-test-id' };

    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          tableProps: {
            rawData: { data: MoreTestData },
            selectedTable: { rowCount: 11 },
            shouldPage: true,
            data: TestData,
            aria: aria,
          },
        }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );

    const table = getByRole('table');
    expect(table).toHaveAttribute('aria-describedby', 'my-test-id');
  });

  it('renders pagination Controls when there are more rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
    const { getByText } = render(
      <DataTableContext.Provider
        value={{ ...contextProps, tableProps: { rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, shouldPage: true } }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} isLoading={false} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByText('Rows Per Page')).toBeInTheDocument();
    expect(getByText('Showing', { exact: false })).toBeInTheDocument();
  });

  // TODO: Need to be rewritten (or moved to DataPreviewDataTable)
  // it('does render pagination Controls when the table is configured to load page-by-page, so long as there are more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
  //   jest.useFakeTimers();
  //   const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(longerPaginatedDataResponse));
  //
  //   let newComponent = renderer.create();
  //   await renderer.act(async () => {
  //     newComponent = await renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
  //       </RecoilRoot>
  //     );
  //     jest.runAllTimers();
  //   });
  //   const updated = newComponent.root;
  //   expect(requestSpy).toBeCalled();
  //   const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
  //   expect(rowsShowing.props.children).toMatch('Showing 1 - 10 rows of 11 rows');
  //   expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
  //   requestSpy.mockClear();
  // });

  // TODO: Need to be rewritten (or moved to DataPreviewDataTable)
  // it('does not render pagination Controls even when the table is configured to load page-by-page, so long as there are not more total available rows than the minimum rows-per-page-option and shouldPage is set to true', async () => {
  //   jest.useFakeTimers();
  //   const requestSpy = jest.spyOn(ApiUtils, 'pagedDatatableRequest').mockReturnValue(Promise.resolve(shortPaginatedDataResponse));
  //
  //   let newComponent = renderer.create();
  //   await renderer.act(async () => {
  //     newComponent = await renderer.create(
  //       <RecoilRoot>
  //         <DataPreviewTable tableProps={mockPaginatedTableProps} setIsLoading={jest.fn()} />
  //       </RecoilRoot>
  //     );
  //     jest.runAllTimers();
  //   });
  //   const updated = newComponent.root;
  //   expect(requestSpy).toBeCalled();
  //   const rowsShowing = updated.findByProps({ 'data-test-id': 'rows-showing' });
  //   expect(rowsShowing.props.children).toMatch('Showing 1 - 3 rows of 3 rows');
  //   expect(updated.findAllByType(PaginationControls).length).toStrictEqual(1);
  //   requestSpy.mockClear();
  // });

  it('assigns data with a userFilterSelection', () => {
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider value={{ ...contextProps, tableProps: { dePaginated: { data: ['hello'] } } }}>
        <RecoilRoot>
          <DataPreviewTable
            tableMeta={{ 'total-count': 500 }}
            userFilterSelection={{ value: 'A' }}
            setManualPagination={mockSetManualPagination}
            setIsLoading={mockSetIsLoading}
          />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByRole('table')).toBeInTheDocument();
    expect(mockSetManualPagination).toHaveBeenCalledWith(false);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
});

describe('DataPreviewTable component - API Error', () => {
  it('shows an apiError message when apiError exists', () => {
    const { getByText } = render(
      <DataTableContext.Provider
        value={{ ...contextProps, tableProps: { rawData: { data: TestData }, selectedTable: { rowCount: 10 }, apiError: 'Error', shouldPage: true } }}
      >
        <RecoilRoot>
          <DataPreviewTable setManualPagination={jest.fn()} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(getByText('Table failed to load.')).toBeInTheDocument();
  });

  // TODO: get these to work in a later ticket
  // it('displays "Showing 0 - 0 rows of 0 rows" when apiError exists', () => {
  //   const { getByText } = render(
  //     <DataTableContext.Provider
  //       value={{ ...contextProps, tableProps: { rawData: { data: null }, selectedTable: { rowCount: 11 }, apiError: 'Error', shouldPage: true } }}
  //     >
  //       <RecoilRoot>
  //         <DataPreviewTable setManualPagination={jest.fn()} />
  //       </RecoilRoot>
  //     </DataTableContext.Provider>
  //   );
  //   expect(getByText(`Showing 0 - 0 rows of 0 rows`)).toBeInTheDocument();
  // });

  it('does not render pagination controls if apiError exists && currentPage === 1 even when shouldPage === true', () => {
    const { queryByRole } = render(
      <DataTableContext.Provider
        value={{ ...contextProps, tableProps: { rawData: { data: null }, selectedTable: { rowCount: 11 }, apiError: 'Error', shouldPage: true } }}
      >
        <RecoilRoot>
          <DataPreviewTable
            tableProps={{ rawData: { data: MoreTestData }, selectedTable: { rowCount: 11 }, apiError: 'Error', shouldPage: true }}
            setManualPagination={jest.fn()}
          />
        </RecoilRoot>
      </DataTableContext.Provider>
    );
    expect(queryByRole('button', { name: 'Previous Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Next Page' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });
});

describe('Data Preview Table detail view', () => {
  it('renders table with detail view', () => {
    const detailViewState = { value: 'Brennah', secondary: 'Smith' };
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          tableProps: {
            rawData: { data: DetailViewTestData },
            selectedTable: { rowCount: 12 },
            shouldPage: true,
            config: { detailView: { field: 'first', secondaryField: 'last', apiId: 1 }, apis: [{ apiId: 1 }] },
          },
        }}
      >
        <RecoilRoot>
          <DataPreviewTable detailViewState={detailViewState} setManualPagination={mockSetManualPagination} setIsLoading={mockSetIsLoading} />
        </RecoilRoot>
      </DataTableContext.Provider>
    );

    expect(getByRole('table')).toBeInTheDocument();
  });
});

describe('Loading table data', () => {
  it('loads dePaginated data', () => {
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          tableProps: {
            dePaginated: { data: MoreTestData },
            selectedTable: { rowCount: 12 },
            shouldPage: true,
          },
        }}
      >
        <DataPreviewTable
          tableProps={{
            dePaginated: { data: MoreTestData },
            selectedTable: { rowCount: 12 },
            shouldPage: true,
          }}
          setManualPagination={mockSetManualPagination}
          setIsLoading={mockSetIsLoading}
        />
      </DataTableContext.Provider>,
      { wrapper: RecoilRoot }
    );
    expect(getByRole('table')).toBeInTheDocument();
  });

  it('loads rawData data', () => {
    const mockSetIsLoading = jest.fn();
    const mockSetManualPagination = jest.fn();
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...contextProps,
          tableProps: {
            rawData: { data: MoreTestData },
            selectedTable: { rowCount: 12 },
            shouldPage: true,
          },
        }}
      >
        <DataPreviewTable tableMeta={{ 'total-count': 12 }} setManualPagination={mockSetManualPagination} setIsLoading={mockSetIsLoading} />
      </DataTableContext.Provider>,
      { wrapper: RecoilRoot }
    );
    expect(getByRole('table')).toBeInTheDocument();
  });
});
