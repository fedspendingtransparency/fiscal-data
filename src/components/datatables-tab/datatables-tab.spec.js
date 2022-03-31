import React from 'react';
import renderer from 'react-test-renderer';
import DtgTable from '../dtg-table/dtg-table';
import DataTablesTab from "./datatables-tab";

describe('DataTablesTab', () => {
  const mockData = [
    {
      tableName: 'table 1',
      tableDescription: 'table 1 description',
      rowCount: '9999',
      rowDefinition: 'this row does this'
    },
    {
      tableName: 'table 2',
      tableDescription: 'table 2 description',
      rowCount: '111',
      rowDefinition: 'that row does that'
    }
  ];
  let component = renderer.create();
  let instance;
  beforeAll(() => {
    renderer.act(() => {
      component = renderer.create(
        <DataTablesTab apis={mockData}/>);
    });
    instance = component.root;
  });

  it('should pass along its data array to the dtgTable component', () => {
    const tableData = instance.findByType(DtgTable).props.tableProps.data;
    expect(tableData).toMatchSnapshot();
  });
  it("sets aria-label to [dataset name] data tables", ()=> {
    const name='test-dataset'
    const newComponent=renderer.create()
    renderer.act(()=> {
      newComponent.update(<DataTablesTab apis={mockData} datasetName={name}/>)
    })
    const updated=newComponent.root
    const table=updated.findByType("table")
    expect(table.props['aria-label']).toBe(`${name} data tables`)
  })
});
