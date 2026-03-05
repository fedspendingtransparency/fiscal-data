import React from 'react';
import { render } from '@testing-library/react';
import SortDatasets from './sort-datasets';
import { SortOptions } from '../search-results-helper';
import userEvent from '@testing-library/user-event';

const searchIsActive = true;
const onSort = jest.fn();

describe('Sort Datasets', () => {
  it('passes the sort options to the select control', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<SortDatasets setSort={onSort} searchIsActive={searchIsActive} sortOptions={SortOptions} />);
    const selectControl = getByRole('button');
    await user.click(selectControl);
    SortOptions.forEach(option => {
      expect(getByRole('button', { name: option.label })).toBeInTheDocument();
    });
  });

  it('passes the callback to the sort control', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<SortDatasets setSort={onSort} searchIsActive={searchIsActive} sortOptions={SortOptions} />);
    const selectControl = getByRole('button');
    await user.click(selectControl);
    const sortOption = getByRole('button', { name: SortOptions[1].label });
    await user.click(sortOption);
    expect(onSort).toHaveBeenCalled();
  });
});
