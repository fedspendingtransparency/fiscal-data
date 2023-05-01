import { render } from '@testing-library/react';
import React from 'react';
import GlossaryList from './glossary-list';
describe('glossary header',() => {
  it('contains the initial list header', () => {
    const { getByText } = render(<GlossaryList />);

    expect(getByText('All Terms')).toBeInTheDocument();
  });
});
