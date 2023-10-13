import React from 'react';
import renderer from 'react-test-renderer';
import DatasetDetailEndpoints from './dataset-detail-endpoints';
import DtgTable from '../../dtg-table/dtg-table';
import ApiQuickGuideSection from '../api-quick-guide-section';
import { apiPrefix } from '../../../utils/api-utils';

let apis = [];

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
  apis = testData;
  const endpoint = selectedTable.endpoint;

  const component = renderer.create(<DatasetDetailEndpoints apis={apis} selectedTable={selectedTable} />);
  const instance = component.root;

  it('displays the correct header', () => {
    expect(instance.findByType(ApiQuickGuideSection).props.title).toBe('Endpoints');
  });

  it('displays the correct base url', () => {
    expect(instance.findByProps({ id: 'endpoints-baseURL' }).props.children).toContain(baseURL);
  });

  it('displays the correct full url', () => {
    expect(instance.findByProps({ id: 'endpoints-fullURL' }).props.children.join('')).toContain(`${baseURL}${endpoint}`);
  });

  it('displays a dtg-table with the expected column titles in the expected order', () => {
    const config = instance.findByType(DtgTable).props.tableProps.columnConfig;

    expect(config.length).toBe(2);
    expect(config[0].name).toBe('Table Name');
    expect(config[1].name).toBe('Endpoint');
  });
  it('sets aria-label to dataset name + API endpoints', () => {
    expect(instance.findByType('table').props['aria-label']).toBe(`${selectedTable.tableName} API Endpoints`);
  });
});

describe('DataSetDetailEndpoints single endpoint', () => {
  apis = [testData[0]];
  const endpoint = selectedTable.endpoint;
  const component = renderer.create(<DatasetDetailEndpoints apis={apis} selectedTable={selectedTable} />);
  const instance = component.root;

  it('displays the correct header', () => {
    expect(instance.findByType(ApiQuickGuideSection).props.title).toBe('Endpoint');
  });

  it('displays the correct base url', () => {
    expect(instance.findByProps({ id: 'endpoints-baseURL' }).props.children).toContain(baseURL);
  });

  it('displays the correct endpoint', () => {
    expect(instance.findByProps({ id: 'endpoints-endpoint' }).props.children).toContain(endpoint);
  });

  it('displays the correct full url', () => {
    expect(instance.findByProps({ id: 'endpoints-fullURL' }).props.children.join('')).toContain(`${baseURL}${endpoint}`);
  });

  it('does not display a dtg-table', () => {
    expect(instance.findAllByType(DtgTable)).toStrictEqual([]);
  });
});
