import React from 'react';
import KeyTakeawaysSection from './key-takeaways-section';
import { render } from '@testing-library/react';
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins';

describe('Key Takeaways', () => {
  const mockTakeaways = [
    {
      text: 'sample text',
      icon: faCoins,
    },
    {
      text: 'more text',
      icon: faCoins,
    },
  ];
  it('renders the text and icon for the given takeaways', () => {
    const { getByText, getAllByRole } = render(<KeyTakeawaysSection takeaways={mockTakeaways} />);
    expect(getByText('sample text')).toBeInTheDocument();
    expect(getByText('more text')).toBeInTheDocument();
    expect(getAllByRole('img', { hidden: true }, { name: 'coins' })).toBeDefined();
  });
});
