import React from 'react';
import NotFoundPage from './index';
import { render } from '@testing-library/react';

describe('404 page', () => {
  it('renders the not found component', () => {
    const { getByTestId } = render(<NotFoundPage />);
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});

describe('fallback page', () => {
  it('renders the fallback component', () => {
    const { getByTestId } = render(<NotFoundPage />);
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});
