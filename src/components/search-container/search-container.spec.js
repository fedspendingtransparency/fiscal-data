import SearchContainer from './search-container';
import { render } from '@testing-library/react';

describe('Search Container', () => {
  const mockList = [];
  const onSearch = jest.fn();
  it('renders a search bar', () => {
    const { getByRole } = render(<SearchContainer list={mockList} onSearchBarChange={onSearch} />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a searchable list', () => {
    const { getAllByRole } = render(<SearchContainer list={mockList} onSearchBarChange={onSearch} />);
    expect(getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('updates list on search text change', () => {
    const { getByRole } = render(<SearchContainer list={mockList} onSearchBarChange={onSearch} />);
    const searchBar = getByRole('textbox');

    expect(onSearch).toHaveBeenCalled();
  });
});
