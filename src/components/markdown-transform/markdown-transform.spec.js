import React from 'react';
import { render } from '@testing-library/react';
import { MarkdownTransform } from './markdown-transform';
import rehypeSanitize, { defaultSchema } from './rehype-sanitize';
import { ReactMarkdown } from 'react-markdown';

const testContent = 'This is a link in markdown: [Link](https://fiscaldata.treasury.gov)';
jest.mock('react-markdown', () => {
  const mockReact = require('react');
  const mockComponent = jest.fn(({ children }) => mockReact.createElement(mockReact.Fragment, null, children));
  return { __esModule: true, default: mockComponent };
});

describe('Markdown transform', () => {
  it('renders markdown content', () => {
    const { getByText } = render(<MarkdownTransform content={testContent} />);
    expect(getByText('Link', { exact: false })).toBeInTheDocument();
  });

  it('renders markdown content for banner', () => {
    const { getByText } = render(<MarkdownTransform content={testContent} isBanner={true} />);
    expect(getByText('Link', { exact: false })).toBeInTheDocument();
  });

  it('chains rehype- sanitized', () => {
    ReactMarkdown.mockClear();
    render(<MarkdownTransform content={testContent} isBanner={true} />);
    const { rehypePlugins } = ReactMarkdown.mock.calls[0][0];
    expect(rehypePlugins[rehypePlugins.length - 1]).toEqual([rehypeSanitize, defaultSchema]);
  });
});
