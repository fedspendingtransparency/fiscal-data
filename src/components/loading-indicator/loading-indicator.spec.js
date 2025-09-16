import React from 'react';
import { render } from '@testing-library/react';
import LoadingIndicator from './loading-indicator';

describe('', () => {
  it('renders the loading indicator', () => {
    const { getByText } = render(<LoadingIndicator />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});
