import React from 'react';
import renderer from 'react-test-renderer';
import ReactMarkdown from 'react-markdown';

// Adding a skip in here for now because we have lost the ability to use React Markdown in our test environment
// Jest lacks full support of ESM which is now required with more recent versions of ReactMarkdown

describe.skip('ReactMarkdown', () => {
  it('renders markdown into html', () => {
    const input = `# API Documentation`;
    const tree = renderer.create(<ReactMarkdown children={input} />);
    const instance = tree.root;
    const h1 = instance.findByType('h1');
    expect(h1).toBeDefined();
  });
});
