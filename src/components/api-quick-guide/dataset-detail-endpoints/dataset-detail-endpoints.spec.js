import React from 'react';
import DatasetDetailEndpoints from './dataset-detail-endpoints';
import { apiPrefix } from '../../../utils/api-utils';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

const testData = [
  {
    tableName: 'table1',
    endpoint: 'sample/url/table_1',
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
    endpoint: 'sample/url/table_2',
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

const selectedTable = {
  name: 'Harry Potter',
  endpoint: 'v99/wingardium-leviosa',
  tableName: 'Test Table Name',
};

const baseURL = apiPrefix;

describe('DataSetDetailEndpoints multiple endpoints', () => {
  const endpoint = selectedTable.endpoint;

  it('displays the correct header', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={testData} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    const header = await findByText('Endpoints');
    expect(header).toBeInTheDocument();
  });

  it('displays the correct base url', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={testData} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(await findByText(baseURL)).toBeInTheDocument();
  });

  it('displays the correct full url', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={testData} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(await findByText(`${baseURL}${endpoint}`)).toBeInTheDocument();
  });

  it('displays a dtg-table with the expected column titles in the expected order', async () => {
    const { findByRole } = render(<DatasetDetailEndpoints apis={testData} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    const table = await findByRole('table');
    const columnHeaders = await within(table).findAllByRole('columnheader');
    expect(columnHeaders[0]).toHaveTextContent('Table Name');
    expect(columnHeaders[1]).toHaveTextContent('Endpoint');
  });

  it('sets aria-label to dataset name + API endpoints', async () => {
    const { findByAltText } = render(<DatasetDetailEndpoints apis={testData} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    const table = await findByAltText(`${selectedTable.tableName} API Endpoints`);
    expect(table).toBeInTheDocument();
  });
});

describe('DataSetDetailEndpoints single endpoint', () => {
  const endpoint = selectedTable.endpoint;

  it('displays the correct header', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={[testData[0]]} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    const header = await findByText('Endpoint');
    expect(header).toBeInTheDocument();
  });

  it('displays the correct base url', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={[testData[0]]} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(await findByText(baseURL)).toBeInTheDocument();
  });

  it('displays the correct endpoint', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={[testData[0]]} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(await findByText(endpoint)).toBeInTheDocument();
  });

  it('displays the correct full url', async () => {
    const { findByText } = render(<DatasetDetailEndpoints apis={[testData[0]]} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(await findByText(`${baseURL}${endpoint}`)).toBeInTheDocument();
  });

  it('does not display a dtg-table', () => {
    const { queryByRole } = render(<DatasetDetailEndpoints apis={[testData[0]]} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    const table = queryByRole('table');
    expect(table).not.toBeInTheDocument();
  });
});
