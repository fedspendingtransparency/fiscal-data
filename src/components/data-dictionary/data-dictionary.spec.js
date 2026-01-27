import React from 'react';
import DataDictionary from './data-dictionary';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

describe('DataDictionary', () => {
  const apis = [
    {
      tableName: 'table1',
      fields: [
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
      ],
    },
    {
      tableName: 'table2',
      fields: [
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
      ],
    },
    {
      tableName: 'table3',
    },
  ];

  // it('sets the expected column titles in the expected order', () => {
  //   const { getAllByRole } = render(<DataDictionary apis={apis} />, { wrapper: RecoilRoot });
  //   const columnHeaders = getAllByRole('columnheader');
  //   expect(within(columnHeaders[0]).getByText('Data Table Name')).toBeInTheDocument();
  //   expect(within(columnHeaders[1]).getByText('Field Name')).toBeInTheDocument();
  //   expect(within(columnHeaders[2]).getByText('Display Name')).toBeInTheDocument();
  //   expect(within(columnHeaders[3]).getByText('Description')).toBeInTheDocument();
  //   expect(within(columnHeaders[4]).getByText('Data Type')).toBeInTheDocument();
  //   expect(within(columnHeaders[5]).getByText('Is Required')).toBeInTheDocument();
  // });

  it('sends the concatenated table data to the table component', () => {
    const { getAllByRole, getByRole } = render(<DataDictionary apis={apis} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    const rows = getAllByRole('row');
    expect(rows.length).toBe(5);
    expect(within(rows[1]).getByRole('cell', { name: 'table1' })).toBeInTheDocument();
    expect(within(rows[3]).getByRole('cell', { name: 'table2' })).toBeInTheDocument();
  });

  it('sets the table component width', () => {
    const { getByRole } = render(<DataDictionary apis={apis} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    expect(table).toHaveStyle({ width: 1400 });
  });

  it('adds table name to each row', () => {
    const { getAllByRole } = render(<DataDictionary apis={apis} />, { wrapper: RecoilRoot });

    const rows = getAllByRole('row');
    const firstRow = within(rows[1]).getAllByRole('cell');
    const secondRow = within(rows[3]).getAllByRole('cell');
    expect(within(firstRow[0]).getByText(apis[0].tableName)).toBeInTheDocument();
    expect(within(secondRow[0]).getByText(apis[1].tableName)).toBeInTheDocument();
  });

  it('sets aria-label to dataset name', () => {
    const name = 'test-dataset';
    const { getByRole } = render(<DataDictionary apis={apis} datasetName={name} />, { wrapper: RecoilRoot });
    const table = getByRole('table', { name: `${name} data dictionary` });
    expect(table).toBeInTheDocument();
  });
});
