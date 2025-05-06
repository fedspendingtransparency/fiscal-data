import FilterGroup from './filterGroup';
import React from 'react';
import { filtersByGroupId } from '../../../../transform/filters/filterDefinitions';
import { mockFilters } from '../../mockData/mockFilters';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('filter group', () => {
  const filters = mockFilters;
  filters.filter(filter => filter.id === 'ninetyDays')[0].active = true;

  const group = filtersByGroupId('lastUpdated', filters),
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
    const firstRow = getByRole('checkbox', { name: group[0].label });
    userEvent.click(firstRow);
    expect(firstRow).toBeChecked();
    expect(mockChangeHandler).toHaveBeenCalled();
  });

  it('passes the current state to the row', () => {
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
    const lastYear = getByRole('checkbox', { name: 'lastYear' });
    const ninetyDays = getByRole('checkbox', { name: 'ninetyDays' });

    expect(lastYear).not.toBeChecked();
    expect(ninetyDays).toBeChecked();
  });

  it('passes the relevant filter tally to the row', () => {
    const { getAllByTestId } = render(
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
    const rows = getAllByTestId('filterRow');
    expect(within(rows[0]).getByText('3')).toBeInTheDocument();
    expect(within(rows[4]).getByText('2')).toBeInTheDocument();
    expect(within(rows[2]).getByText('0')).toBeInTheDocument();
  });
});
