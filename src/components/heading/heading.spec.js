import React from 'react';
import { render } from '@testing-library/react';
import Heading from './heading';

describe('Heading', () => {
  it('renders a heading level 1 when specified', () => {
    const { getByRole } = render(<Heading headingLevel="h1">Mock Header</Heading>);
    expect(getByRole('heading', { level: 1, name: 'Mock Header' })).toBeInTheDocument();
  });

  it('renders a heading level 3 when specified', () => {
    const { getByRole } = render(<Heading headingLevel="h3">Mock Header</Heading>);
    expect(getByRole('heading', { level: 3, name: 'Mock Header' })).toBeInTheDocument();
  });
});
