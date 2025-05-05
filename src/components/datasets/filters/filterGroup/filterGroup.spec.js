import FilterGroup from './filterGroup';
import React from 'react';
import { filtersByGroupId } from '../../../../transform/filters/filterDefinitions';
import { mockFilters } from '../../mockData/mockFilters';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('filter group', () => {
  const filters = mockFilters;
  filters.filter(filter => filter.id === 'ninetyDays')[0].active = true;

  const group = filtersByGroupId('lastUpdated', filters),
    mockChange = { mockKey: true },
    mockChangeHandler = jest.fn();

  it('renders a filter row for every item in the group', () => {
    const { getAllByRole } = render(
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
    );
    expect(getAllByRole('checkbox').length).toBe(group.length);
  });

  it('supplies a label to the filter row', () => {
    const { getByRole } = render(
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
    );
    expect(getByRole('checkbox', { name: group[0].label })).toBeInTheDocument();
  });

  it('passes filter changes up to the parent', () => {
    const changeHandlerSpy = jest.fn();
    const { getByRole } = render(
      <FilterGroup
        onChange={changeHandlerSpy}
        currentFilters={filters}
        filterTally={{
          lastYear: 3,
          ninetyDays: 2,
          total: 11,
        }}
        groupId="lastUpdated"
      />
    );
    const firstRow = getByRole('checkbox', { name: group[0].label });
    userEvent.click(firstRow);
    expect(changeHandlerSpy).toHaveBeenCalledWith(mockChange);
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
