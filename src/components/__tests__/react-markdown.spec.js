import React from 'react';
import ReactMarkdown from 'react-markdown';
import { render } from '@testing-library/react';

// Adding a skip in here for now because we have lost the ability to use React Markdown in our test environment
// Jest lacks full support of ESM which is now required with more recent versions of ReactMarkdown

describe.skip('ReactMarkdown', () => {
  it('renders markdown into html', () => {
    render(<ReactMarkdown children={input} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('API Documentation');
  });
});
