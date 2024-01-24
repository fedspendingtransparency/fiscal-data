import React from 'react';
import { renderHelper } from '../../../helpers/renderHelper';
import FilterSection from './filters';
import { mockDatasets } from '../mockData/mockDatasets';
import { mockFilters } from '../mockData/mockFilters';
import SearchResults from '../search-results/search-results';
import MobileFilterToggle from './mobileFilterToggle/mobileFilterToggle';
import FilterTimeRange, { timeRangeCompleteAnalyticsObject } from './filterTimeRange/filterTimeRange';
import Analytics from '../../../utils/analytics/analytics';
import DateFilterTabs from './dateFilterTabs/dateFilterTabs';
import Tabs from '@material-ui/core/Tabs';
import { siteContext } from '../../persist/persist';
import { render, fireEvent, getAllByTestId, within, cleanup } from '@testing-library/react';

jest.mock('../../../components/truncate/truncate.jsx', () => () => 'Truncator');

describe('Filter Main', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const setDateRangeTabSpy = jest.fn();

  let instance,
    renderer,
    component,
    lastUpdatedGroup,
    fileTypeGroup,
    searchResults,
    filters,
    isHandheld = false;

  beforeEach(() => {
    filters = mockFilters;
    component = (
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy,
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
    );
    // ({ instance, renderer } = renderHelper(
    //   <siteContext.Provider
    //     value={{
    //       beginDate: new Date(2019, 9, 1),
    //       setBeginDate: setBeginDateSpy,
    //       endDate: new Date(2021, 10, 1),
    //       setEndDate: setEndDateSpy,
    //       exactRange: true,
    //       setExactRange: setExactRangeSpy,
    //       dateRangeTab: 1,
    //       setDateRangeTab: setDateRangeTabSpy,
    //     }}
    //   >
    //     <FilterSection
    //       searchResults={mockDatasets}
    //       allDatasets={mockDatasets}
    //       topicIcons={[]}
    //       availableFilters={filters}
    //       searchIsActive={true}
    //       searchQuery={[]}
    //       isHandheld={isHandheld}
    //     />
    //   </siteContext.Provider>
    // ));
    //
    // lastUpdatedGroup = !instance.props.isHandheld ? instance.findByProps({ 'data-testid': 'last-updated-group' }) : undefined;
    // fileTypeGroup = !instance.props.isHandheld ? instance.findByProps({ 'data-testid': 'data-format-group' }) : undefined;
    // searchResults = instance.findByType(SearchResults);
  });

  afterEach(() => {
    cleanup();
  });

  it('The page title renders', () => {
    const { getByText } = render(component);
    expect(getByText('Filter Your Results')).toBeInTheDocument();
  });

  it('Applied custom date filter renders in filter summary', () => {
    const { getByLabelText } = render(component);
    expect(getByLabelText('10/01/2019 - 11/01/2021')).toBeInTheDocument();
  });

  it('places the last updated filter group', () => {
    const { getByTestId } = render(component);

    const filterWrapper = getByTestId('filter-wrapper');
    const lastUpdated = getByTestId('lastUpdatedFilter');
    const title = getByTestId('last-updated-title');

    expect(filterWrapper).toBeDefined();
    expect(lastUpdated).toBeDefined();
    expect(within(title).getByText('Last Updated')).toBeDefined();
  });

  it('places the file type filter group', () => {
    const { getByTestId } = render(component);

    const lastUpdated = getByTestId('dataFormatFilter');
    const title = getByTestId('data-format-title');
    expect(within(title).getByText('Data Format')).toBeDefined();
    expect(lastUpdated).toBeDefined();
  });

  it('places the start date filter group and the custom date range filter each under their tabs', () => {
    const { getByTestId } = render(component);

    const title = getByTestId('date-range-title');
    expect(title).toBeDefined();
    // first find custom date range filter since it's selected through persisted context
    const timeRangeFilter = getByTestId('time-range-filter');
    expect(timeRangeFilter).toBeDefined();
    // then switch tabs
    const dateFilterTabs = getByTestId('date-filter-tabs');
    expect(dateFilterTabs).toBeDefined();
    const filterTab = getByTestId('filter-tab-0');
    fireEvent.click(filterTab);
    // then find the start-date filter group
    const lastUpdated = getByTestId('startDateFilter');
    expect(lastUpdated).toBeDefined();
    expect(within(title).getByText('Date Range')).toBeDefined();
  });

  it('places the publisher filter group', () => {
    const { getByTestId } = render(component);

    const lastUpdated = getByTestId('publisherFilter');
    expect(lastUpdated).toBeDefined();
    const title = getByTestId('publisher-title');
    expect(title).toBeDefined();
    expect(within(title).getByText('Dataset Publisher')).toBeDefined();
  });

  it('places the topics filter group', () => {
    const { getByTestId } = render(component);

    const topicsTitle = getByTestId('topics-title');
    expect(topicsTitle).toBeDefined();
    expect(within(topicsTitle).getByText('Topics')).toBeDefined();
  });

  it('places the last updated reset control after a last updated filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const lastYearLabel = getByLabelText('lastYear');
    expect(lastYearLabel).toBeDefined();

    fireEvent.click(lastYearLabel);

    const control = getByTestId('lastUpdatedReset');
    expect(control).toBeDefined();
  });

  it('places the file type reset control after a file type filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const APILabel = getByLabelText('api');
    expect(APILabel).toBeDefined();

    fireEvent.click(APILabel);

    const control = getByTestId('dataFormatReset');
    expect(control).toBeDefined();
  });

  it('places the publisher reset control after a publisher filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const pubLabel = getByLabelText('adminResourceCenter');
    expect(pubLabel).toBeDefined();

    fireEvent.click(pubLabel);

    const control = getByTestId('publisherReset');
    expect(control).toBeDefined();
  });

  it('places the topics reset control after a topics filter has been selected', () => {
    const { getByTestId } = render(component);

    const searchLayout = getByTestId('search-layout');

    expect(searchLayout).toBeInTheDocument();

    const debtLabel = within(searchLayout).getByLabelText('savingsBonds');
    expect(debtLabel).toBeDefined();

    fireEvent.click(debtLabel);

    const control = getByTestId('topicsReset');
    expect(control).toBeDefined();
  });

  it('group filter is removed when group reset is called', () => {
    const { getByTestId, getByLabelText, getByText } = render(component);

    const reset = getByText('Clear All Filters');

    fireEvent.click(reset);

    const lastYearLabel = getByLabelText('lastYear');
    expect(lastYearLabel).toBeDefined();

    fireEvent.click(lastYearLabel);

    const filter = getByText('Last Updated:');

    expect(filter).toBeInTheDocument();

    const control = getByTestId('lastUpdatedReset');

    fireEvent.click(control);

    expect(filter).not.toBeInTheDocument();
  });

  it('passes search results and allDatasets through to the search results component on page load', () => {
    // first clear away the persisted-context initialized dateRange filter
    const control = instance.findByProps({ 'data-testid': 'start-date-reset' });
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });

    expect(searchResults.props.filteredDatasets).toBe(mockDatasets);
    expect(searchResults.props.allDatasets).toBe(mockDatasets);
  });

  it('filters datasets according to filter settings', () => {
    // first clear away the persisted-context initialized dateRange filter
    const control = instance.findByProps({ 'data-testid': 'start-date-reset' });
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({ key: 'lastYear', value: true });
    });

    expect(searchResults.props.filteredDatasets.length).toBe(2);

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({ key: 'ninetyDays', value: true });
    });

    // testing the OR WITHIN a filter group
    expect(searchResults.props.filteredDatasets.length).toBe(2);

    renderer.act(() => {
      fileTypeGroup.props.onChange({ key: 'csv', value: true });
    });

    // testing the AND BETWEEN filter groups
    expect(searchResults.props.filteredDatasets.length).toBe(1);

    renderer.act(() => {
      lastUpdatedGroup.props.onChange({ key: 'ninetyDays', value: false });
    });

    expect(searchResults.props.filteredDatasets.length).toBe(1);

    const lastUpdatedReset = instance.findByProps({ 'data-testid': 'last-updated-reset' });
    const fileTypeReset = instance.findByProps({ 'data-testid': 'data-format-reset' });
    renderer.act(() => {
      lastUpdatedReset.props.onGroupReset('lastUpdated');
      fileTypeReset.props.onGroupReset('dataFormat');
    });
  });

  it('tallies datasets matching filters', () => {
    // first clear away the persisted-context initialized dateRange filter
    const control = instance.findByProps({ 'data-testid': 'start-date-reset' });
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });

    expect(lastUpdatedGroup.props.filterTally).toStrictEqual({
      lastYear: 2,
      ninetyDays: 2,
      thirtyDays: 1,
      startDateRangeFour: 1,
      startDateRangeThree: 1,
      startDateRangeTwo: 1,
      total: 3,
      csv: 2,
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
      timeRangeFilter.props.dateRangeFilter({ active: true });
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
    child control accordingly`, () => {
    const timeRangeFilter = instance.findByType(FilterTimeRange);
    renderer.act(() => {
      timeRangeFilter.props.dateRangeFilter({ active: true, beginDate: new Date(2019, 9, 2), endDate: new Date(2020, 10, 2), exactRange: true });
    });
    expect(timeRangeFilter.props.resetApplied).toStrictEqual(false);
    const control = instance.findByProps({ 'data-testid': 'start-date-reset' });
    expect(control.props.groupId).toBe('dateRange');
    renderer.act(() => {
      control.props.onGroupReset('dateRange');
    });
    expect(setBeginDateSpy).toHaveBeenLastCalledWith(null);
    expect(setEndDateSpy).toHaveBeenLastCalledWith(null);
    expect(setExactRangeSpy).toHaveBeenLastCalledWith(false);
    expect(timeRangeFilter.props.resetApplied).toStrictEqual(true);
  });

  it('relays search active state to the search results component', () => {
    expect(searchResults.props.searchIsActive).toBeTruthy();
    isHandheld = true;
  });

  it('shows toggle button when using mobile device', () => {
    //switched in test above
    expect(instance.props.isHandheld).toEqual(true);
    const mobileToggle = instance.findByType(MobileFilterToggle);
    expect(mobileToggle).toBeDefined();
  });
});

describe('GA4 test of datalayer push', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const setDateRangeTabSpy = jest.fn();

  let isHandheld = false;
  let filters = mockFilters;

  it('trigger GA4 datalayer push testing', () => {
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

    const { getAllByTestId } = render(
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy,
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
    );

    expect(getAllByTestId('infoTipButton')[0]).toBeInTheDocument();
    fireEvent.click(getAllByTestId('infoTipButton')[0]);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Last Updated',
    });
  });
});
