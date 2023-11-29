import React from 'react';
import renderer from 'react-test-renderer';
import DataDictionary from './data-dictionary';
import DtgTable from '../dtg-table/dtg-table';
import { RecoilRoot } from 'recoil';

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
      tableName: 'table3',
    },
  ];

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataDictionary apis={apis} />
      </RecoilRoot>
    );
  });
  const instance = component.root;

  it('sets the expected column titles in the expected order', () => {
    const config = instance.findByType(DtgTable).props.tableProps.columnConfig;

    expect(config[0].name).toBe('Data Table Name');
    expect(config[1].name).toBe('Field Name');
    expect(config[2].name).toBe('Display Name');
    expect(config[3].name).toBe('Description');
    expect(config[4].name).toBe('Data Type');
    expect(config[5].name).toBe('Is Required');
  });

  it('sends the concatenated table data to the table component', () => {
    expect(instance.findByType(DtgTable).props.tableProps.data).toStrictEqual(apis[0].fields.concat(apis[1].fields));
  });

  it('sets the table component width', () => {
    expect(instance.findByType(DtgTable).props.tableProps.width).toBeDefined();
  });

  it('adds table name to each row', () => {
    expect(apis[0].fields[0].tableName).toBe(apis[0].tableName);
    expect(apis[1].fields[0].tableName).toBe(apis[1].tableName);
  });

  it('sets aria-label to dataset name', () => {
    const name = 'test-dataset';
    const newComponent = renderer.create();
    renderer.act(() => {
      newComponent.update(
        <RecoilRoot>
          <DataDictionary apis={apis} datasetName={name} />
        </RecoilRoot>
      );
    });
    const updated = newComponent.root;
    const table = updated.findByType('table');
    expect(table.props['aria-label']).toBe(`${name} data dictionary`);
  });
});
