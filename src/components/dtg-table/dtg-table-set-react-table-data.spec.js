import { act, render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import DtgTable from './dtg-table';
import {
  longerPaginatedDataResponse,
  mockPaginatedTableProps,
  mockReactTableProps_rawData,
  mockReactTableProps_rawData_nestedDetailTable,
  mockReactTableProps_rawData_pivotTable,
} from './test-data';
import React from 'react';

import fetchMock from 'fetch-mock';
import userEvent from '@testing-library/user-event';

// Separate file created for these tests due mock conflict issues

describe('React Table Data ', () => {
  jest.useFakeTimers();
  const setManualPaginationSpy = jest.fn();
  const base = 'https://www.transparency.treasury.gov/services/api/fiscal_service/';
  const table1 = mockPaginatedTableProps.serverSidePagination;

  beforeAll(() => {
    fetchMock.get(`begin:${base}${table1}`, longerPaginatedDataResponse, { overwriteRoutes: true });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets raw data', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData}
          reactTable
          rawDataTable={true}
          pivotSelected={null}
          tableMeta={{ meta: { 'total-count': 2 } }}
          setManualPagination={setManualPaginationSpy}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('handles serverside paginated data (tableData), with pagination controls', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { findByRole, getByRole, getByText } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockPaginatedTableProps}
          tableMeta={{ meta: { 'total-count': 20001 } }}
          manualPagination={true}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={jest.fn()}
          setPerPage={jest.fn()}
          setTableColumnSortData={jest.fn()}
        />
      </RecoilRoot>
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(async () => {
      expect(await findByRole('table')).toBeInTheDocument();
    });

    expect(setManualPaginationSpy).toHaveBeenCalledWith(true);

    const rowsPerPageMenu = getByRole('button', { name: 'rows-per-page-menu' });
    expect(rowsPerPageMenu).toBeInTheDocument();
    await user.click(rowsPerPageMenu);
    const perPage5 = getByRole('menuitem', { name: '5', hidden: true });
    await user.click(perPage5);
    expect(getByText('1 - 5')).toBeInTheDocument();
  });

  it('sets raw data for nested detail tables', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData_nestedDetailTable}
          pivotSelected={null}
          tableMeta={{ meta: { 'total-count': 2 } }}
          setManualPagination={setManualPaginationSpy}
          detailViewState={{ secondary: 'last' }}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('sets raw data for pivot tables', async () => {
    const mockPivot = {
      pivotView: { title: 'Brennah' },
      pivotValue: { columnName: 'First' },
    };
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData_pivotTable}
          pivotSelected={mockPivot}
          tableMeta={{ meta: { 'total-count': 2 } }}
          setManualPagination={setManualPaginationSpy}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });
});
