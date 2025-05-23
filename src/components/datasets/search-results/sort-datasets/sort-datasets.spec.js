import React from 'react';
import { render } from '@testing-library/react';
import SortDatasets from './sort-datasets';
import { SortOptions } from '../search-results-helper';
import userEvent from '@testing-library/user-event';

const searchIsActive = true;
const onSort = jest.fn();

describe('Sort Datasets', () => {
  it('passes the sort options to the select control', () => {
    const { getByRole } = render(<SortDatasets setSort={onSort} searchIsActive={searchIsActive} sortOptions={SortOptions} />);
    const selectControl = getByRole('button');
    userEvent.click(selectControl);
    SortOptions.forEach(option => {
      expect(getByRole('button', { name: option.label })).toBeInTheDocument();
    });
  });

  it('passes the callback to the sort control', () => {
    const { getByRole } = render(<SortDatasets setSort={onSort} searchIsActive={searchIsActive} sortOptions={SortOptions} />);
    const selectControl = getByRole('button');
    userEvent.click(selectControl);
    const sortOption = getByRole('button', { name: SortOptions[1].label });
    userEvent.click(sortOption);
    expect(onSort).toHaveBeenCalled();
  });
});
