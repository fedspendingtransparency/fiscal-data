import { act, render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import DtgTable from './dtg-table';
import {
  longerPaginatedDataResponse,
  mockPaginatedTableProps,
  mockReactTableProps_depaginated,
  mockReactTableProps_depaginated_smallTable,
  mockReactTableProps_rawData,
  mockReactTableProps_rawData_smallTable,
} from './test-data';
import React from 'react';
import fetchMock from 'fetch-mock';

// Separate file created for these tests due mock conflict issues

describe('React Table Data ', () => {
  jest.useFakeTimers();
  const setManualPaginationSpy = jest.fn();

  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/dts/dts_table_1?filter=record_date:gte:2021-01-21,record_date:lte:2021-01-21&sort=-record_date&page[number]=1&page[size]=10`,
      longerPaginatedDataResponse,
      { overwriteRoutes: true, repeat: 0 }
    );
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
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={setManualPaginationSpy}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('sets raw data for small table', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData_smallTable}
          reactTable
          pivotSelected={null}
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={setManualPaginationSpy}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('sets depaginated data', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_depaginated}
          reactTable
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('sets depaginated data for small tables', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_depaginated_smallTable}
          reactTable
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    expect(setManualPaginationSpy).toHaveBeenCalledWith(false);
  });

  it('sets tableData data', async () => {
    const { findByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockPaginatedTableProps}
          reactTable
          tableMeta={{ 'total-count': 20001 }}
          setManualPagination={setManualPaginationSpy}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    await act(async () => {
      jest.runAllTimers();
      expect(await findByRole('table')).toBeInTheDocument();
      // await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
    });
    expect(setManualPaginationSpy).toHaveBeenCalledWith(true);
  });

  // detail table

  //pivot table

  // empty data

  // error response
});
