import React from 'react';
import { render } from '@testing-library/react';
import { MarkdownTransform } from './markdown-transform';

const testContent = 'This is a link in markdown: [Link](https://fiscaldata.treasury.gov)';

describe('Markdown transform', () => {
  it('renders markdown content', () => {
    const { getByText } = render(<MarkdownTransform content={testContent} />);
    expect(getByText('Link', { exact: false })).toBeInTheDocument();
  });
});
