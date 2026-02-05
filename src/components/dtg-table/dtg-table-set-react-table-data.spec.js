import { render, waitFor } from '@testing-library/react';
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

  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/dts/dts_table_1?filter=record_date:gte:2021-01-21,record_date:lte:2021-01-21&sort=-record_date&page[number]=1&page[size]=10`,
      longerPaginatedDataResponse,
      { overwriteRoutes: true, repeat: 0 }
    );
  });

  it('sets raw data', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData}
          reactTable
          pivotSelected={null}
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('sets raw data for small table', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_rawData_smallTable}
          reactTable
          pivotSelected={null}
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('sets depaginated data', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_depaginated}
          reactTable
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('sets depaginated data for small tables', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockReactTableProps_depaginated_smallTable}
          reactTable
          tableMeta={{ 'total-count': 2 }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('sets tableData data', async () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DtgTable
          tableProps={mockPaginatedTableProps}
          reactTable
          tableMeta={{ 'total-count': 20001 }}
          setManualPagination={jest.fn()}
          setIsLoading={jest.fn()}
        />
      </RecoilRoot>
    );
    jest.runAllTimers();
    await waitFor(() => expect(getByRole('table')).toBeInTheDocument());
  });
});
