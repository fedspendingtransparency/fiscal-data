import { addDatasetToTopic, freshTopics } from './topics-config';

describe('Topics Config', () => {
  it('adds dataset to correct topic', () => {
    addDatasetToTopic('debt', 'test-id');
    const topics = freshTopics();
    expect(topics.filter(t => t.slug === 'debt')[0].datasetIds).toStrictEqual(['test-id']);
  });

  it('does not duplicate output', () => {
    addDatasetToTopic('debt', 'test-id');
    addDatasetToTopic('debt', 'test-id');
    const topics = freshTopics();
    expect(topics.filter(t => t.slug === 'debt')[0].datasetIds).toStrictEqual(['test-id']);
  });

  it('warns when trying to add an invalid topic and does not add anything', () => {
    global.console.warn = jest.fn();

    const preTopics = freshTopics();
    addDatasetToTopic('weird-topic', 'test-id');
    const topics = freshTopics();

    expect(global.console.warn).toHaveBeenCalled();
    expect(topics).toStrictEqual(preTopics);
  });
});
