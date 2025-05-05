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

  it('contains an inner container that also calculates and displays a the number of publishers with the heading "Bureau of Fiscal Service"', () => {
    const innerLabel = instance.findByProps({ 'data-testid': 'publisher-inner-container-label' });
    expect(innerLabel).toBeDefined();
    const publisherCount = innerLabel.findByProps({ 'data-testid': 'publisher-count' });
    expect(publisherCount).toBeDefined();
    expect(publisherCount.children[1]).toEqual('2 Publishers');
    const innerContainer = instance.findByProps({ 'data-testid': 'publisher-inner-container' });
    expect(innerContainer).toBeDefined();
    const bfsLabel = innerContainer.findByProps({ 'data-testid': 'fiscal-title' });
    expect(bfsLabel.children[0]).toEqual('Bureau of the Fiscal Service');
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
