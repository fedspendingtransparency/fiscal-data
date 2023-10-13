import React from 'react';
import { render } from '@testing-library/react';
import AboutUsPage from './index';
import tocData from './toc-data.json';

jest.mock('gatsby-plugin-mdx', () => {
  return {
    MDXRenderer: ({ children }) => {
      return <div>{children}</div>;
    },
  };
});

describe('About Us page', () => {
  it('renders a table of contents with correct content', () => {
    const { getAllByText } = render(<AboutUsPage />);

    tocData.forEach(item => {
      expect(getAllByText(item.title)[0]).toBeInTheDocument();
    });
  });

  it('renders the About section component', () => {
    const { container } = render(<AboutUsPage />);
    expect(container.querySelector('#about-fiscal-data')).toBeInTheDocument();
  });

  it('renders the FAQ section component', () => {
    const { container } = render(<AboutUsPage />);
    expect(container.querySelector('#faq')).toBeInTheDocument();
  });

  it('renders the Contact section component', () => {
    const { container } = render(<AboutUsPage />);
    expect(container.querySelector('#contact-us')).toBeInTheDocument();
  });
});
