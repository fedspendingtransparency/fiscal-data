import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import DtgTable from './dtg-table';
import {
  mockReactTableProps_depaginated,
  mockReactTableProps_depaginated_smallTable,
  mockReactTableProps_rawData,
  mockReactTableProps_rawData_smallTable,
} from './test-data';
import React from 'react';

// Separate file created for these tests due mock conflict issues

describe('React Table Data ', () => {
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

  it('sets tableData data', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable tableProps={mockReactTableProps_depaginated} reactTable tableMeta={{ 'total-count': 20001 }} setManualPagination={jest.fn()} />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });
});
