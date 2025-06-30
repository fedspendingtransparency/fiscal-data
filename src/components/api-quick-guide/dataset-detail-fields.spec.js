import React from 'react';
import DatasetDetailFields from './dataset-detail-fields';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

let excluded = [];
let apis = [];

describe('DataSetDetailFields', () => {
  afterAll(() => {
    excluded = [];
    apis = [];
  });

  excluded = ['definition', 'isRequired'];
  apis = [
    {
      tableName: 'table1',
      fields: [
        {
          columnName: 'record_date',
          definition: 'Reporting date for the data',
          prettyName: 'Record Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
        {
          columnName: 'record_calendar_month',
          definition: 'Reporting date for the data',
          prettyName: 'Calendar Month',
          dataType: 'DATE',
          isRequired: 'yes',
        },
      ],
    },
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
          columnName: 'record_date',
          definition: 'Reporting date for the data',
          prettyName: 'Record Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
      ],
    },
    {
      tableName: 'table3',
    },
  ];

  const header = 'Fields';

  it('displays the correct header text', () => {
    const { getByText } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    expect(getByText(header)).toBeInTheDocument();
  });

  it('includes a link to the about section', () => {
    const { getByTestId } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    expect(getByTestId('scroll-link')).toBeInTheDocument();
  });

  it('includes data types section with header', () => {
    const { getByText } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    const header = getByText('Data Types');
    expect(header).toBeInTheDocument();
  });

  it('sets the expected column titles in the expected order', () => {
    const { getByRole } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    const columnHeaders = within(table).getAllByRole('columnheader');
    expect(columnHeaders.length).toBe(4);
    expect(columnHeaders[0]).toHaveTextContent('Field Name');
    expect(columnHeaders[1]).toHaveTextContent('Display Name');
    expect(columnHeaders[2]).toHaveTextContent('Data Type');
    expect(columnHeaders[3]).toHaveTextContent('Data Table Name');
  });

  it('sends the concatenated table data to the table component', () => {
    const { getByRole } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    expect(within(table).getByRole('cell', { name: 'reporting_date' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: 'record_calendar_month' })).toBeInTheDocument();
  });

  it('excludes the correct columns when multiple apis are represented', () => {
    const { getByRole } = render(<DatasetDetailFields apis={apis} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    expect(within(table).queryByRole('columnheader', { name: 'Definition' })).not.toBeInTheDocument();
    expect(within(table).queryByRole('columnheader', { name: 'Is Required' })).not.toBeInTheDocument();
  });

  it('excludes the correct columns if only one api is represented', () => {
    excluded.push('tableName');
    const { getByRole } = render(<DatasetDetailFields apis={[apis[0]]} />, { wrapper: RecoilRoot });
    const table = getByRole('table');
    expect(within(table).queryByRole('columnheader', { name: 'Definition' })).not.toBeInTheDocument();
    expect(within(table).queryByRole('columnheader', { name: 'Is Required' })).not.toBeInTheDocument();
    expect(within(table).queryByRole('columnheader', { name: 'Data Table Name' })).not.toBeInTheDocument();
  });
});
