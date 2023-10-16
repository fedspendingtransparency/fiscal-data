import React from 'react';
import { count_values } from './search-result-count.module.scss';

export const getSearchResultText = (filtered, total, apiFiltered, apiTotal) =>
  `Showing ${filtered} of ${total} Datasets, ${apiFiltered} of ${apiTotal} Data Tables`;

const SearchResultCount = ({ filteredCount, totalCount, filteredApiCount, totalApiCount }) => {
  const text = getSearchResultText(filteredCount, totalCount, filteredApiCount, totalApiCount);

  return <div className={count_values}>{text}</div>;
};

export default SearchResultCount;
