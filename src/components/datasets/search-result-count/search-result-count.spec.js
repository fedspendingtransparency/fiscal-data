import React from 'react';
import { render } from '@testing-library/react';
import SearchResultCount, { getSearchResultText } from './search-result-count';

const testCount = 3;
const testTotal = 5;
const testApiCount = 8;
const testApiTotal = 12;

describe('SearchResultCount', () => {
  it('displays the expected output', () => {
    const text = getSearchResultText(testCount, testTotal, testApiCount, testApiTotal);

    const { getByText } = render(
      <SearchResultCount
        filteredCount={testCount}
        totalCount={testTotal}
        filteredApiCount={testApiCount}
        totalApiCount={testApiTotal}
      />
    );

    expect(getByText(text)).toBeInTheDocument();
  });
});
