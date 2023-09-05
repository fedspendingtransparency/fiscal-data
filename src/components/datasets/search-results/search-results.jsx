import React, { useState, useEffect } from "react";
import SearchResultCount from '../search-result-count/search-result-count';
import SearchResultCards from './search-result-cards/search-result-cards';
import SortDatasets from './sort-datasets/sort-datasets';
import { SortOptions, FilteredSortOptions } from './search-results-helper';
import NotShownMessage
  from "../../dataset-data/table-section-container/not-shown-message/not-shown-message";
import Analytics from "../../../utils/analytics/analytics";

import {
  noMargin,
  datasetHeader,
  datasetsSubtitle,
  sortSelectionContainer
} from './search-results.module.scss';

export const sortDatasetsAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Sort Click'
}

export const resultsHeaderText = 'Results:';

export const noResultsText = {
  heading: 'Sorry, no results were found matching your search.',
  subHeading: 'Try your search again using these tips:',
  bulletPoints: [
    'Double-check your spelling',
    'Broaden your search by using fewer or more general words',
    'Remove some of your selected filters or topics, if applicable'
  ]
}

export const getApiCount = (datasets) => {
  let totalCount = 0;

  for (const dataset of datasets) {
    if (Array.isArray(dataset.apis)) {
      totalCount += dataset.apis.length;
    }
  }

  return totalCount;
}

const SearchResults = ({ searchIsActive, filteredDatasets, allDatasets }) => {
  const filteredDatasetsLength = filteredDatasets.length;
  const allDatasetsLength = allDatasets.length;

  const sortOptions = searchIsActive ? SortOptions : FilteredSortOptions;
  const [activeSort, setActiveSort] = useState(sortOptions[0]);
  const [totalApiLength, setTotalApiLength] = useState(0);
  const [filteredApiLength, setFilteredApiLength] = useState(0);

  const sortCallback = (sort) => {
    if (sort.label !== activeSort.label) {
      setActiveSort(sort);
      Analytics.event({
        ...sortDatasetsAnalyticsObject,
        label: sort.label
      });

      // GA4 event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Sort Click',
        'eventLabel': sort.label
      });
    }
  }

  const noResultBody = (
    <div>
      {noResultsText.subHeading}
      <ul className={noMargin}>
        {noResultsText.bulletPoints.map((bp, i) => (
          <li key={i}>{bp}</li>
        ))}
      </ul>
    </div>
  );

  const noResultsMessage = (
    <NotShownMessage
      heading={noResultsText.heading}
      bodyText={noResultBody}
    />
  );

  useEffect(() => setActiveSort(sortOptions[0]), [sortOptions, searchIsActive]);

  useEffect(() => {
    const filteredCount = getApiCount(filteredDatasets);
    setFilteredApiLength(filteredCount);
  }, [filteredDatasets]);

  useEffect(() => {
    const totalCount = getApiCount(allDatasets);
    setTotalApiLength(totalCount);
  }, [allDatasets]);

  return (
    <>
      <div className={datasetHeader}>
        <div>
          <h3 className={datasetsSubtitle}>{resultsHeaderText}</h3>
          <SearchResultCount
            filteredCount={filteredDatasetsLength}
            totalCount={allDatasetsLength}
            filteredApiCount={filteredApiLength}
            totalApiCount={totalApiLength}
          />
        </div>
        <div className={sortSelectionContainer}>
          <SortDatasets setSort={sortCallback} activeSort={activeSort} sortOptions={sortOptions} />
        </div>
      </div>
      {filteredDatasetsLength ? (
        <SearchResultCards
          allDatasets={allDatasets}
          filteredDatasets={filteredDatasets}
          activeSort={activeSort}
        />
      ) : (
        <div>{noResultsMessage}</div>
      )}
      <SearchResultCount
        filteredCount={filteredDatasetsLength}
        totalCount={allDatasetsLength}
        filteredApiCount={filteredApiLength}
        totalApiCount={totalApiLength}
      />
    </>
  )
}

export default SearchResults;
