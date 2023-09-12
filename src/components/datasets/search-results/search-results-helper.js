export const SortOptions = [
    {
        id: 'relevance',
        label: 'Most Relevant',
        sortFn: (a, b) => {return b.searchScore - a.searchScore}
    },
    {
        id: 'lastUpdated',
        label: 'Recently Updated',
        sortFn: (a, b) => {return Date.parse(b.techSpecs.lastUpdated) - Date.parse(a.techSpecs.lastUpdated)}
    },
    {
        id: 'alpha',
        label: 'Alphabetical (A to Z)',
        sortFn: (a, b) => {return a.name.localeCompare(b.name)}
    },
    {
        id: 'alphaReversed',
        label: 'Alphabetical (Z to A)',
        sortFn: (a, b) => {return b.name.localeCompare(a.name)}
    }
];

export const SortOptionsIndexed = {};

SortOptions.forEach(item => SortOptionsIndexed[item.id] = item);

export const FilteredSortOptions = SortOptions.filter(opt => opt.id !== 'relevance');

export const PerformSort = (activeSort, list) => {
    list.sort(activeSort.sortFn)
};
