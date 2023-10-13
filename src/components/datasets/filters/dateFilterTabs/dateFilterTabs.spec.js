import React from 'react';
import DateFilterTabs, { timeRangeToggleClickAnalyticsObject } from './dateFilterTabs';
import renderer from 'react-test-renderer';
import { Tabs } from '@material-ui/core';
import Analytics from '../../../../utils/analytics/analytics';

describe('Date Filter Tabs', () => {
  let component = renderer.create();
  let instance;
  let filterResetSpy = null;
  let filterTabs;

  const filterTabsFn = jest.fn();

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(
        <DateFilterTabs
          selectedTab={0}
          setSelectedTab={filterTabsFn}
          onGroupReset={filterTabsFn}
          startDateComponent={<div>Start Date Component</div>}
          timeRangeComponent={<div>Time Range Component</div>}
        />
      );
    });

    instance = component.root;
    filterResetSpy = jest.spyOn(instance.props, 'onGroupReset');
    filterResetSpy.mockClear();
    filterTabs = instance.findByType(Tabs);
  });

  it('renders tabs element', () => {
    expect(filterTabs).toBeDefined();
  });

  it('contains a Start Date Tab and a Time Range Tab', () => {
    expect(filterTabs.props.children.length).toBe(2);
  });

  it('triggers onGroupReset when new tab is selected', () => {
    // initial value or selectedTab is 0
    expect(filterTabs.props.value).toBe(0);

    renderer.act(() => {
      filterTabs.props.onChange(1);
    });

    // resets both any date range filters if tab is changed
    expect(filterResetSpy).toHaveBeenCalledWith('startDate');
    expect(filterResetSpy).toHaveBeenCalledWith('dateRange');
  });

  it('issues a tracking even when the custom date range tab is selected', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const tabs = instance.findByType(Tabs);
    renderer.act(() => {
      tabs.props.onChange({}, 1);
    });
    expect(spy).toHaveBeenCalledWith(timeRangeToggleClickAnalyticsObject);
  });
});
