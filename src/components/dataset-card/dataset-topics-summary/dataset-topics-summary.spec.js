import React from 'react';
import renderer from 'react-test-renderer';
import DatasetTopicsSummary from './dataset-topics-summary';

describe('DatasetTopicsSummary', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const mockRelatedTopics = ['topic1', 'topic2'];
  const mockRelatedTopics2 = [];
  const tree = renderer.create(<DatasetTopicsSummary relatedTopics={mockRelatedTopics} />);
  const instance = tree.root;

  it('renders an element with a heading reading "TOPICS:"', () => {
    const headingElement = instance.findByProps({ 'data-test-id': 'topics-heading' });
    expect(headingElement).toBeDefined();
    expect(headingElement.children[0]).toBe('TOPICS:');
  });

  it('lists the topics given to it, separated by a comma and a space', () => {
    const topicsElement = instance.findByProps({ 'data-test-id': 'related-topics' });
    expect(topicsElement).toBeDefined();
    expect(topicsElement.props.children.props.children).toBe('topic1, topic2');
  });

  it('does not show a heading or a list if given an empty array', () => {
    const tree2 = renderer.create(<DatasetTopicsSummary relatedTopics={mockRelatedTopics2} />);
    const instance2 = tree2.root;
    const headingElement2 = instance2.findByProps({ 'data-test-id': 'topics-empty-div' });
    expect(headingElement2).toBeDefined();
  });
});
