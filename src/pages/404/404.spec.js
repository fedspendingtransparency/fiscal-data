import React from 'react';
import NotFoundPage from './index';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('404 page', () => {
  // it('renders page helmet with expected document title', async () => {
  //   render(<NotFoundPage />, { wrapper: RecoilRoot });
  //   await waitFor(() => expect(document.title).toContain('Page Not Found'));
  // });

  it('renders the not found component', () => {
    const { getByTestId } = render(<NotFoundPage />, { wrapper: RecoilRoot });
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});

describe('fallback page', () => {
  it('renders page helmet with expected document title', async () => {
    render(<NotFoundPage pageContext={{ fallback: true }} />, { wrapper: RecoilRoot });
    await waitFor(() => expect(document.title).toContain('Content Currently Unavailable'));
  });

  it('renders the fallback component', () => {
    const { getByTestId } = render(<NotFoundPage />, { wrapper: RecoilRoot });
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});
