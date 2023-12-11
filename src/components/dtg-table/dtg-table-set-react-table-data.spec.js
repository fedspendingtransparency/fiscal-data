import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import DtgTable from './dtg-table';
import { mockReactTableProps_depaginated, mockReactTableProps_rawData } from './test-data';
import React from 'react';

// Separate file created for these tests due mock conflict issues

describe('React Table Data ', () => {
  it('sets raw data', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable tableProps={mockReactTableProps_rawData} reactTable pivotSelected={null} tableMeta={{}} setManualPagination={jest.fn()} />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('sets depaginated data', () => {
    const instance = render(
      <RecoilRoot>
        <DtgTable tableProps={mockReactTableProps_depaginated} reactTable tableMeta={{ 'total-count': 2 }} setManualPagination={jest.fn()} />
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
