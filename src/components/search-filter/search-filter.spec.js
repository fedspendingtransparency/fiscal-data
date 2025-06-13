import SearchFilter from '../search-filter/search-filter';
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Search Filter', () => {
  const setFilter = jest.fn();
  it('renders a search bar', () => {
    const { getByRole } = render(<SearchFilter setFilter={setFilter} filter="" searchLabel="Enter filter term" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the header', () => {
    const { getByText } = render(<SearchFilter setFilter={setFilter} filter="" searchLabel="Enter filter term" header={'Description'} />);
    expect(getByText('Description')).toBeInTheDocument();
  });

  it('updates list on search text change', () => {
    const { getByRole } = render(<SearchFilter setFilter={setFilter} filter="" searchLabel="Enter filter term" header={'Description'} />);
    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);
    userEvent.keyboard('search filter text...');
    expect(setFilter).toHaveBeenCalled();
  });
});
