import React from 'react';
import UnavailablePage from './index';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

jest.mock('gatsby-plugin-mdx', () => {
  return {
    MDXRenderer: ({ children }) => {
      return <div>{children}</div>;
    },
  };
});

describe('Unavailable page', () => {
  it('renders page helmet with expected document title', async () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };

    render(<UnavailablePage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    await waitFor(() => expect(document.title).toContain('Site Outage Page'));
  });

  it('renders the unavailable component', () => {
    const data = {
      mdx: {
        body: '<div>Test</div>',
        frontmatter: {
          title: 'Test Title',
        },
      },
    };
    const { getByTestId } = render(<UnavailablePage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    const unavailable = getByTestId('unavailableWrapper');
    expect(unavailable).toBeInTheDocument();
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
    render(<UnavailablePage pageContext={{}} data={data} fallback={true} />, { wrapper: RecoilRoot });
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
    const { getByTestId } = render(<UnavailablePage pageContext={{}} data={data} />, { wrapper: RecoilRoot });
    const unavailable = getByTestId('unavailableWrapper');
    expect(unavailable).toBeInTheDocument();
  });
});
