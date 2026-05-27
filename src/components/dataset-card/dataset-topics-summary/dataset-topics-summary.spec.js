import React from 'react';
import DatasetTopicsSummary from './dataset-topics-summary';
import { render } from '@testing-library/react';

describe('DatasetTopicsSummary', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const mockRelatedTopics = ['topic1', 'topic2'];
  const mockRelatedTopics2 = [];

  it('renders an element with a heading reading "TOPICS:"', () => {
    const { getByText } = render(<DatasetTopicsSummary relatedTopics={mockRelatedTopics} />);
    const headingElement = getByText('TOPICS:');
    expect(headingElement).toBeInTheDocument();
  });

  it('lists the topics given to it, separated by a comma and a space', () => {
    const { getByText } = render(<DatasetTopicsSummary relatedTopics={mockRelatedTopics} />);

    const topicsElement = getByText('topic1, topic2');
    expect(topicsElement).toBeInTheDocument();
  });

  it('does not show a heading or a list if given an empty array', () => {
    const { getByTestId } = render(<DatasetTopicsSummary relatedTopics={mockRelatedTopics2} />);
    const headingElement2 = getByTestId('topics-empty-div');
    expect(headingElement2).toBeInTheDocument();
  });
});
