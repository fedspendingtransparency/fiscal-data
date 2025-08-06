import React from 'react';
import DataTablesTab from './datatables-tab';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import { numberFormatter } from '../../helpers/text-format/text-format';

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
    const { getByRole } = render(
      <RecoilRoot>
        <DataTablesTab apis={mockData} />
      </RecoilRoot>
    );
    mockData.forEach(row => {
      expect(getByRole('cell', { name: row.tableName })).toBeInTheDocument();
      expect(getByRole('cell', { name: row.tableDescription })).toBeInTheDocument();
      expect(getByRole('cell', { name: numberFormatter.format(row.rowCount) })).toBeInTheDocument();
      expect(getByRole('cell', { name: row.rowDefinition })).toBeInTheDocument();
    });
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
