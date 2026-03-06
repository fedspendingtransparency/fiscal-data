import SearchContainer from './search-container';
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Search Container', () => {
  const setFilter = jest.fn();
  it('renders a search bar', () => {
    const { getByRole } = render(
      <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
        list component
      </SearchContainer>
    );
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the child component', () => {
    const { getByText } = render(
      <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
        list component
      </SearchContainer>
    );
    expect(getByText('list component')).toBeInTheDocument();
  });

  it('updates list on search text change', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
        list component
      </SearchContainer>
    );
    const searchBar = getByRole('textbox');
    await user.click(searchBar);
    await user.keyboard('filter text...');
    expect(setFilter).toHaveBeenCalled();
  });

  it('clears search text', async () => {
    const user = userEvent.setup();
    const setNoResults = jest.fn();
    const { getByRole } = render(
      <SearchContainer setFilter={setFilter} filter="test" searchLabel="Search columns" setNoResults={setNoResults}>
        list component
      </SearchContainer>
    );
    await user.click(getByRole('button', { name: 'Clear search bar' }));
    expect(setFilter).toHaveBeenCalledWith('');
    expect(setNoResults).toHaveBeenCalledWith(false);
  });
});
