import React from 'react';
import DtgTable from '../dtg-table/dtg-table';
import DataTablesTab from './datatables-tab';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';

describe('DataTablesTab', () => {
  const mockData = [
    {
      tableName: 'table 1',
      tableDescription: 'table 1 description',
      rowCount: '9999',
      rowDefinition: 'this row does this',
    },
    {
      tableName: 'table 2',
      tableDescription: 'table 2 description',
      rowCount: '111',
      rowDefinition: 'that row does that',
    },
  ];

  it('should pass along its data array to the dtgTable component', () => {
    const {} = render(
      <RecoilRoot>
        <DataTablesTab apis={mockData} />
      </RecoilRoot>
    );
    const tableData = instance.findByType(DtgTable).props.tableProps.data;
    expect(tableData).toMatchSnapshot();
  });
  it('sets aria-label to [dataset name] data tables', () => {
    const name = 'test-dataset';
    const { getByRole } = render(
      <RecoilRoot>
        <DataTablesTab apis={mockData} datasetName={name} />
      </RecoilRoot>
    );

    const table = getByRole('table', { name: `${name} data tables` });
    expect(table).toBeInTheDocument();
  });
});
