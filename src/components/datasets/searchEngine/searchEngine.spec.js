import { DatasetSearch } from './searchEngine';
import { mockDatasets } from '../mockData/mockDatasets';

describe('search engine', () => {
  let searchEngine;

  beforeAll(() => {
    searchEngine = new DatasetSearch();
    searchEngine.init(mockDatasets);
  });

  it('returns correctly filtered results when matching terms in title', () => {
    const filteredResults = searchEngine.search('Offset');
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[0].datasetId);
  });

  it('returns correctly filtered results when matching terms in short description', () => {
    const filteredResults = searchEngine.search('DTTP');
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[1].datasetId);
  });

  it('returns correctly filtered results when matching terms in long description', () => {
    const filteredResults = searchEngine.search('security');
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[2].datasetId);
  });

  it('returns correctly filtered results when matching terms in relatedTopics', () => {
    const filteredResults = searchEngine.search('bonds');
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[0].datasetId);
  });

  it('returns correctly filtered results when matching terms in columnName', () => {
    const filteredResults = searchEngine.search('record_fiscal_year');
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].datasetId).toBe(mockDatasets[0].datasetId);
  });

  it('returns correctly filtered results when matching terms in prettyName', () => {
    const filteredResults = searchEngine.search('SomeCrazyName');
    expect(filteredResults.length).toBe(2);
    expect(filteredResults[0].datasetId).toContain('dataset_id_2');
    expect(filteredResults[1].datasetId).toContain('015-BFS-2014Q1-11');
  });

  it('returns datasets with partial match', () => {
    const filteredResults = searchEngine.search('da'); // as in "data" and "day"
    expect(filteredResults.length).toBe(2);
  });

  it('returns an empty array when no terms match anywhere', () => {
    const filteredResults = searchEngine.search('banana');
    expect(filteredResults.length).toBe(0);
  });

  it('returns all datasets when search is empty', () => {
    const filteredResults = searchEngine.search(' ');
    expect(filteredResults.length).toBe(3);
  });
});
