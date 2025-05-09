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

  it('updates list on search text change', () => {
    const { getByRole } = render(
      <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
        list component
      </SearchContainer>
    );
    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);
    userEvent.keyboard('filter text...');
    expect(setFilter).toHaveBeenCalled();
    // userEvent.click(getByRole('button', { name: 'clear' }));
    // expect(setFilter).toHaveBeenCalledWith('');
  });
});
