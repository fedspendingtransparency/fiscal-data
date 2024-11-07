import { mockDatasets } from '../mockData/mockDatasets';
import Fuse from 'fuse.js';

describe('search engine', () => {
  let searchEngine;

  beforeAll(() => {
    const options = { keys: ['name', 'summaryText', 'relatedTopics', 'allPrettyNames'], threshold: 0.2, includeScore: true, ignoreLocation: true };
    const searchIndex = Fuse.createIndex(options.keys, mockDatasets);
    searchEngine = new Fuse(mockDatasets, options, searchIndex);
  });

  it('returns correctly filtered results when matching terms in title', () => {
    const filteredResults = searchEngine.search('Offset').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(1);
    console.log(filteredResults);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[0].datasetId);
  });

  it('returns correctly filtered results when matching terms in short description', () => {
    const filteredResults = searchEngine.search('DTTP').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[1].datasetId);
  });

  it('returns correctly filtered results when matching terms in long description', () => {
    const filteredResults = searchEngine.search('security').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[2].datasetId);
  });

  it('returns correctly filtered results when matching terms in relatedTopics', () => {
    const filteredResults = searchEngine.search('bonds').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[0].datasetId);
  });

  it('returns correctly filtered results when matching terms in prettyName', () => {
    const filteredResults = searchEngine.search('SomeCrazyName').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(2);
    expect(filteredResults[1].datasetId).toContain('dataset_id_2');
    expect(filteredResults[0].datasetId).toContain('015-BFS-2014Q1-11');
  });

  it('returns datasets with partial match', () => {
    const filteredResults = searchEngine.search('da').map(result => {
      return { ...result.item, score: result.score };
    }); // as in "data" and "day"
    expect(filteredResults.length).toBe(2);
  });

  it('returns an empty array when no terms match anywhere', () => {
    const filteredResults = searchEngine.search('banana').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(0);
  });

  it('returns all datasets when search is empty', () => {
    const filteredResults = searchEngine.search(' ').map(result => {
      return { ...result.item, score: result.score };
    });
    expect(filteredResults.length).toBe(3);
  });
});
