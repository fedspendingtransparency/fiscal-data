import React from 'react';
import renderer from 'react-test-renderer';
import DatasetDetailFields from './dataset-detail-fields';
import DtgTable from '../dtg-table/dtg-table';

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
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
        {
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
      ]
    },{
      tableName: 'table1',
      fields: [
        {
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
        {
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
      ]
    },{
      tableName: 'table3'
    },
  ];

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <DatasetDetailFields apis={apis} />
    );
  });
  let instance = component.root;

  const header = 'Fields';

  it('displays the correct header text', () => {
    expect(instance.findByProps({'id': 'fields-header'}).props.children).toContain(header);
  });

  it('includes a link to the about section', () => {
    expect(instance.findByProps({'data-testid': 'scroll-link'})).toBeDefined();
  });

  it('includes data types section with header and body', () => {
    const dataTypesSection = instance.findByProps({'id': 'fields-datatypes'});
    expect(dataTypesSection).toBeDefined();
    const header = dataTypesSection.props.children[0];
    const body = dataTypesSection.props.children[1];
    expect(header.props.children).toContain('Data Types');
    expect(body.props.children).toBeDefined();
  });

  it('sets the expected column titles in the expected order', () => {
    const config = instance.findByType(DtgTable).props.tableProps.columnConfig;

    expect(config.length).toBe(4);
    expect(config[0].name).toBe('Field Name');
    expect(config[1].name).toBe('Display Name');
    expect(config[2].name).toBe('Data Type');
    expect(config[3].name).toBe('Data Table Name');
  });

  it('sends the concatenated table data to the table component', () => {
    expect(instance.findByType(DtgTable).props.tableProps.data)
      .toStrictEqual(apis[0].fields.concat(apis[1].fields));
  });

  it('excludes the correct columns when multiple apis are represented', () => {
    expect(instance.findByType(DtgTable).props.tableProps.excludeCols).toStrictEqual(excluded);
  });

  it('excludes the correct columns if only one api is represented', () => {
    excluded.push('tableName');
    renderer.act(() => {
      component = renderer.create(
        <DatasetDetailFields apis={[apis[0]]} />
      );
    });
    instance = component.root;
    expect(instance.findByType(DtgTable).props.tableProps.excludeCols).toStrictEqual(excluded);
  });

});
