import React from 'react';
import { renderHelper } from "../../../helpers/renderHelper";
import FilterSection from './filters';
import { mockDatasets } from '../mockData/mockDatasets';
import { mockFilters } from "../mockData/mockFilters";
import SearchResults from '../search-results/search-results';
import MobileFilterToggle from './mobileFilterToggle/mobileFilterToggle';
import FilterTimeRange, {
  timeRangeCompleteAnalyticsObject
} from './filterTimeRange/filterTimeRange';
import Analytics from '../../../utils/analytics/analytics';
import DateFilterTabs from './dateFilterTabs/dateFilterTabs';
import Tabs from '@material-ui/core/Tabs';
import { siteContext } from '../../persist/persist';
import SearchFilterSummary from './searchFilterSummary/searchFilterSummary';

jest.mock('../../../components/truncate/truncate.jsx', () => () => 'Truncator');

describe('Filter Main', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const setDateRangeTabSpy = jest.fn();

  let instance, renderer, lastUpdatedGroup,
    fileTypeGroup, searchResults, filters,
    isHandheld = false;

  beforeEach(() => {
    filters = mockFilters;
    ({instance, renderer} = renderHelper(
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy
        }}
      >
        <FilterSection
          searchResults={mockDatasets}
          allDatasets={mockDatasets}
          topicIcons={[]}
          availableFilters={filters}
          searchIsActive={true}
          searchQuery={[]}
          isHandheld={isHandheld}
        />
      </siteContext.Provider>
    ));

    lastUpdatedGroup = !instance.props.isHandheld
      ? instance.findByProps({'data-testid': 'last-updated-group'})
      : undefined;
    fileTypeGroup = !instance.props.isHandheld
      ? instance.findByProps({'data-testid': 'data-format-group'})
      : undefined;
    searchResults = instance.findByType(SearchResults);
  })


  it('displays the page title', () => {
    const title = instance.find(e => e.type === 'h1');
    expect(title.props.children).toBe('Filter Your Results');
  });

  it('places the searchFilterSummary with expected filter objects', () => {
    const summary = instance.findByType(SearchFilterSummary);
    expect(summary.props.activeFilters).toStrictEqual(['customDateRange']);
    expect(summary.props.allFilters).toStrictEqual(filters);
  });

  it('places the last updated filter group', () => {
    const lastUpdated = instance.findByProps({'data-testid': 'last-updated-group'}),
      title = instance.findByProps({'data-testid': 'last-updated-title'}),
      tip = instance.findByProps({'data-testid': 'last-updated-tip'});

    expect(lastUpdated).toBeDefined();
    expect(title.props.children).toContain('Last Updated');
    expect(tip).toBeDefined();
    expect(lastUpdated.props.filterTally).toBeDefined();
    expect(lastUpdated.props.currentFilters).toBeDefined();
  });

  it('places the file type filter group', () => {
    const lastUpdated = instance.findByProps({'data-testid': 'data-format-group'}),
      title = instance.findByProps({'data-testid': 'data-format-title'});

    expect(lastUpdated).toBeDefined();
    expect(title.props.children).toContain('Data Format');
    expect(lastUpdated.props.filterTally).toBeDefined();
    expect(lastUpdated.props.currentFilters).toBeDefined();
  });

  it(
    'places the start date filter group and the custom date range filter each under their tabs',
    () => {
      const title = instance.findByProps({'data-testid': 'date-range-title'});

      // first find custom date range filter since it's selected through persisted context
      instance.findByProps({'data-testid': 'time-range-filter'});

      // then switch tabs
      const dateFilterTabs = instance.findByType(DateFilterTabs);
      const tabs = dateFilterTabs.findByType(Tabs);
      renderer.act(() => {
        tabs.props.onChange({}, 0);
      });

      // then find the start-date filter group
      const lastUpdated = instance.findByProps({'data-testid': 'start-date-group'});

      expect(lastUpdated).toBeDefined();
      expect(title.props.children).toContain('Date Range');
      expect(lastUpdated.props.filterTally).toBeDefined();
      expect(lastUpdated.props.currentFilters).toBeDefined();
    }
  );

  it('places the publisher filter group', () => {
    const lastUpdated = instance.findByProps({'data-testid': 'publisher-group'}),
      title = instance.findByProps({'data-testid': 'publisher-title'});

    expect(lastUpdated).toBeDefined();
    expect(title.props.children).toContain('Dataset Publisher');
    expect(lastUpdated.props.filterTally).toBeDefined();
    expect(lastUpdated.props.currentFilters).toBeDefined();
  });

  it('places the topics filter group', () => {
    const topics = instance.findByProps({'data-testid': 'topics-group'}),
      title = instance.findByProps({'data-testid': 'topics-title'});

    expect(topics).toBeDefined();
    expect(title.props.children).toContain('Topics');
    expect(topics.props.availableFilters).toBeDefined();
  });

  it('places the last updated reset control', () => {
    const control = instance.findByProps({'data-testid': 'last-updated-reset'});
    expect(control.props.groupId).toBe('lastUpdated');
    expect(typeof control.props.activeFilters.length).toBeDefined();
    expect(typeof control.props.onGroupReset).toBe('function');
  });

  it('places the file type reset control', () => {
    const control = instance.findByProps({'data-testid': 'data-format-reset'});
    expect(control.props.groupId).toBe('dataFormat');
    expect(typeof control.props.activeFilters.length).toBeDefined();
    expect(typeof control.props.onGroupReset).toBe('function');
  });

  it('places the publisher reset control', () => {
    const control = instance.findByProps({'data-testid': 'publisher-reset'});
    expect(control.props.groupId).toBe('publisher');
    expect(typeof control.props.activeFilters.length).toBeDefined();
    expect(typeof control.props.onGroupReset).toBe('function');
  });

  it('places the topics reset control', () => {
    const control = instance.findByProps({'data-testid': 'topics-reset'});
    expect(control.props.groupId).toBe('topics');
    expect(typeof control.props.activeFilters.length).toBeDefined();
    expect(typeof control.props.onGroupReset).toBe('function');
  });

  it('pushes updates when group resets are called', () => {
    const control = instance.findByProps({'data-testid': 'last-updated-reset'});

    renderer.act(() => {
      //first clear away the persisted context initialized dateRange filter
      control.props.onGroupReset('dateRange');
      lastUpdatedGroup.props.onChange({key: 'ninetyDays', value: true});
      lastUpdatedGroup.props.onChange({key: 'sevenDays', value: true});
      control.props.onGroupReset('lastUpdated');
    });

    expect(control.props.activeFilters.length).toBe(0);
  })

  it(
    'passes search results and allDatasets through to the search results component on page load',
    () => {
      // first clear away the persisted-context initialized dateRange filter
      const control = instance.findByProps({'data-testid': 'start-date-reset'});
      renderer.act(() => {
        control.props.onGroupReset('dateRange');
      });

      expect(searchResults.props.filteredDatasets).toBe(mockDatasets);
      expect(searchResults.props.allDatasets).toBe(mockDatasets);
    }
  );

  it('filters datasets according to filter settings', () => {
    // first clear away the persisted-context initialized dateRange filter
    const control = instance.findByProps({'data-testid': 'start-date-reset'});
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({key: 'lastYear', value: true})
    });

    expect(searchResults.props.filteredDatasets.length).toBe(2);

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({key: 'ninetyDays', value: true})
    });

    // testing the OR WITHIN a filter group
    expect(searchResults.props.filteredDatasets.length).toBe(2);

    renderer.act(() => {
      fileTypeGroup.props.onChange({key: 'csv', value: true});
    });

    // testing the AND BETWEEN filter groups
    expect(searchResults.props.filteredDatasets.length).toBe(1);

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({key: 'ninetyDays', value: false})
    });

    expect(searchResults.props.filteredDatasets.length).toBe(1);

    const lastUpdatedReset = instance.findByProps({'data-testid': 'last-updated-reset'});
    const fileTypeReset = instance.findByProps({'data-testid': 'data-format-reset'});
    renderer.act(() => {
      lastUpdatedReset.props.onGroupReset('lastUpdated');
      fileTypeReset.props.onGroupReset('dataFormat');
    });
  });

  it('tallies datasets matching filters', () => {
    // first clear away the persisted-context initialized dateRange filter
    const control = instance.findByProps({'data-testid': 'start-date-reset'});
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });

    expect(lastUpdatedGroup.props.filterTally).toStrictEqual({
      lastYear: 2, ninetyDays: 2, thirtyDays: 1, startDateRangeFour: 1,
      startDateRangeThree: 1, startDateRangeTwo: 1, total: 3, csv: 2
    });
  });

  it('triggers a tracking event when a custom time range is set', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const dateFilterTabs = instance.findByType(DateFilterTabs);
    const tabs = dateFilterTabs.findByType(Tabs);
    renderer.act(() => {
      tabs.props.onChange({}, 1);
    });

    const timeRangeFilter = instance.findByType(FilterTimeRange);
    renderer.act(() => {
      timeRangeFilter.props.dateRangeFilter({active: true});
    });
    expect(spy).toHaveBeenLastCalledWith(timeRangeCompleteAnalyticsObject);
  });

  it('persists the tab selection for the Date Range Filters', () => {
    const dateFilterTabs = instance.findByType(DateFilterTabs);
    const tabs = dateFilterTabs.findByType(Tabs);
    renderer.act(() => {
      tabs.props.onChange({}, 0);
    });
    expect(setDateRangeTabSpy).toHaveBeenLastCalledWith(0);
    renderer.act(() => {
      tabs.props.onChange({}, 1);
    });
    expect(setDateRangeTabSpy).toHaveBeenLastCalledWith(1);
  });

  it(`persists state of the custom date range filter when it is reset and informs the
    child control accordingly`,
    () => {
      const timeRangeFilter = instance.findByType(FilterTimeRange);
      renderer.act(() => {
        timeRangeFilter.props.dateRangeFilter({active: true,
          beginDate: new Date(2019, 9, 2),
          endDate: new Date(2020, 10, 2),
          exactRange: true
        });
      });
      expect(timeRangeFilter.props.resetApplied).toStrictEqual(false);
      const control = instance.findByProps({'data-testid': 'start-date-reset'});
      expect(control.props.groupId).toBe('dateRange');
      renderer.act(() => {
        control.props.onGroupReset('dateRange');
      });
      expect(setBeginDateSpy).toHaveBeenLastCalledWith(null);
      expect(setEndDateSpy).toHaveBeenLastCalledWith(null);
      expect(setExactRangeSpy).toHaveBeenLastCalledWith(false);
      expect(timeRangeFilter.props.resetApplied).toStrictEqual(true);
    }
  );

  it('relays search active state to the search results component', () => {
    expect(searchResults.props.searchIsActive).toBeTruthy();
    isHandheld = true;
  });

  it("shows toggle button when using mobile device", () => {
    //switched in test above
    expect(instance.props.isHandheld).toEqual(true);
    const mobileToggle = instance.findByType(MobileFilterToggle);
    expect(mobileToggle).toBeDefined();
  });
});
