import React from 'react';
import NotFoundPage from './index';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('404 page', () => {
  it('renders page helmet with expected document title', async () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };
    render(<NotFoundPage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    await waitFor(() => expect(document.title).toContain('Page Not Found'));
  });

  it('renders the not found component', () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };
    const { getByTestId } = render(<NotFoundPage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});

describe('fallback page', () => {
  it('renders page helmet with expected document title', async () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };
    render(<NotFoundPage pageContext={{}} data={data} fallback={true} />, { wrapper: RecoilRoot });
    await waitFor(() => expect(document.title).toContain('Content Currently Unavailable'));
  });

  it('renders the fallback component', () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };
    const { getByTestId } = render(<NotFoundPage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });
});
