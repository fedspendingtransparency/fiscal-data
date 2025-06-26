import SearchFilter from '../search-filter/search-filter';
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Search Filter', () => {
  it('renders a search bar', () => {
    const { getByRole } = render(<SearchFilter columnConfig={{ pendingValue: '' }} searchLabel="Enter filter term" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('updates list on search text change', () => {
    const mockConfig = { pendingValue: '' };
    const { getByRole } = render(<SearchFilter columnConfig={mockConfig} searchLabel="Enter filter term" header={'Description'} />);
    const searchBar = getByRole('textbox');
    userEvent.click(searchBar);
    userEvent.keyboard('search filter text...');
    expect(mockConfig.pendingValue).toBe('search filter text...');
  });
});
