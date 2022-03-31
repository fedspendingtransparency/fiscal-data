import React from 'react';
import renderer from 'react-test-renderer';
import ReactMarkdown from 'react-markdown';

describe('ReactMarkdown', () => {
  it('renders markdown into html', () => {
    const input = `# API Documentation`;
    const tree = renderer.create(<ReactMarkdown source={input} />);
    const instance = tree.root;
    const h1 = instance.findByType('h1');
    expect(h1).toBeDefined();
  });
});
