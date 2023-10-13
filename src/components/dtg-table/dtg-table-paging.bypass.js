import React from 'react';
import renderer from 'react-test-renderer';
import DtgTable from './dtg-table';
import PaginationControls from '../pagination/pagination-controls';

const testData = [];

for (var i = 0; i < 30; i++) {
  testData.push(
    Object.assign(
      {},
      {
        first: 'first',
        age: 21,
        middle: 'mid',
        last: 'last',
        birthplace: 'city, st',
      }
    )
  );
}

describe('DTG table component', () => {
  let component;

  renderer.act(() => {
    component = renderer.create(<DtgTable tableProps={{ data: testData, shouldPage: true }} />);
  });

  const instance = component.root;

  // it('render PaginationControls when shouldPage && maxRows > itemsPerPage', () => {
  //   console.log(testData.length);
  //   expect(instance.findByType(PaginationControls)).toBeDefined();
  // });

  // it('initializes itemsPerPage to 20 when not specified in props', () => {
  //   console.log(testData.length);
  //   expect(instance.findByType(PaginationControls).props.pagingProps).toContain(20);
  // });

  it('overrides itemsPerPage when perPage specified in props', () => {
    renderer.act(() => {
      component.update(<DtgTable tableProps={{ data: testData, shouldPage: true, perPage: 10 }} />);
    });
    expect(instance.findByType(PaginationControls).props.pagingProps).toContain(10);
  });

  it('does not show controls if totalRows < itemsPerPage', () => {
    renderer.act(() => {
      component.update(<DtgTable tableProps={{ data: testData, shouldPage: true, perPage: 50 }} />);
    });
    expect(instance.findAllByType(PaginationControls)).toStrictEqual([]);
  });
});
