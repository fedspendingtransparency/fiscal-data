import React from 'react';
import {fileSizeTranslator, fileSizeTranslator2, makeTheDataArray} from "./datatables-tab-helpers";
import renderer from "react-test-renderer";
import DataTablesTab from "./datatables-tab";

describe('DataTablesTabHelpers', () => {
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
        <DataTablesTab apis={mockData} />);
    });
    instance = component.root;
  });

  it('has a function called makeTheDataArray that grabs properties from the objects in the apis array and makes the array to send to the dtgTable component for the datatables tab', () => {
    expect(makeTheDataArray(mockData)).toMatchSnapshot();
  });
  it('has a fileSizeTranslator function that returns file sizes in KB or MB, as strings', () => {
    expect(fileSizeTranslator('999999.999')).toBe('1 MB');
    expect(fileSizeTranslator('1000000')).toBe('1 MB');
    expect(fileSizeTranslator('2905646.0672')).toBe('3 MB');
  });
  it('has a fileSizeTranslator2 function that returns correct file sizes in KB, MB or GB as strings', () => {
    expect(fileSizeTranslator2('156')).toBe('156 B');
    expect(fileSizeTranslator2('999999.999')).toBe('977 KB');
    expect(fileSizeTranslator2(2500000)).toBe('2 MB');
    expect(fileSizeTranslator2(1073741824)).toBe('1 GB');
  });
  it('has a fileSizeTranslator2 function that returns nulls if inappropriate input variables are passed in', () => {
    expect(fileSizeTranslator2(null)).toBeNull();
    expect(fileSizeTranslator2('hello world')).toBeNull();
    expect(fileSizeTranslator2(undefined)).toBeNull();
    expect(fileSizeTranslator2({})).toBeNull();
    // We should never expect a file size to be 0
    expect(fileSizeTranslator2(0)).toBeNull();
  });
});
