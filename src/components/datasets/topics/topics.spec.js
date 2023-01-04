import {filtersByGroupId} from "../../../transform/filters/filterDefinitions";
import {renderHelper} from "../../../helpers/renderHelper";
import Topics from "./topics";
import Topic from './topic/topic';
import FilterGroupReset from '../filters/filterGroupReset/filterGroupReset';
import React from "react";
import { mockFilters } from "../mockData/mockFilters"

describe('Topics component', () => {
  const activeFilterId = 'interestExchangeRates';
  const filters = mockFilters;

  filters.filter(filter => filter.id === activeFilterId)[0].active = true;

  const group = filtersByGroupId('topics', filters),
    mockChange = { mockKey: true },
    mockChangeHandler = jest.fn(),
    onGroupReset = jest.fn();

  let instance, renderer, topics;

  beforeEach(() => {
    ({ instance, renderer } = renderHelper(
      <Topics
        activeFilters={[activeFilterId]}
        onChange={mockChangeHandler}
        currentFilters={filters}
        availableFilters={filters}
        groupId='topics'
        onGroupReset={onGroupReset}
        topicIcons={[]}
      />));
    topics = instance.findAllByType(Topic);
  });

  it('renders a Topics component for every item in the group', () => {
    expect(topics.length).toBe(group.length);
  });

  it('supplies a label to the filter topic', () => {
    expect(topics[0].props.label).toBe(group[0].label)
  });

  it('passes the slug to the filter topic', () => {
    expect(topics[0].props.slug).toBe(group[0].slug);
  });

  it('passes the activeFilter prop down to the filterGroup component', () => {
    const filterGroup = instance.findByType(FilterGroupReset);
    expect(filterGroup.props.activeFilters).toStrictEqual([activeFilterId]);
  });

  it('passes filter changes up to the parent', () => {
    renderer.act(() => {
      topics[0].props.onChange(mockChange)
    });
    expect(mockChangeHandler).toHaveBeenCalledWith(mockChange);
  });

  it('passes the current state to the topic', () => {
    expect(instance.findByProps({ filterKey: 'debt' }).props.active).toBeFalsy();
    expect(instance.findByProps({ filterKey: 'interestExchangeRates' }).props.active).toBeTruthy();
  });
});
