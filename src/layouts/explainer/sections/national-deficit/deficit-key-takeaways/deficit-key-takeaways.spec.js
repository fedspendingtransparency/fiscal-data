import { render, waitFor} from '@testing-library/react';
import React from 'react';
import DeficitKeyTakeaways from './deficit-key-takeaways';

describe('Spending Key Takeaways evergreen values', () => {

  it('renders the link correctly in takeaway 3', async() => {
    const { getByRole } = render(<DeficitKeyTakeaways />);
    expect(getByRole('link')).toHaveAttribute('href', '/americas-finance-guide/national-debt/');
  })
})
