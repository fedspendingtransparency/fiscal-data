import { SpendingCategories } from './spending-categories';
import { render } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/react';

describe('Federal Spending Overview', () => {
  it('renders the subcategory header', () => {
    const { getByRole } = render(<SpendingCategories />);
    expect(getByRole('heading', { name: 'What does the government buy?' })).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const { getByText } = render(<SpendingCategories />);
    const accordion = getByText('What does the future of Social Security and Medicare look like?');
    expect(accordion).toBeInTheDocument();
    fireEvent.click(accordion);
    expect(getByText('Each year, the Social Security', { exact: false })).toBeInTheDocument();
  });
});
