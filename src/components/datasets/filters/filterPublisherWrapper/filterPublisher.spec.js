import React from 'react';
import FilterPublisher from './filterPublisher';
import { render, within } from '@testing-library/react';

describe('Filter Dataset Publisher', () => {
  it('renders an element with the test id "publisher-filter-wrapper', () => {
    const { getByTestId } = render(
      <FilterPublisher
        filterList={[
          { groupId: 'publisher', id: 'FA' },
          { groupId: 'non-publisher', id: 'NP' },
          { groupId: 'publisher', id: 'RSS' },
        ]}
      >
        Test Filter Publisher Wrapper
      </FilterPublisher>
    );
    const publisherFilterWrapper = getByTestId('publisher-filter-wrapper');
    expect(publisherFilterWrapper).toBeInTheDocument();
  });

  it('contains an outer container that calculates and displays a the number of publishers with the heading "Treasury Department"', () => {
    const { getByTestId } = render(
      <FilterPublisher
        filterList={[
          { groupId: 'publisher', id: 'FA' },
          { groupId: 'non-publisher', id: 'NP' },
          { groupId: 'publisher', id: 'RSS' },
        ]}
      >
        Test Filter Publisher Wrapper
      </FilterPublisher>
    );
    const outerLabel = getByTestId('publisher-outer-container-label');
    expect(outerLabel).toBeInTheDocument();
    const publisherCount = within(outerLabel).getByTestId('publisher-count');
    expect(publisherCount).toBeInTheDocument();
    expect(within(publisherCount).getByText('2 Publishers')).toBeInTheDocument();
    const outerContainer = getByTestId('publisher-outer-container');
    expect(outerContainer).toBeInTheDocument();
    const treasuryLabel = within(outerContainer).getByTestId('treasury-label');
    expect(within(treasuryLabel).getByText('Treasury Department')).toBeInTheDocument();
  });

  it('shows an inner “Bureau of the Fiscal Service” section with the right count', () => {
    const { getByTestId } = render(
      <FilterPublisher
        filterList={[
          { groupId: 'publisher', id: 'FA' },
          { groupId: 'non-publisher', id: 'NP' },
          { groupId: 'publisher', id: 'RSS' },
        ]}
      >
        Test Filter Publisher Wrapper
      </FilterPublisher>
    );

    // ---- label above the inner container ----
    const innerLabel = getByTestId('publisher-inner-container-label');
    expect(innerLabel).toBeInTheDocument();

    const publisherCount = within(innerLabel).getByTestId('publisher-count');
    expect(within(publisherCount).getByText('2 Publishers')).toBeInTheDocument();

    // ---- actual inner container ----
    const innerContainer = getByTestId('publisher-inner-container');
    expect(innerContainer).toBeInTheDocument();

    const bfsLabel = within(innerContainer).getByTestId('fiscal-title');
    expect(bfsLabel).toHaveTextContent('Bureau of the Fiscal Service');
  });

  it('contains a child inside wrapper', () => {
    const { getByText } = render(
      <FilterPublisher
        filterList={[
          { groupId: 'publisher', id: 'FA' },
          { groupId: 'non-publisher', id: 'NP' },
          { groupId: 'publisher', id: 'RSS' },
        ]}
      >
        Test Filter Publisher Wrapper
      </FilterPublisher>
    );
    expect(getByText('Test Filter Publisher Wrapper')).toBeInTheDocument();
  });
});
