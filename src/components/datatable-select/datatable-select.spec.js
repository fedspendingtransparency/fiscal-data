import React from 'react';
import renderer from 'react-test-renderer';
import DataTableSelect, { allTablesOption } from './datatable-select';
import SelectControl from '../select-control/select-control';
import * as styles from './datatable-select.module.scss';

describe('DatatableSelect', () => {
  const earliestDate = 'test early date';
  const latestDate = 'test late date';

  const apisArr = [
    {
      tableName: 'Table 1',
    },
    {
      tableName: 'Table 2',
    },
    {
      tableName: 'Table 3',
    },
  ];

  const allTables = [
    {
      ...allTablesOption,
      earliestDate,
      latestDate,
    },
  ].concat(apisArr);

  const apisArrOne = [{ tableName: 'Only One Table' }];
  const mockSetSelectedTable = jest.fn();
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <DataTableSelect
        apis={apisArr}
        selectedTable={apisArr[0]}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
    );
  });
  const instance = component.root;

  it('passes the apisArr to SelectControl', () => {
    expect(instance.findByType(SelectControl).props.options).toEqual(allTables);
  });

  it('passes the selectedOption to SelectControl', () => {
    expect(instance.findByType(SelectControl).props.selectedOption).toEqual(apisArr[0]);
  });

  it('passes the changeHandler handler to SelectControl', () => {
    expect(instance.findByType(SelectControl).props.changeHandler).toEqual(mockSetSelectedTable);
  });

  it('does not appear on the page if there is only one table in the apis array', () => {
    let component2 = renderer.create();
    renderer.act(() => {
      component2 = renderer.create(<DataTableSelect apis={apisArrOne} selectedTable={apisArrOne[0]} setSelectedTable={mockSetSelectedTable} />);
    });
    const instance2 = component2.root;
    expect(instance2.findAllByProps({ className: styles.dataTableSelectWrapper }).length).toBe(0);
  });
});
