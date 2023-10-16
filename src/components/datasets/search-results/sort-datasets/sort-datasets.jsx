import React from 'react';
import SelectControl from '../../../select-control/select-control';

const SortDatasets = ({ sortOptions, activeSort, setSort }) => (
  <SelectControl options={sortOptions} label="Sort By:" selectedOption={activeSort} ariaLabel="sort order" changeHandler={setSort} />
);

export default SortDatasets;
