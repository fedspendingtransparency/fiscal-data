import FilterRow from '../filterRow/filterRow';
import FilterGroup from './filterGroup';
import { renderHelper } from '../../../../helpers/renderHelper';
import React from 'react';
import { filtersByGroupId } from '../../../../transform/filters/filterDefinitions';
import { mockFilters } from '../../mockData/mockFilters';

describe('filter group', () => {
  const filters = mockFilters;
  filters.filter(filter => filter.id === 'ninetyDays')[0].active = true;

  const group = filtersByGroupId('lastUpdated', filters),
    mockChange = { mockKey: true },
    mockChangeHandler = jest.fn();

  let instance, renderer, rows;

  beforeEach(() => {
    ({ instance, renderer } = renderHelper(
      <FilterGroup
        onChange={mockChangeHandler}
        currentFilters={filters}
        filterTally={{
          lastYear: 3,
          ninetyDays: 2,
          total: 11,
        }}
        groupId="lastUpdated"
      />
    ));
    rows = instance.findAllByType(FilterRow);
  });

  it('renders a filter row for every item in the group', () => {
    expect(rows.length).toBe(group.length);
  });

  it('supplies a label to the filter row', () => {
    expect(rows[0].props.children).toBe(group[0].label);
  });

  it('passes filter changes up to the parent', () => {
    renderer.act(() => {
      rows[0].props.onChange(mockChange);
    });
    expect(mockChangeHandler).toHaveBeenCalledWith(mockChange);
  });

  it('passes the current state to the row', () => {
    expect(instance.findByProps({ filterKey: 'lastYear' }).props.currentState).toBeFalsy();
    expect(instance.findByProps({ filterKey: 'ninetyDays' }).props.currentState).toBeTruthy();
  });

  it('passes the relevant filter tally to the row', () => {
    expect(rows[0].props.filterTally.count).toBe(3);
    expect(rows[4].props.filterTally.count).toBe(2);
    expect(rows[2].props.filterTally).toStrictEqual({
      count: 0,
      of: 11,
    });
  });
});
