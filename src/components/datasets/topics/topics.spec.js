import { filtersByGroupId } from '../../../transform/filters/filterDefinitions';
import Topics from './topics';
import React from 'react';
import { mockFilters } from '../mockData/mockFilters';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Topics component', () => {
  const activeFilterId = 'interestExchangeRates';
  const filters = mockFilters;

  filters.filter(filter => filter.id === activeFilterId)[0].active = true;

  const group = filtersByGroupId('topics', filters),
    mockChange = { key: 'savingsBonds', value: true },
    mockChangeHandler = jest.fn(),
    onGroupReset = jest.fn();

  it('renders a Topics component for every item in the group', () => {
    const { getAllByTestId } = render(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId="topics"
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />
    );
    const topics = getAllByTestId('topic-selector-button');
    expect(topics.length).toBe(group.length);
  });

  it('supplies a label to the filter topic', () => {
    const { getAllByTestId } = render(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId="topics"
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />
    );
    const topics = getAllByTestId('topic-selector-label');
    expect(within(topics[0]).getByText(group[0].label)).toBeInTheDocument();
  });

  it('passes the activeFilter prop down to the filterGroup component', () => {
    const { getByTestId } = render(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId="topics"
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />
    );
    const filterGroup = getByTestId('topicsReset');
    expect(within(filterGroup).getByText([activeFilterId].length)).toBeInTheDocument();
  });

  it('passes filter changes up to the parent', () => {
    const { getAllByRole } = render(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId="topics"
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />
    );
    const topicButtons = getAllByRole('button', { name: '' }); // excludes filter resent
    userEvent.click(topicButtons[0]);
    expect(mockChangeHandler).toHaveBeenCalledWith(mockChange);
  });

  it('passes the current state to the topic', () => {
    const { getByTestId } = render(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId="topics"
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />
    );
    const debtTopicButton = getByTestId('debtButton');
    const interestExchangeRatesTopicButton = getByTestId('interestExchangeRatesButton');
    expect(within(debtTopicButton).getByTestId('topic-selector-button')).not.toHaveClass('topicActive');
    expect(within(interestExchangeRatesTopicButton).getByTestId('topic-selector-button')).toHaveClass('topicActive');
  });
});
