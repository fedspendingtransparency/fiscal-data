import SearchFilter from '../search-filter/search-filter';
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Search Filter', () => {
  const mockColumnConfig = { columnName: 'testCol' };
  const mockFilterMap = { testCol: { pendingValue: '', filterValue: '' } };
  const setFilterMapSpy = jest.fn();

  it('renders a search bar', () => {
    const { getByRole } = render(<SearchFilter columnConfig={mockColumnConfig} filterMap={mockFilterMap} searchLabel="Enter filter term" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('updates list on search text change', () => {
    const { getByRole } = render(
      <SearchFilter
        columnConfig={mockColumnConfig}
        filterMap={mockFilterMap}
        setFilterMap={setFilterMapSpy}
        searchLabel="Enter filter term"
        header="Description"
      />
    );
    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);
    userEvent.keyboard('search filter text...');
    expect(setFilterMapSpy).toHaveBeenCalledWith({ testCol: { pendingValue: 'search filter text...', filterValue: '' } });
  });
});
