import React from 'react';
import { render } from '@testing-library/react';
import SearchResults, { getApiCount, resultsHeaderText, noResultsText } from './search-results';
import { getSearchResultText } from '../search-result-count/search-result-count';
import { SortOptions, FilteredSortOptions } from './search-results-helper';
import { sortSelectionContainer } from './search-results.module.scss';

const mockAllDatasets = [
  { name: 'Dataset A', techSpecs: { lastUpdated: 1/1/2000 } },
  { name: 'Dataset B', techSpecs: { lastUpdated: 2/1/2000 } },
  { name: 'Dataset C', techSpecs: { lastUpdated: 3/2/2000 } },
  { name: 'Dataset D', techSpecs: { lastUpdated: 3/1/2000 } },
  { name: 'Dataset E', techSpecs: { lastUpdated: 10/1/2000 } }
];
const mockFilteredDatasets = [
  mockAllDatasets[0],
  mockAllDatasets[1],
  mockAllDatasets[2]
];
const searchIsActive = true;
const mockTotal = 10;

describe('Search Results', () => {
  it('places the section title', () => {
    const { getByText } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive={searchIsActive}
      />
    );

    expect(getByText(resultsHeaderText)).toBeInTheDocument();
  });

  it('places the search result count component twice', () => {
    const { getAllByText } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive={searchIsActive}
      />
    );

    const apiFilteredCount = getApiCount(mockFilteredDatasets);
    const apiTotalCount = getApiCount(mockAllDatasets);

    const text = getSearchResultText(
      mockFilteredDatasets.length,
      mockAllDatasets.length,
      apiFilteredCount,
      apiTotalCount
    );

    expect(getAllByText(text)).toHaveLength(2);
  });

  it('places the search results cards', () => {
    const { getAllByTestId } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive={searchIsActive}
      />
    );

    expect(getAllByTestId('cardPlacement')).toHaveLength(mockAllDatasets.length);
  });

  it('places the sort control', () => {
    const { container } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive
      />
    );

    expect(container.querySelector(`.${sortSelectionContainer}`)).toBeInTheDocument();
  });

  it('passes the sort options to the sort component', () => {
    const { getByText } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive
      />
    );

    expect(getByText(SortOptions[0].label)).toBeInTheDocument();
  });

  it('passes the filtered list of options to the sort control when search is inactive', () => {
    const { getByText } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive={false}
      />
    );

    expect(getByText(FilteredSortOptions[0].label)).toBeInTheDocument();
  });

  it('changes the sort back to alpha when search is cleared', () => {
    const { getByText, rerender } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive
      />
    );

    expect(getByText(SortOptions[0].label)).toBeInTheDocument();
    
    rerender(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive={false}
      />
    );
    expect(getByText(FilteredSortOptions[0].label)).toBeInTheDocument();
  });

  it('displays an info box when no search results are returned', () => {
    const { queryByText, getByText, rerender } = render(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={mockFilteredDatasets}
        totalCount={mockTotal}
        searchIsActive
      />
    );

    expect(queryByText(noResultsText.heading)).not.toBeInTheDocument();

    rerender(
      <SearchResults
        allDatasets={mockAllDatasets}
        filteredDatasets={[]}
        totalCount={mockTotal}
        searchIsActive={false}
      />
    );

    expect(getByText(noResultsText.heading)).toBeInTheDocument();
    expect(getByText(noResultsText.subHeading)).toBeInTheDocument();
    for (const text of noResultsText.bulletPoints) {
      expect(getByText(text)).toBeInTheDocument();
    }
  });
});
