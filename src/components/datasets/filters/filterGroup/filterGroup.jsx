import React from 'react';
import FilterRow from '../filterRow/filterRow';

const FilterGroup = ({ groupId, onChange, filterTally, currentFilters, analyticsObject = {} }) => (
  <div data-testid={`${groupId}Filter`}>
    {currentFilters
      .filter(filter => filter.groupId === groupId)
      .map(filter => (
        <FilterRow
          filterKey={filter.id}
          key={filter.id}
          onChange={onChange}
          currentState={filter.active}
          title={filter.label}
          filterTally={{
            count: filterTally[filter.id] ? filterTally[filter.id] : 0,
            of: filterTally.total,
          }}
          analyticsObject={analyticsObject}
        >
          {filter.label}
        </FilterRow>
      ))}
  </div>
);

export default FilterGroup;
