import {SortOptions, SortOptionsIndexed, FilteredSortOptions, PerformSort} from "./search-results-helper";

const mockDatasets = [
    {
        name: 'Dataset C',
        searchScore: 0.8,
        techSpecs: {lastUpdated: '2020-04-01'}
    },
    {
        name: 'Dataset B',
        searchScore: 0.5,
        techSpecs: {lastUpdated: '2020-01-01'}
    },
    {
        name: 'Dataset A',
        searchScore: 0.2,
        techSpecs: {lastUpdated: '2020-10-01'}
    }
];

describe('search results helper', () => {
    it('establishes sort options with four values', () => {
        expect(SortOptions.length).toBe(4);
    })

    it('sets indexes the sort options', () => {
        expect(Object.keys(SortOptionsIndexed).length).toBe(SortOptions.length);
    })

    it('sets a label property for each option', () => {
        SortOptions.forEach(opt => expect(opt.label).toBeDefined());
    })

    it('provides a filtered list that removes the relevance option', () => {
        expect(FilteredSortOptions.every(opt => opt.id !== 'relevance')).toBeTruthy();
    })

    it('sorts by last updated', () => {
        PerformSort(SortOptions[1], mockDatasets);
        expect(mockDatasets[0].name).toBe('Dataset A');
    })

    it('sorts by title from A to Z', () => {
        PerformSort(SortOptions[2], mockDatasets);
        expect(mockDatasets[0].name).toBe('Dataset A');
    })

    it('sorts by title from Z to A', () => {
        PerformSort(SortOptions[3], mockDatasets);
        expect(mockDatasets[0].name).toBe('Dataset C');
    })

    it('sorts by relevance', () => {
        PerformSort(SortOptions[0], mockDatasets);
        expect(mockDatasets[0].name).toBe('Dataset C');
    })
})
